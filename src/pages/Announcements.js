// Announcements.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all teachers to get announcements
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('/api/teachers');
        // Filter to collect all announcements from each teacher
        const allAnnouncements = response.data
          .filter(teacher => teacher.announcements && teacher.announcements.length > 0)
          .map(teacher => 
            teacher.announcements.map(announcement => ({
              ...announcement,
              teacherId: teacher._id, // Include teacher ID for routing
              teacherName: teacher.name // Include teacher's name for display
            }))
          )
          .flat(); // Flatten the array to have all announcements in one list
        setAnnouncements(allAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleClick = (teacherId) => {
    // Route to the specific teacher profile page
    navigate(`/teacher/${teacherId}`);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        Announcements
      </h2>
      {announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
              onClick={() => handleClick(announcement.teacherId)}
            >
              <p className="text-lg text-gray-700">{announcement.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                Posted by: {announcement.teacherName} on {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No announcements available at the moment.</p>
      )}
    </div>
  );
};

export default Announcements;
