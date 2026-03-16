import './globals.css'

export const metadata = {
  title: 'ElvanTechnoShop',
  description: 'Dibuat resmi oleh Elvan Parlin Agustario Sinaga',
  manifest: '/manifest.json'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>{children}</body>
    </html>
  )
}
