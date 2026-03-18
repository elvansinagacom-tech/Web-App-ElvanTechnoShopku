import './globals.css'

export const metadata = {
  title: 'ElvanTechnoShop',
  description: 'Dibuat resmi oleh Elvan Parlin Agustario Sinaga',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="overscroll-none">
      <body className="overscroll-none">
        {children}
      </body>
    </html>
  )
}
