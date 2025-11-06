import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Stands Map',
  description: 'Interactive 3D stands map made by CHOUBIK Houssam | ADE ENSAM Casablanca 2025'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased touch-manipulation">{children}</body>
    </html>
  )
}
