import type { Metadata } from 'next'
import { JetBrains_Mono, DM_Sans } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AIMatch — Encuentra la IA perfecta para tu tarea',
  description:
    'Recomendador inteligente de modelos de IA. Describe tu caso de uso y descubre el modelo perfecto entre mas de 20 opciones: coding, imagenes, traduccion, musica, legal, finanzas y mas.',
  keywords: ['IA', 'inteligencia artificial', 'modelos', 'ChatGPT', 'Claude', 'Gemini', 'recomendador'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
