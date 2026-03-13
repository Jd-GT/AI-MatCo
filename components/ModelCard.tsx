'use client'

import { memo } from 'react'
import { MatchResult } from '@/lib/matcher'
import { Badge } from '@/lib/models'

// Static JSX for badge config — hoisted outside component (rendering-hoist-jsx)
const BADGE_CONFIG: Record<Badge, { label: string; cls: string; icon: string }> = {
  'mejor-calidad': { label: 'Mejor calidad', cls: 'badge-quality', icon: '★' },
  'mas-rapido':    { label: 'Mas rapido',    cls: 'badge-speed',   icon: '⚡' },
  'gratuito':      { label: 'Gratuito',      cls: 'badge-free',    icon: '◎' },
  'open-source':   { label: 'Open source',   cls: 'badge-open',    icon: '◈' },
  'mas-barato':    { label: 'Mas barato',    cls: 'badge-cheap',   icon: '◇' },
  'multimodal':    { label: 'Multimodal',    cls: 'badge-multi',   icon: '◉' },
  'razonamiento':  { label: 'Razonamiento',  cls: 'badge-reason',  icon: '◆' },
  'especializado': { label: 'Especializado', cls: 'badge-spec',    icon: '◑' },
  'privacidad':    { label: 'Privacidad',    cls: 'badge-priv',    icon: '◐' },
}

interface ModelCardProps {
  result: MatchResult
  index: number
}

// Memoized to avoid re-renders when siblings update — rerender-memo
const ModelCard = memo(function ModelCard({ result, index }: ModelCardProps) {
  const { model, matchedCategoryLabel, matchedCategoryEmoji, reasonWhy } = result

  const delay = Math.min(index * 60, 400)

  return (
    <div
      className="model-card animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Emoji logo */}
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '6px',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              flexShrink: 0,
            }}
          >
            {model.emoji}
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {model.name}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--color-text-muted)',
                margin: '0.2rem 0 0',
                letterSpacing: '0.05em',
              }}
            >
              {model.company}
            </p>
          </div>
        </div>

        {/* Tier badge */}
        <span
          className={`tier-${model.tier.toLowerCase()}`}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            border: '1px solid currentColor',
            padding: '0.15rem 0.4rem',
            borderRadius: '3px',
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          {model.tier}
        </span>
      </div>

      {/* Category match */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--color-electric)',
          letterSpacing: '0.05em',
        }}
      >
        <span>{matchedCategoryEmoji}</span>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {matchedCategoryLabel}
        </span>
      </div>

      {/* Reason why */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {reasonWhy}
      </p>

      {/* Footer: badges + price */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: 'auto' }}>
        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {model.badges.map((badge) => {
            const cfg = BADGE_CONFIG[badge]
            return (
              <span key={badge} className={`badge ${cfg.cls}`}>
                {cfg.icon} {cfg.label}
              </span>
            )
          })}
        </div>

        {/* Price */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--color-text-faint)',
            letterSpacing: '0.03em',
            marginLeft: 'auto',
          }}
        >
          {model.price}
        </span>
      </div>
    </div>
  )
})

export default ModelCard
