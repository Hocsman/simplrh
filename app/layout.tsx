import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { CookieConsent } from '@/components/CookieConsent'
import { CookieErrorSuppressor } from '@/components/CookieErrorSuppressor'
import { generateMetadata } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata = generateMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Clean up malformed Supabase cookies before anything else loads
                  const keysToRemove = [];
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('sb-')) {
                      try {
                        const value = localStorage.getItem(key);
                        if (value) JSON.parse(value);
                      } catch (e) {
                        keysToRemove.push(key);
                      }
                    }
                  }
                  keysToRemove.forEach(key => {
                    try { localStorage.removeItem(key); } catch(e) {}
                  });
                } catch (err) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <CookieErrorSuppressor />
        {children}
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  )
}