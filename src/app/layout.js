
import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head'
import { UserProvider } from "./contexts/UserContext";
import SmartSupp from "./components/smartsup";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "exnettrade - Profits Built on Logic",
  description: "Join exnettrade for secure, professional investment solutions in cryptocurrency, forex, and stock markets since 2017. Grow your wealth with our expert trading strategies.",
  keywords: "crypto investment, forex trading, stock market, secure investments, trading platform",
  alternates: {
    canonical: "https://www.exnettrade.com",
    languages: {
      'en': 'https://www.exnettrade.com/en',
      'fr': 'https://www.exnettrade.com/fr',
      'es': 'https://www.exnettrade.com/es',
    },
  },
  openGraph: {
    title: "exnettrade - Professional Trading Solutions",
    description: "Trusted investment platform offering crypto, forex, and stock trading services since 2017",
    url: "https://www.exnettrade.com",
    siteName: "exnettrade",
    images: [
      {
        url: "https://www.exnettrade.com/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "exnettrade - Professional Trading Solutions",
    description: "Trusted investment platform offering crypto, forex, and stock trading services since 2017",
    images: ["https://www.exnettrade.com/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}
      >
        <UserProvider>
          {children}

        </UserProvider>
      </body>
    </html>
  );
}
