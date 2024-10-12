import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { useNavigate, useLocation } from 'react-router-dom';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"];

function TeacherShowProfile() {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  // const navigate = useNavigate();
  // const location = useLocation();

  // Get the navigation state
  // const from = location.state?.from || '/teacher-list';
  // const searchTerm = location.state?.searchTerm || '';
  // const scrollPosition = location.state?.scrollPosition || 0;

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${id}`);
        const data = await response.json();
        if (response.ok) {
          setTeacher(data);
        } else {
          throw new Error(data.message || 'Failed to fetch teacher profile');
        }
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
        setError(error.message || 'An error occurred while fetching the teacher profile.');
      }
    };

    fetchTeacherProfile();
  }, [id]);

  // const handleBack = (e) => {
  //   e.preventDefault();
  //   navigate(from, { 
  //     state: { 
  //       scrollPosition,
  //       searchTerm 
  //     }
  //   });
  // };

  // Handle image loading errors
  const handleImageError = (e) => {
    // Only set the fallback if we haven't already tried
    if (!e.target.getAttribute('data-failed')) {
      e.target.setAttribute('data-failed', 'true');
      e.target.src = 'https://res.cloudinary.com/ds0hgmipo/image/upload/v1728231827/teacher-photos/default.jpg';
    } else {
      // If even the fallback fails, remove the image
      e.target.style.display = 'none';
    }
  };

  const TeacherImage = ({ teacher }) => {
    if (!teacher.photo) {
      return (
        <div className="ml-4 w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Photo</span>
        </div>
      );
    }

    return (
      <img
        src={teacher.photo}
        alt={teacher.name}
        className="ml-4 w-24 h-32 rounded-lg shadow object-cover"
        onError={handleImageError}
      />
    );
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      
      <h1 className="text-3xl font-bold mb-4">{teacher.name}</h1>
      <TeacherImage teacher={teacher} />
      <br></br>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>School:</strong> {teacher.school}</p>
          <p><strong>Department:</strong> {teacher.department}</p>
          <p><strong>Cabin Number:</strong> {teacher.cabinNumber}</p>
          <p><strong>Title:</strong> {teacher.title}</p>
          {teacher.linkedin && (
            <p><strong>LinkedIn:</strong> <a href={`https://linkedin.com/in/${teacher.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">{teacher.linkedin}</a></p>
          )}
          {teacher.profileLink && (
            <p><strong>Profile Link:</strong> <a href={teacher.profileLink} target="_blank" rel="noopener noreferrer">{teacher.profileLink}</a></p>
          )}
        </div>
        <div>
          <p><strong>Research Interests:</strong></p>
          <ul className="list-disc list-inside">
            {teacher.researchInterests.map((interest, index) => (
              <li key={index}>{interest}</li>
            ))}
          </ul>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Available Slots</h2>
      <div className="">
          <div className="grid grid-cols-10 gap-1 text-center">
            <div></div> {/* Empty cell in the top-left corner */}
            {timeSlots.map((time) => (
              <div key={time} className="font-semibold">{time}</div>
            ))}
            {daysOfWeek.map((day) => (
              <React.Fragment key={day}>
                <div className="font-semibold">{day}</div>
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={`w-10 h-10 border flex justify-center items-center ${teacher.availableSlots[day]?.includes(time) ? 'bg-green-500' : ''}`}
                  ></div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
    </div>
  );
}

export default TeacherShowProfile;