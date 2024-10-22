import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ResponsiveNav from "@/components/navigation/ResponsiveNav"
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/auth-context'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "TravelApp - Plan and Manage Your Trips",
    template: "%s | TravelApp"
  },
  description: "Plan and manage your trips with ease. TravelApp helps you organize itineraries, track budgets, and discover new destinations.",
  keywords: ["travel", "trip planning", "itinerary", "budget", "vacation"],
  authors: [{ name: "TravelApp Team" }],
  creator: "TravelApp",
  publisher: "TravelApp",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://travelapp.example.com",
    siteName: "TravelApp",
    title: "TravelApp - Your Ultimate Trip Planning Companion",
    description: "Plan, manage, and enjoy your trips with TravelApp. Organize itineraries, track expenses, and discover new adventures.",
    images: [
      {
        url: "https://travelapp.example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TravelApp - Plan Your Next Adventure"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelApp - Plan Your Next Adventure",
    description: "Discover, plan, and manage your trips with ease using TravelApp.",
    images: ["https://travelapp.example.com/twitter-image.jpg"],
    creator: "@travelapp"
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <ResponsiveNav />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
