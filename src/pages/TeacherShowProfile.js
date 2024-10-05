import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"];

function TeacherShowProfile() {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <Link to="/teacher-list" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Search</Link>
      <h1 className="text-3xl font-bold mb-4">{teacher.name}</h1>
      {teacher.photo && (
        <img src={`http://localhost:5000${teacher.photo}`} alt={teacher.name} className="mt-4 max-w-xs mx-auto rounded-lg shadow" />
      )}
      <br></br>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>School:</strong> {teacher.school}</p>
          <p><strong>Department:</strong> {teacher.department}</p>
          <p><strong>Cabin Number:</strong> {teacher.cabinNumber}</p>
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