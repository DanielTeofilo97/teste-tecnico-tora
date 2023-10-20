import NextAuthSessionProvider from '@/providers/sessionProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import { Toaster } from '@/components/ui/toaster';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FJ Company',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en">
        <body className={inter.className}>
          <div className="flex h-full flex-col">
            <NextAuthSessionProvider>
                <div className="flex-1">{children}</div>
                <Toaster />
            </NextAuthSessionProvider>    
          </div>
        </body>
      </html>
  )
}

