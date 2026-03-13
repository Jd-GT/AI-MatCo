'use client'

import { useState, useMemo, useCallback } from 'react'
import Hero from '@/components/Hero'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import ResultsPanel from '@/components/ResultsPanel'
import { matchQuery, matchByCategory, MatchResult } from '@/lib/matcher'
import { ModelCategory } from '@/lib/models'

export default function Home() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ModelCategory | null>(null)

  // Derive results during render — no useEffect needed (rerender-derived-state-no-effect)
  const results: MatchResult[] = useMemo(() => {
    if (activeCategory) return matchByCategory(activeCategory)
    if (query.trim().length >= 2) return matchQuery(query)
    return []
  }, [query, activeCategory])

  const showResults = activeCategory !== null || query.trim().length >= 2

  // Stable callbacks — rerender-functional-setstate
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value)
    if (value) setActiveCategory(null)
  }, [])

  const handleCategorySelect = useCallback((category: ModelCategory | null) => {
    setActiveCategory(category)
    if (category) setQuery('')
  }, [])

  const handleClear = useCallback(() => {
    setQuery('')
    setActiveCategory(null)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Ambient glow top */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '40vh',
          background:
            'radial-gradient(ellipse, rgba(0,255,136,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Hero */}
      <Hero />

      {/* Main content */}
      <main
        style={{
          width: '100%',
          maxWidth: '900px',
          padding: '0 1.25rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Search */}
        <SearchBar
          value={query}
          onChange={handleQueryChange}
          onClear={handleClear}
        />

        {/* Category chips */}
        <CategoryGrid
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />

        {/* Separator */}
        {showResults && (
          <div
            style={{
              width: '100%',
              height: '1px',
              background:
                'linear-gradient(to right, transparent, var(--color-border), transparent)',
            }}
          />
        )}

        {/* Results */}
        <div style={{ width: '100%' }}>
          <ResultsPanel
            results={results}
            query={query}
            isVisible={showResults}
          />
        </div>

        {/* Empty state — welcome */}
        {!showResults && (
          <div
            className="animate-fade-in"
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              width: '100%',
            }}
          >
            {/* Example queries */}
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--color-text-faint)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Ejemplos de busqueda
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
              }}
            >
              {[
                'Quiero hacer un chatbot',
                'Analizar datos de ventas',
                'Crear logo para mi empresa',
                'Traducir documentos al ingles',
                'Componer una cancion',
                'Resolver ecuaciones diferenciales',
                'Revisar un contrato',
                'Preparar mi examen de fisica',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => handleQueryChange(example)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--color-text-faint)',
                    border: '1px solid var(--color-border)',
                    background: 'none',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-neon)'
                    e.currentTarget.style.color = 'var(--color-neon)'
                    e.currentTarget.style.background = 'var(--color-neon-glow)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.color = 'var(--color-text-faint)'
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          borderTop: '1px solid var(--color-border)',
          padding: '1.5rem',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--color-text-faint)',
            letterSpacing: '0.08em',
          }}
        >
          AIMatch · Datos curados · Sin rastreo · Sin cookies
        </p>
      </footer>
    </div>
  )
}
