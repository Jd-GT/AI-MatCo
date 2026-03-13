'use client'

export default function Hero() {
  return (
    <header className="relative z-10 text-center pt-20 pb-12 px-4">
      {/* Top label */}
      <div
        className="animate-fade-up inline-flex items-center gap-2 mb-6"
        style={{ animationDelay: '0ms' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--color-neon)',
            border: '1px solid rgba(0,255,136,0.2)',
            background: 'rgba(0,255,136,0.06)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          ✦ AI Recommender
        </span>
      </div>

      {/* Main headline */}
      <h1
        className="animate-fade-up"
        style={{
          animationDelay: '80ms',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
          marginBottom: '0.5rem',
        }}
      >
        Encuentra la{' '}
        <span style={{ color: 'var(--color-neon)' }}>IA perfecta</span>
        <br />
        para tu tarea
        <span className="cursor" />
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-up"
        style={{
          animationDelay: '160ms',
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: 'var(--color-text-muted)',
          maxWidth: '500px',
          margin: '1rem auto 0',
          lineHeight: 1.6,
        }}
      >
        Describe lo que necesitas hacer y te recomendamos
        el modelo de IA mas adecuado entre mas de 20 opciones.
      </p>

      {/* Stats row */}
      <div
        className="animate-fade-up flex items-center justify-center gap-8 mt-8"
        style={{ animationDelay: '240ms' }}
      >
        {[
          { value: '50+', label: 'modelos' },
          { value: '18', label: 'categorias' },
          { value: '100%', label: 'gratuito' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-neon)',
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--color-text-faint)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </header>
  )
}
