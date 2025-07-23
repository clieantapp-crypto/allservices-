import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'خدمات عامة ',
  description: ' كل الخدمات العامة  ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar">
      <head>
      </head>
      <body>{children}</body>
    </html>
  )
}
