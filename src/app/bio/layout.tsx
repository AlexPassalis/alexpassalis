import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preconnect"
        href="https://www.linkedin.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://github.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://www.facebook.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://www.instagram.com"
        crossOrigin="anonymous"
      />
      {children}
    </>
  )
}
