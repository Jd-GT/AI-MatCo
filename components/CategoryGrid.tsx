'use client'

import { CATEGORIES } from '@/lib/categories'
import { ModelCategory } from '@/lib/models'

interface CategoryGridProps {
  activeCategory: ModelCategory | null
  onSelect: (category: ModelCategory | null) => void
}

export default function CategoryGrid({ activeCategory, onSelect }: CategoryGridProps) {
  return (
    <div
      className="animate-fade-up w-full max-w-3xl mx-auto"
      style={{ animationDelay: '400ms' }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--color-text-faint)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
          textAlign: 'center',
        }}
      >
        Categorias rapidas
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(activeCategory === cat.id ? null : cat.id)}
          >
            <span style={{ fontSize: '0.85em' }}>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
