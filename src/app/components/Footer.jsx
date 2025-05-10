"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image"
import logo from "@/public/logomain.png";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer({ dictionary }) {
  const { locale } = useParams();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call with a 3-second delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset the success message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 3000);
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-16">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="company-logo">
              <Image src={logo}
               alt="logo"
              //  width={90}
               height={80}
              />
            </div>
            <p className="text-gray-400 mb-4">
              Professional investment solutions for a secure financial future.
              Trusted by thousands of investors worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">
              {dictionary.footer.company}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.footer.about}
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/terms-of-service`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.footer.terms}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {dictionary.footer.privacy}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">
              {dictionary.footer.contact}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-500 mr-3 mt-1" />
                <span className="text-gray-400">
                  13th Adamscott Road, Harlingen, UK
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-blue-500 mr-3" />
                <span className="text-gray-400">+44 74 4626 4643</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3" />
                <span className="text-gray-400">
                  exnettrade@gmail.com
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest investment insights and
              market updates.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading || isSubscribed}
              />
              <button 
                type="button" 
                className={`w-full btn-primary relative ${isLoading ? 'opacity-70' : ''} ${isSubscribed ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={handleSubscribe}
                disabled={isLoading || isSubscribed || !email}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Loading...
                  </>
                ) : isSubscribed ? (
                  "Subscribed Successfully!"
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              {dictionary.footer.copyright.replace("2025", currentYear)}
            </p>
            <div className="flex space-x-6">
              <Link
                href={`/${locale}/terms-of-service`}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {dictionary.footer.terms}
              </Link>
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {dictionary.footer.privacy}
              </Link>
              <Link
                href={`/${locale}/disclaimer`}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {dictionary.footer.disclaimer}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}