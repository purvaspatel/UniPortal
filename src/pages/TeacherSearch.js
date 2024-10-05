import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeacherSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [allTeachers, setAllTeachers] = useState([]);
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
  };

  const handleTeacherClick = (teacherId) => {
    navigate(`/teacher/${teacherId}`);
  };

  return (
    <div className="mt-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Search Teachers</h1>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="">
            <label className="block text-gray-700">
              Search by Name/Research Interest/Department
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter name or research interest"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-8">
        <div className="max-w-sl pl-20 pr-20 mx-auto">
        <h2 className="text-2xl font-bold mb-4">Teacher List</h2></div>
        {searchResults.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 pl-20 pr-20">
            {searchResults.map((teacher) => (
              <div
                key={teacher._id}
                className="border p-4 rounded flex items-center cursor-pointer hover:bg-gray-100 transition-colors w-100"
                onClick={() => handleTeacherClick(teacher._id)}
              >
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold">{teacher.name}</h3>
                  <p>
                    <strong>
                      <u>Email:</u>
                    </strong>{" "}
                    {teacher.email}
                  </p>
                  <p>
                    <strong>
                      <u>School:</u>
                    </strong>{" "}
                    {teacher.school}
                  </p>
                  <p>
                    <strong>
                      <u>Department:</u>
                    </strong>{" "}
                    {teacher.department}
                  </p>
                  <p>
                    <strong>
                      <u>Research Interests:</u>
                    </strong>{" "}
                    {teacher.researchInterests.join(", ")}
                  </p>
                </div>
                {teacher.photo && (
                  <img
                    src={`http://localhost:5000${teacher.photo}`}
                    alt={teacher.name}
                    className="ml-4 w-24 h-32 rounded-lg shadow object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherSearch;
