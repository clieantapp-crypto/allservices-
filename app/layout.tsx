import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"


export const metadata: Metadata = {
  title: "بوابة الخدمة الإلكتروني - فواتير وتعبئة رصيد",
  description: "استعرض وادفع فواتير الكهرباء والماء وقم بتعبئة رصيد هاتفك بسهولة.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cn("min-h-screen bg-background font-sans antialiased", notoKufiArabic.className)}>
        {children}
      </body>
    </html>
  )
}
