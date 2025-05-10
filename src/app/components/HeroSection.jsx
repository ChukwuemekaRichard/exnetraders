"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";

export default function HeroSection({ dictionary }) {
  const { locale } = useParams();

  return (
    <section className=" h-screen hero-gradient text-white">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-text">
            <h1>Investment Gotten From Beyond</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque!</p>
            <div className="hero-cta">
              <a href="/auth">
                Get Started 
              </a>
              <a href="/auth">
                Learrn More
              </a>
            </div>
          </div>

        </div>
        <div className="hero-right">

        </div>
        
      </div>
    </section>
  );
}
