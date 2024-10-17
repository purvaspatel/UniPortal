import React from 'react';
import { Github, Twitter, Globe, Plus } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Team Member 1",
      role: "Full Stack Developer",
      image: "/api/placeholder/300/300", // Replace with your image
      github: "https://github.com/username1",
      twitter: "https://twitter.com/username1",
      website: "https://yourwebsite1.com"
    },
    {
      name: "Team Member 2",
      role: "UI/UX Developer",
      image: "/api/placeholder/300/300", // Replace with your image
      github: "https://github.com/username2",
      twitter: "https://twitter.com/username2",
      website: "https://yourwebsite2.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About Our Vision
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We built this platform to bridge the gap between students and teachers,
          making mentorship more accessible and organized for future generations.
        </p>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Team Members */}
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex flex-col items-center transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-64 h-64 rounded-2xl object-cover shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <div className="flex space-x-4">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                      <Github className="w-8 h-8" />
                    </a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                      <Twitter className="w-8 h-8" />
                    </a>
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200">
                      <Globe className="w-8 h-8" />
                    </a>
                  </div>
                </div>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600 mt-2">{member.role}</p>
            </div>
          ))}

          {/* Join Us Card */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-dashed border-blue-300 flex items-center justify-center group hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 cursor-pointer">
              <div className="text-center p-6">
                <Plus className="w-16 h-16 mx-auto text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Join Our Team</h3>
                <p className="text-gray-600">Carry forward the legacy and make it even better!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-24 text-center max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We started this project with a simple goal: to make teacher-student interactions more efficient and meaningful. 
              As seniors, we understand the challenges of managing consultations and want to leave behind a system that makes 
              this process seamless for future batches.
            </p>
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Want to Contribute?</h3>
              <p className="text-gray-600 mb-6">
                The project is open source and welcomes contributions from passionate developers who want to make a difference.
              </p>
              <a
                href="https://github.com/yourusername/yourrepo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Timeline or Journey */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">2024</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Launch</h3>
                <p className="text-gray-600">Initial release of the consultation management system</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-semibold">Future</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Growing Together</h3>
                <p className="text-gray-600">Join us in expanding and improving the platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;