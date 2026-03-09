import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free Resources | Because of Sales',
  description: 'Claim your free sales resources from Because of Sales.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
