import { AIModel, ALL_MODELS, MODELS_BY_CATEGORY, ModelCategory } from './models'
import { CATEGORIES, Category } from './categories'

export interface MatchResult {
  model: AIModel
  score: number
  matchedCategory: ModelCategory
  matchedCategoryLabel: string
  matchedCategoryEmoji: string
  reasonWhy: string
}

// Tokenizar texto — normalizar, split y filtrar tokens cortos
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2)
}

// Calcular score de una categoria contra los tokens del query
function scoreCategoryAgainstTokens(
  category: Category,
  queryTokens: string[],
  queryRaw: string
): number {
  let score = 0
  const queryNorm = queryRaw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  for (const keyword of category.keywords) {
    const kwNorm = keyword
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    // Match exacto de frase completa — peso alto
    if (queryNorm.includes(kwNorm)) {
      score += kwNorm.split(' ').length > 1 ? 3 : 2
    } else {
      // Match de tokens individuales
      const kwTokens = tokenize(keyword)
      for (const qt of queryTokens) {
        for (const kt of kwTokens) {
          if (qt === kt) score += 1
          else if (qt.length > 4 && kt.startsWith(qt)) score += 0.5
          else if (kt.length > 4 && qt.startsWith(kt)) score += 0.5
        }
      }
    }
  }

  return score
}

// Rank modelos por relevancia dentro de una categoria
function rankModelsInCategory(
  models: AIModel[],
  category: ModelCategory
): AIModel[] {
  return [...models].sort((a, b) => {
    // Tier S > A > B
    const tierScore = { S: 3, A: 2, B: 1 }
    const tierDiff = tierScore[b.tier] - tierScore[a.tier]
    if (tierDiff !== 0) return tierDiff
    // Si mismo tier, mas badges = primero
    return b.badges.length - a.badges.length
  })
}

export function matchQuery(query: string): MatchResult[] {
  if (!query.trim()) return []

  const queryTokens = tokenize(query)

  // Score por categoria — js-index-maps: Set para deduplicacion
  const categoryScores = new Map<ModelCategory, number>()

  for (const category of CATEGORIES) {
    const score = scoreCategoryAgainstTokens(category, queryTokens, query)
    if (score > 0) {
      categoryScores.set(category.id, score)
    }
  }

  if (categoryScores.size === 0) {
    // Fallback: devolver top modelos generales
    return ALL_MODELS.filter((m) => m.tier === 'S')
      .slice(0, 6)
      .map((model) => ({
        model,
        score: 1,
        matchedCategory: model.categories[0],
        matchedCategoryLabel: CATEGORIES.find((c) => c.id === model.categories[0])?.label ?? '',
        matchedCategoryEmoji: CATEGORIES.find((c) => c.id === model.categories[0])?.emoji ?? '',
        reasonWhy: model.reasonWhy[model.categories[0]],
      }))
  }

  // Ordenar categorias por score
  const sortedCategories = [...categoryScores.entries()].sort(([, a], [, b]) => b - a)

  // Recolectar modelos — deduplicar por modelo ID con el mejor score
  const modelScores = new Map<string, MatchResult>()

  for (const [categoryId, catScore] of sortedCategories.slice(0, 4)) {
    const models = MODELS_BY_CATEGORY.get(categoryId) ?? []
    const ranked = rankModelsInCategory(models, categoryId)
    const categoryDef = CATEGORIES.find((c) => c.id === categoryId)!

    for (const model of ranked.slice(0, 4)) {
      const existing = modelScores.get(model.id)
      const finalScore = catScore + (model.tier === 'S' ? 2 : model.tier === 'A' ? 1 : 0)

      if (!existing || finalScore > existing.score) {
        modelScores.set(model.id, {
          model,
          score: finalScore,
          matchedCategory: categoryId,
          matchedCategoryLabel: categoryDef.label,
          matchedCategoryEmoji: categoryDef.emoji,
          reasonWhy: model.reasonWhy[categoryId],
        })
      }
    }
  }

  // Ordenar resultados finales por score desc
  return [...modelScores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}

// Match directo por categoria — para click en chips
export function matchByCategory(categoryId: ModelCategory): MatchResult[] {
  const models = MODELS_BY_CATEGORY.get(categoryId) ?? []
  const categoryDef = CATEGORIES.find((c) => c.id === categoryId)!
  const ranked = rankModelsInCategory(models, categoryId)

  return ranked.map((model) => ({
    model,
    score: model.tier === 'S' ? 3 : model.tier === 'A' ? 2 : 1,
    matchedCategory: categoryId,
    matchedCategoryLabel: categoryDef.label,
    matchedCategoryEmoji: categoryDef.emoji,
    reasonWhy: model.reasonWhy[categoryId],
  }))
}
