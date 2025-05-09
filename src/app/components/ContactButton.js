"use client";
// components/ContactButton.jsx
import { useState, useEffect } from "react";
import { FaComments, FaTimes, FaEnvelope, FaPhone, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ContactButton = ({ dictionary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Translation fallbacks if dictionary is not available
  const translations = {
    contactUs: dictionary?.contact?.contactUs || "Contact Us",
    email: dictionary?.contact?.email || "Email",
    phone: dictionary?.contact?.phone || "Phone",
    telegram: dictionary?.contact?.telegram || "Telegram",
    whatsapp: dictionary?.contact?.whatsapp || "WhatsApp",
    getInTouch: dictionary?.contact?.getInTouch || "Get in touch with us",
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Main button */}
      <button
        onClick={toggleOpen}
        className="relative bg-blue-900 text-white rounded-full p-3 shadow-lg hover:bg-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label={translations.contactUs}
      >
        {isOpen ? (
          <FaTimes className="h-6 w-6" />
        ) : (
          <FaComments className="h-6 w-6" />
        )}
        
        {/* Pulsing effect when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-600 opacity-30 animate-ping"></span>
        )}
      </button>

      {/* Contact options panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-4 w-64"
          >
            <div className="border-b border-gray-200 pb-2 mb-3">
              <h3 className="text-lg font-semibold text-blue-900">{translations.contactUs}</h3>
              <p className="text-sm text-gray-600">{translations.getInTouch}</p>
            </div>
            
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:exnettraders@gmail.com" 
                  className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaEnvelope className="h-5 w-5 text-blue-900" />
                  </div>
                  <span className="ml-3 text-gray-700">{translations.email}</span>
                </a>
              </li>
              
              <li>
                <a 
                  href="tel:+447446264643" 
                  className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaPhone className="h-5 w-5 text-blue-900" />
                  </div>
                  <span className="ml-3 text-gray-700">{translations.phone}</span>
                </a>
              </li>
              
              <li>
                <a 
                  href="https://t.me/exnettraderss" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaTelegram className="h-5 w-5 text-blue-900" />
                  </div>
                  <span className="ml-3 text-gray-700">{translations.telegram}</span>
                </a>
              </li>
              
              <li>
                <a 
                  href="https://wa.me/message/36BTBS6LOB3SB1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FaWhatsapp className="h-5 w-5 text-blue-900" />
                  </div>
                  <span className="ml-3 text-gray-700">{translations.whatsapp}</span>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactButton;