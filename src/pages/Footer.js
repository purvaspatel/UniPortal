import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-red py-8">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul>
              <li><a href="/" className="hover:text-gray-400">Home</a></li>
              <li><a href="/" className="hover:text-gray-400">Features</a></li>
              <li><a href="/" className="hover:text-gray-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <p>Email: support@university.com</p>
            <p>Phone: +123 456 789</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="/" className="hover:text-gray-400">Facebook</a>
              <a href="/" className="hover:text-gray-400">Twitter</a>
              <a href="/" className="hover:text-gray-400">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
