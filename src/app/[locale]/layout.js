import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDictionary } from "../i18n";
import Carousel from "../components/Carousel";
import ContactButton from "../components/ContactButton"; // Import the new component
import TawkToChat from "../components/smartsup";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "exnettrade - Profits Built on Logic",
    template: "%s | exnettrade",
  },
  description:
    "Professional investment solutions for crypto, forex, and stock trading with 9+ years of market experience",
  alternates: {
    canonical: "https://www.exnettrade.com",
    languages: {
      en: "https://www.exnettrade.com/en",
      fr: "https://www.exnettrade.com/fr",
      es: "https://www.exnettrade.com/es",
    },
  },
};
export default async function RootLayout({ children, params }) {
  // Await params first, then extract locale
  const awaitedParams = await params;
  const locale = awaitedParams?.locale || "en"; // Fallback to 'en'
  const dictionary = await getDictionary(locale);

  return (
    <>
      <Navbar dictionary={dictionary} locale={locale} />
      <main className="flex-grow">{children}</main>
      <Footer dictionary={dictionary} />
      <Carousel />
      <TawkToChat/>
    </>
  );
}
