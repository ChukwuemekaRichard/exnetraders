"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LanguageSelector from "./LanguageSelector";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "@/public/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Navbar({ dictionary, locale }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Extract the path without the locale prefix for navigation links
  const path = pathname.replace(`/${locale}`, "") || "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "backdrop-blur-md bg-gray-900/90 border-b border-gray-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo with shine effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link href={`/${locale}`} className="flex items-center group">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <Image
                  src={logo}
                  alt="Logo"
                  width={48}
                  height={48}
                  className="transition-all duration-300 group-hover:opacity-90"
                />
              </div>
              <span className="ml-3 text-xl font-semibold bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
                VTI
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { href: `/${locale}`, label: dictionary.nav.home },
              { href: `/${locale}/services`, label: dictionary.nav.services },
              { href: `/${locale}/about`, label: dictionary.nav.about },
              {
                href: `/${locale}/testimonials`,
                label: dictionary.nav.testimonials,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  path === item.href.split("/").pop() ||
                  (path === "" && item.href === `/${locale}`)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
                {path === item.href.split("/").pop() && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute bottom-1 left-0 w-full h-0.5 bg-blue-400"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}

            <div className="mx-2 h-6 w-px bg-gray-700/50" />

            <Link
              href="https://t.me/exnettraderss"
              className="relative px-4 py-2.5 group overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium text-white"
            >
              <span className="relative z-10 flex items-center">
                {dictionary.nav.contact}
                <ArrowRightIcon className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <LanguageSelector currentLocale={locale} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-blue-400" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/30 px-4 pb-4 pt-2 space-y-1">
                {[
                  { href: `/${locale}`, label: dictionary.nav.home },
                  {
                    href: `/${locale}/services`,
                    label: dictionary.nav.services,
                  },
                  { href: `/${locale}/about`, label: dictionary.nav.about },
                  {
                    href: `/${locale}/testimonials`,
                    label: dictionary.nav.testimonials,
                  },
                  {
                    href: `https://t.me/exnettraderss`,
                    label: dictionary.nav.contact,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        path === item.href.split("/").pop()
                          ? "text-white bg-gray-800/50"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2 px-4"
                >
                  <LanguageSelector currentLocale={locale} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
