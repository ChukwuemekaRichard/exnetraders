"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import HeroImage2 from "@/public/firsthero.png";
import { Check, ChevronRightIcon, DollarSign, TrendingUp } from "lucide-react";

export default function HeroSection({ dictionary }) {
  const { locale } = useParams();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAlertAnimating, setIsAlertAnimating] = useState(false);
  
  // Array of rotating header texts
  const headerTexts = [
    "We create sustainable value for our clients.",
    "Expert-guided crypto investment strategies.",
    "Secure, reliable trading solutions.",
    "Building wealth through innovation."
  ];

  useEffect(() => {
    // Text rotation interval (4 seconds)
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % headerTexts.length);
      
      // Trigger alert animation
      setIsAlertAnimating(true);
      
      // Reset alert animation after completion
      setTimeout(() => {
        setIsAlertAnimating(false);
      }, 2000); // Animation duration
    }, 4000);

    return () => clearInterval(textInterval);
  }, []);

  // Animation variants for text
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  };

  // Animation variants for alerts
  const alertVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1], 
      transition: { 
        duration: 2,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="h-screen hero-gradient text-white">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-text">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTextIndex}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={textVariants}
              >
                {headerTexts[currentTextIndex]}
              </motion.h1>
            </AnimatePresence>
            <p>exnettrade secure crypto investing.</p>
            <div className="hero-cta">
              <motion.a 
                href="/auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.a>
              <motion.a 
                href="/auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image src={HeroImage2} alt="firsthero" />
          </motion.div>
          
          <motion.div 
            className="alert-buttons-div"
            variants={alertVariants}
            initial="initial"
            animate={isAlertAnimating ? "animate" : "initial"}
          >
            <Check className="icondllar" />
            <span>
              <p>You just received 500$</p>
            </span>
          </motion.div>
          
          <motion.div 
            className="alert-buttons-div second"
            variants={alertVariants}
            initial="initial"
            animate={isAlertAnimating ? "animate" : "initial"}
          >
            <TrendingUp className="icondllar" />
            <span>
              <p>Up 40% in Profit</p>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}