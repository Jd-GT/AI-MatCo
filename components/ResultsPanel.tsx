'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { MatchResult } from '@/lib/matcher'
import { Badge } from '@/lib/models'
import ModelCard from './ModelCard'

interface ResultsPanelProps {
  results: MatchResult[]
  query: string
  isVisible: boolean
}

// Hoisted — static, never re-created on render
const BADGE_CONFIG: Record<Badge, { label: string; icon: string }> = {
  'mejor-calidad': { label: 'Mejor calidad', icon: '★' },
  'mas-rapido':    { label: 'Mas rapido',    icon: '⚡' },
  'gratuito':      { label: 'Gratuito',      icon: '◎' },
  'open-source':   { label: 'Open source',   icon: '◈' },
  'mas-barato':    { label: 'Mas barato',    icon: '◇' },
  'multimodal':    { label: 'Multimodal',    icon: '◉' },
  'razonamiento':  { label: 'Razonamiento',  icon: '◆' },
  'especializado': { label: 'Especializado', icon: '◑' },
  'privacidad':    { label: 'Privacidad',    icon: '◐' },
}

const BADGE_ORDER: Badge[] = [
  'mejor-calidad', 'multimodal', 'razonamiento', 'gratuito',
  'mas-barato', 'mas-rapido', 'open-source', 'especializado', 'privacidad',
]

export default function ResultsPanel({ results, query, isVisible }: ResultsPanelProps) {
  const [activeBadges, setActiveBadges] = useState<Set<Badge>>(new Set())

  // Reset filters when result set changes
  useEffect(() => {
    setActiveBadges(new Set())
  }, [results])

  // Only badges present in current results, in defined order
  const presentBadges = useMemo<Badge[]>(() => {
    const found = new Set<Badge>()
    for (const r of results) {
      for (const b of r.model.badges) found.add(b)
    }
    return BADGE_ORDER.filter((b) => found.has(b))
  }, [results])

  // OR logic — show model if it has at least one active badge
  const filteredResults = useMemo(() => {
    if (activeBadges.size === 0) return results
    return results.filter((r) => r.model.badges.some((b) => activeBadges.has(b)))
  }, [results, activeBadges])

  const toggleBadge = useCallback((badge: Badge) => {
    setActiveBadges((prev) => {
      const next = new Set(prev)
      if (next.has(badge)) next.delete(badge)
      else next.add(badge)
      return next
    })
  }, [])

  if (!isVisible) return null

  if (results.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          No se encontraron coincidencias para &quot;{query}&quot;
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-faint)', marginTop: '0.5rem' }}>
          Prueba con terminos mas especificos o selecciona una categoria
        </p>
      </div>
    )
  }

  return (
    <section style={{ width: '100%' }}>
      {/* Header */}
      <div
        className="animate-fade-in"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}
      >
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {filteredResults.length} recomendacion{filteredResults.length !== 1 ? 'es' : ''}
          {activeBadges.size > 0 && (
            <span style={{ color: 'var(--color-neon)', marginLeft: '0.4em' }}>(filtrado)</span>
          )}
        </p>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)', margin: '0 1rem' }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-faint)', letterSpacing: '0.05em' }}>
          ordenadas por relevancia
        </p>
      </div>

      {/* Badge filter strip */}
      {presentBadges.length > 0 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {presentBadges.map((badge) => {
            const cfg = BADGE_CONFIG[badge]
            const isActive = activeBadges.has(badge)
            return (
              <button
                key={badge}
                onClick={() => toggleBadge(badge)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: isActive ? '1px solid var(--color-neon)' : '1px solid var(--color-border)',
                  background: isActive ? 'var(--color-neon-glow)' : 'transparent',
                  color: isActive ? 'var(--color-neon)' : 'var(--color-text-faint)',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--color-text-muted)'
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-text-faint)'
                  }
                }}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
              </button>
            )
          })}

          {activeBadges.size > 0 && (
            <button
              onClick={() => setActiveBadges(new Set())}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-faint)',
                transition: 'all 0.15s ease',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff4444'
                e.currentTarget.style.color = '#ff4444'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-faint)'
              }}
            >
              × limpiar
            </button>
          )}
        </div>
      )}

      {/* Empty after filter */}
      {filteredResults.length === 0 && (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Ningun modelo coincide con los filtros activos
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-faint)', marginTop: '0.4rem' }}>
            Prueba quitando algun filtro
          </p>
        </div>
      )}

      {/* Grid */}
      {filteredResults.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '1rem' }}>
          {filteredResults.map((result, i) => (
            <ModelCard key={`${result.model.id}-${i}`} result={result} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
