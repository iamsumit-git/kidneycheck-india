import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KidneyCheck India — Free Kidney Health Screening',
  description: 'Check your kidney health risk in 60 seconds. Free, private, in Hindi and English. Powered by AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
