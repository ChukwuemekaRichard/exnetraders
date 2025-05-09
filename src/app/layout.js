// app/layout.js (Root Layout - handles ONLY html/body)
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "exnettraders - Profits Built on Logic",
  description: "Join exnettraders for secure, professional investment solutions in cryptocurrency, forex, and stock markets since 2017. Grow your wealth with our expert trading strategies.",
  keywords: "crypto investment, forex trading, stock market, secure investments, trading platform",
  alternates: {
    canonical: "https://www.exnettraders.com",
    languages: {
      'en': 'https://www.exnettraders.com/en',
      'fr': 'https://www.exnettraders.com/fr',
      'es': 'https://www.exnettraders.com/es',
    },
  },
  openGraph: {
    title: "exnettraders - Professional Trading Solutions",
    description: "Trusted investment platform offering crypto, forex, and stock trading services since 2017",
    url: "https://www.exnettraders.com",
    siteName: "exnettraders",
    images: [
      {
        url: "https://www.exnettraders.com/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "exnettraders - Professional Trading Solutions",
    description: "Trusted investment platform offering crypto, forex, and stock trading services since 2017",
    images: ["https://www.exnettraders.com/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
