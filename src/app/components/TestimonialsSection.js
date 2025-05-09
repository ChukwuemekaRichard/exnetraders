'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function TestimonialsSection({ dictionary }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: "David Chen",
      position: "Entrepreneur",
      quote: "exnettraders has completely transformed my approach to crypto investing. The expert analysis and timely recommendations have led to a 32% increase in my portfolio in just 6 months.",
      stars: 5
    },
    {
      name: "Sarah Johnson",
      position: "Finance Professional",
      quote: "As someone in the finance industry, I'm impressed by the professionalism and detailed market analysis provided by exnettraders. Their forex strategies have been consistently profitable.",
      stars: 5
    },
    {
      name: "Michael Rodriguez",
      position: "Retired Teacher",
      quote: "I was nervous about investing my retirement savings, but the team at exnettraders made the process easy to understand. Their diversified approach has given me peace of mind.",
      stars: 4
    }
  ];
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="bg-gray-50 py-20">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {dictionary.testimonial.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {dictionary.testimonial.subtitle}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8 md:p-12"
            >
              <FaQuoteLeft className="text-blue-200 text-4xl mb-6" />
              <p className="text-xl md:text-2xl text-gray-700 mb-8 italic">
                "{testimonials[activeIndex].quote}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[activeIndex].position}</p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < testimonials[activeIndex].stars ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-between mt-8">
              <button 
                onClick={prevTestimonial}
                className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-colors"
                aria-label="Previous testimonial"
              >
                <FaChevronLeft />
              </button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-blue-700' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextTestimonial}
                className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-colors"
                aria-label="Next testimonial"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}