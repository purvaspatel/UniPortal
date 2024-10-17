import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faq = () => {
  // Static FAQ data - can be replaced with API data later
  const faqData = [
    {
      id: 1,
      question: "How do I schedule a meeting with a teacher?",
      answer: "You can schedule a meeting by visiting the teacher's profile page and selecting an available time slot from their schedule. Once you select a time slot, you'll receive a confirmation email with the meeting details."
    },
    {
      id: 2,
      question: "Where can I collect my transcript from?",
      answer: "Exam cell office is located in C-Block 2nd Floor. Students need to submit a request on PDEU POS Portal and then collect it between 2-4 pm accordingly."
    },
    {
      id: 3,
      question: "What should I do if I can't find an available time slot?",
      answer: "If you can't find a suitable time slot, you can either check back later as teachers regularly update their availability, or contact the teacher directly through their email to request an alternative time."
    },
    {
      id: 4,
      question: "How long are the typical meeting sessions?",
      answer: "Standard meeting sessions are typically 30 minutes long. However, some teachers may offer extended sessions of 45 or 60 minutes depending on their availability and the purpose of the meeting."
    },
    {
      id: 5,
      question: "Is there a limit to how many appointments I can schedule?",
      answer: "While there's no strict limit, we recommend scheduling only what you need to ensure fair access for all students. Some teachers may set their own limits on appointments per student."
    }
  ];

  const [expandedId, setExpandedId] = useState(null);

  const toggleQuestion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="text-center  pl-12 pr-12 ">
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions!!!
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left p-4 bg-white hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
              onClick={() => toggleQuestion(faq.id)}
            >
              <span className="text-lg font-medium text-gray-800">
                {faq.question}
              </span>
              {expandedId === faq.id ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {expandedId === faq.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Still have questions?
        </h2>
        <p className="text-blue-600 mb-4">
          We're here to help. Contact our support team for assistance.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Contact Support
        </button>
      </div>
    </div>
    </div>
  );
};

export default Faq;