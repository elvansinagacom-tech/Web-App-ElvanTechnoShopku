import './globals.css'

export const metadata = {
  title: 'ElvanTechnoShop',
  description: 'Dibuat resmi oleh Elvan Parlin Agustario Sinaga',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}