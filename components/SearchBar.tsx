'use client'

import { useEffect, useRef, useState } from 'react'

const PLACEHOLDERS = [
  'quiero hacer un chatbot para mi tienda...',
  'necesito analizar datos de ventas en Python...',
  'quiero crear imagenes para mis redes sociales...',
  'necesito traducir documentos al ingles...',
  'quiero generar musica para mi podcast...',
  'necesito ayuda con matematicas universitarias...',
  'quiero escribir una novela de ciencia ficcion...',
  'necesito analizar un contrato legal...',
  'quiero crear videos cortos para TikTok...',
  'necesito investigar sobre inteligencia artificial...',
]

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Animacion de placeholder con typewriter effect
  useEffect(() => {
    if (value) return // no animar si hay texto

    const target = PLACEHOLDERS[placeholderIndex]

    const tick = () => {
      if (!isDeleting) {
        if (displayedPlaceholder.length < target.length) {
          setDisplayedPlaceholder(target.slice(0, displayedPlaceholder.length + 1))
          timeoutRef.current = setTimeout(tick, 45)
        } else {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayedPlaceholder.length > 0) {
          setDisplayedPlaceholder(displayedPlaceholder.slice(0, -1))
          timeoutRef.current = setTimeout(tick, 20)
        } else {
          setIsDeleting(false)
          setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, 60)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayedPlaceholder, isDeleting, placeholderIndex, value])

  return (
    <div
      className="animate-fade-up relative w-full max-w-2xl mx-auto"
      style={{ animationDelay: '320ms' }}
    >
      {/* Search icon */}
      <div
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
          zIndex: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
        }}
      >
        ›_
      </div>

      <input
        ref={inputRef}
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={value ? '' : (displayedPlaceholder || PLACEHOLDERS[0])}
        autoComplete="off"
        spellCheck={false}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            lineHeight: 1,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          aria-label="Limpiar busqueda"
        >
          ×
        </button>
      )}

      {/* Hint */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--color-text-faint)',
          textAlign: 'center',
          marginTop: '0.5rem',
          letterSpacing: '0.05em',
        }}
      >
        Escribe en cualquier idioma · o selecciona una categoria abajo
      </p>
    </div>
  )
}
