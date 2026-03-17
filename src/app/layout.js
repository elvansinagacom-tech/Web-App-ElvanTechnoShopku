import './globals.css'

export const metadata = {
  title: 'ElvanTechnoShop',
  description: 'Dibuat resmi oleh Elvan Parlin Agustario Sinaga',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
    <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body className={... (biarkan kode body bawaan Bos tetap di sini)}>
        {children}
      </body>
      <body>{children}</body>
    </html>
  )
}
export const viewport = {
  themeColor: '#020617', // Ini adalah warna hex dari bg-slate-950 (Warna tema aplikasi Bos)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Mencegah user nge-zoom layar pakai 2 jari
  viewportFit: 'cover', // INI MANTRA AJAIBNYA! (Biar aplikasi tembus ke belakang jam)
};
export const metadata = {
  title: 'ElvanTechnoShop',
  description: '...',
}
