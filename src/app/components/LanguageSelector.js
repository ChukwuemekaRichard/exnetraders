'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import { languages } from '../i18n';

export default function LanguageSelector({ currentLocale }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Change language handler
  const changeLanguage = (locale) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-1 text-white px-3 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaGlobe className="mr-1" />
        <span>{currentLanguage.flag} {currentLanguage.name}</span>
        <FaChevronDown className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            {languages.map(language => (
              <button
                key={language.code}
                className={`w-full text-left px-4 py-2 text-sm ${
                  currentLocale === language.code 
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => changeLanguage(language.code)}
              >
                <span className="mr-2">{language.flag}</span>
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}