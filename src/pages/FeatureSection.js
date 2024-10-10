import React from 'react';

const features = [
  { 
    title: 'Teacher Cabins', 
    description: 'Easily access and book teacher cabins for meetings and study sessions.',
    link: '/teacher-list' // Add your link here
  },
  { 
    title: 'University Clubs', 
    description: 'Join various university clubs and expand your network.',
    link: '/university-clubs' // Add your link here
  },
  { 
    title: 'FAQs', 
    description: 'Find answers to the most common questions from students.',
    link: '/faqs' // Add your link here
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="min-h-screen bg-white py-12  px-12 ">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center  mt-20 mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <a 
              key={index}
              href={feature.link} 
              className="block p-6 bg-white rounded-lg border border-gray-400  hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
