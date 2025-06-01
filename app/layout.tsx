import type React from "react"
import type { Metadata } from "next"
import { Poppins, Montserrat } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "A.M.O Distribution Ltd - Premium Spare Parts | BMW, Audi, Mercedes & 4x4 Parts Mauritius",
  description:
    "Leading spare parts distributor in Mauritius specializing in German cars (BMW, Audi, Mercedes) and 4x4 vehicles (Toyota Hilux, Ford Ranger, Navara). Genuine parts, fast delivery, competitive prices. Trusted by 500+ Mauritians since 2010.",
  keywords:
    "spare parts mauritius, BMW parts, Audi parts, Mercedes parts, Toyota Hilux parts, Ford Ranger parts, Navara parts, car parts mauritius, 4x4 parts, genuine parts, auto parts port louis, german car parts mauritius",
  authors: [{ name: "A.M.O Distribution Ltd" }],
  openGraph: {
    title: "A.M.O Distribution Ltd - Premium Spare Parts Mauritius",
    description:
      "Your trusted partner for genuine spare parts in Mauritius. BMW, Audi, Mercedes & 4x4 parts with 1-hour quotes and same-day delivery.",
    type: "website",
    locale: "en_US",
    siteName: "A.M.O Distribution Ltd",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  )
}
