'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CtaSection({ dictionary }) {
  const { locale } = useParams();
  
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container-custom mx-auto">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {dictionary.cta.title}
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            {dictionary.cta.subtitle}
          </p>
          <div className="inline-block">
            <Link href={`/auth`} className="btn-primary text-lg px-8 py-3">
              {dictionary.cta.button}
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">45%</div>
              <div className="text-blue-200">Avg. Annual Return</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">9+</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-blue-200">Expert Support</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-blue-200">Secure Platform</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}