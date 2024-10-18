import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeacherSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(12); // 12 teachers per page
  const navigate = useNavigate();

  // Fetch all teachers on initial render
  useEffect(() => {
    const fetchAllTeachers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/teachers/search?interests="
        );
        const data = await response.json();

        if (response.ok) {
          setAllTeachers(data);
          setSearchResults(data);
        } else {
          throw new Error(data.message || "Failed to fetch teachers");
        }
      } catch (error) {
        console.error("Error fetching all teachers:", error);
        setError(
          error.message || "An error occurred while fetching all teachers."
        );
      }
    };

    fetchAllTeachers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setError(null);

    const filteredTeachers = allTeachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.researchInterests.some(
          (interest) =>
            interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.school.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    setSearchResults(filteredTeachers);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handleTeacherClick = (teacherId) => {
    navigate(`/teacher/${teacherId}`);
  };

  const handleImageError = (e) => {
    // Only set the fallback if we haven't already tried
    if (!e.target.getAttribute("data-failed")) {
      e.target.setAttribute("data-failed", "true");
      e.target.src =
        "https://res.cloudinary.com/ds0hgmipo/image/upload/v1728231827/teacher-photos/default.jpg"; // Make sure this exists in your public folder
    } else {
      // If even the fallback fails, remove the image
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

  // Pagination Logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = searchResults.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );

  const totalPages = Math.ceil(searchResults.length / teachersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-10">
      <div className="max-w-md mx-auto">
        <h4 className="text-2xl font-bold text-center mb-6">
          Search Professors
          </h4>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="name/research interest/school/department"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-8">
        {currentTeachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 pl-20 pr-20">
            {currentTeachers.map((teacher) => (
              <div
                key={teacher._id}
                className="border p-4 rounded flex items-center cursor-pointer hover:bg-gray-50 border border-gray-200 hover:border-gray-400 transition-colors w-100"
                onClick={() => handleTeacherClick(teacher._id)}
              >
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold">{teacher.name}</h3>
                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {teacher.email}
                  </p>
                  <p>
                    <strong>
                      School:
                    </strong>{" "}
                    {teacher.school}
                  </p>
                  <p>
                    <strong>
                      Department
                    </strong>{" "}
                    {teacher.department}
                  </p>
                  <p>
                    <strong>
                      Research Interests:
                    </strong>{" "}
                    {teacher.researchInterests.join(", ")}
                  </p>
                </div>
                <TeacherImage teacher={teacher} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 mb-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 mx-1 rounded border ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border-blue-500 hover:bg-blue-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherSearch;
