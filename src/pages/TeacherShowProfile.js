import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TimeTable from "./TimeTable";
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = [
  "9-10",
  "10-11",
  "11-12",
  "12-1",
  "1-2",
  "2-3",
  "3-4",
  "4-5",
  "5-6",
];

function TeacherShowProfile() {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/teachers/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setTeacher(data);
        } else {
          throw new Error(data.message || "Failed to fetch teacher profile");
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
        setError(
          error.message ||
            "An error occurred while fetching the teacher profile."
        );
      }
    };

    fetchTeacherProfile();
  }, [id]);

  const handleImageError = (e) => {
    if (!e.target.getAttribute("data-failed")) {
      e.target.setAttribute("data-failed", "true");
      e.target.src =
        "https://res.cloudinary.com/ds0hgmipo/image/upload/v1728231827/teacher-photos/default.jpg";
    } else {
      e.target.style.display = "none";
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
    <div className="max-w-4xl mx-auto mt-12 p-8 mb-12 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{teacher.name}</h1>

      <div className="flex items-start space-x-16">
        {/* Teacher Image */}
        <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
  {teacher.photo ? (
    <img
      src={teacher.photo}
      alt={teacher.name}
      className="w-full h-full object-cover rounded-lg shadow"
    />
  ) : (
    <span className="text-gray-500 text-sm">No Photo</span>
  )}
</div>


        {/* Teacher Information */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Left Column */}
          <div className="space-y-2">
            <p className="text-lg">
              <strong>Email:</strong> {teacher.email}
            </p>
            <p className="text-lg">
              <strong>School:</strong> {teacher.school}
            </p>
            <p className="text-lg">
              <strong>Department:</strong> {teacher.department}
            </p>
            <p className="text-lg">
              <strong>Title:</strong> {teacher.title}
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {teacher.linkedin && (
              <p className="text-lg">
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={`https://linkedin.com/in/${teacher.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {teacher.linkedin}
                </a>
              </p>
            )}
            {teacher.profileLink && (
              <p className="text-lg">
                <strong>Profile Link:</strong>{" "}
                <a
                  href={teacher.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {teacher.profileLink}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Research Interests */}
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        Research Interests
      </h2>
      <div className="bg-purple-300 p-4 rounded-lg">
        <div className="flex flex-wrap gap-2">
          {teacher.researchInterests.map((interest, index) => (
            <span
              key={index}
              className="bg-white text-gray-700 text-lg px-3 py-1 rounded-md shadow"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Available Slots */}
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        Available Meeting Slots
      </h2>

      <TimeTable availableSlots={teacher.availableSlots} />

      {/* Announcements */}
      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">
        Announcements
      </h2>
      {teacher.announcements && teacher.announcements.length > 0 ? (
        <div className="space-y-3">
          {teacher.announcements.map((announcement, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow">
              <p className="text-lg text-gray-700">{announcement.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                Posted on:{" "}
                {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-500">No announcements at this time.</p>
      )}
    </div>
  );
}

export default TeacherShowProfile;
