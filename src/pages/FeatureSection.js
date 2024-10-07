import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { title: 'Teacher Cabins', description: 'Easily access and book teacher cabins for meetings and study sessions.' },
  { title: 'University Clubs', description: 'Join various university clubs and expand your network.' },
  { title: 'FAQs', description: 'Find answers to the most common questions from students.' },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-8">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="p-6 bg-gray-100 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
