import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import researchOptions from "../variables/researchOptions";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function TeacherRegistration() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [cabinNumber, setCabinNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [researchInterests, setResearchInterests] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
  });
  const [progressWidth, setProgressWidth] = useState("33.33%");
  const [flashMessage, setFlashMessage] = useState("");

  useEffect(() => {
    // Scroll to the top of the page on component load
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgressWidth(`${(step / 3) * 100}%`);
  }, [step]);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSlotChange = (day, time) => {
    const updatedSlots = { ...availableSlots };
    if (updatedSlots[day].includes(time)) {
      updatedSlots[day] = updatedSlots[day].filter((slot) => slot !== time);
    } else {
      updatedSlots[day].push(time);
    }
    setAvailableSlots(updatedSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFlashMessage("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("school", school);
    formData.append("department", department);
    formData.append("title", title);
    formData.append("cabinNumber", cabinNumber);
    formData.append("availableSlots", JSON.stringify(availableSlots));
    formData.append("password", password);
    formData.append(
      "researchInterests",
      JSON.stringify(researchInterests.map((item) => item.value))
    );
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Teacher registered:", data);
        await axios.post("/api/teacher-logout");
        logout();
        setFlashMessage(
          "Registration successful! Redirecting to login page..."
        );
        setTimeout(() => {
          navigate("/teacher-login");
        }, 3000);
      } else {
        console.error("Error:", data);
        setFlashMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setFlashMessage("An error occurred. Please try again later.");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="e.g., Professor, Assistant Professor"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">School</label>
                <select
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select School</option>
                  <option value="SOT">SOT</option>
                  <option value="SOET">SOET</option>
                  <option value="SLS">SLS</option>
                  <option value="SOM">SOM</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="ICT">ICT</option>
                  <option value="E.C">E.C</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Upload Photo</label>
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">
                  Research Interests
                </label>
                <Select
                  isMulti
                  options={researchOptions}
                  value={researchInterests}
                  onChange={setResearchInterests}
                  className="w-full"
                  placeholder="Select research interests"
                />
              </div>
            </div>
          </>
        );
      case 2:
        const times = [
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
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Availability & Cabin</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Cabin Number</label>
                <input
                  type="text"
                  value={cabinNumber}
                  onChange={(e) => setCabinNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Available Slots
                </label>
                <div className="max-w-4xl mx-auto">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      {/* Header row with time slots */}
                      <thead>
                        <tr>
                          <th className="w-20 border border-gray-200 bg-gray-50 p-3"></th>
                          {times.map((time) => (
                            <th
                              key={time}
                              className="w-24 border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700"
                            >
                              {time}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* Table body with days and slots */}
                      <tbody>
                        {days.map((day) => (
                          <tr key={day}>
                            <td className="border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700 text-center">
                              {day}
                            </td>
                            {times.map((time) => (
                              <td
                                key={`${day}-${time}`}
                                className={`border border-gray-200 p-3 text-center h-12 cursor-pointer
                  ${
                    availableSlots[day]?.includes(time)
                      ? "bg-green-50"
                      : "bg-white"
                  }`}
                                onClick={() => handleSlotChange(day, time)}
                              >
                                {availableSlots[day]?.includes(time) && (
                                  <div className="w-3 h-3 rounded-full bg-green-500 mx-auto"></div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Set Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <div className="progress-bar w-full h-1 bg-gray-300">
          <div
            className="bg-blue-500 h-full"
            style={{ width: progressWidth }}
          ></div>
        </div>
        {flashMessage && <p className="text-red-500 my-4">{flashMessage}</p>}
        <div className="my-8">{renderStepContent()}</div>
        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2 px-4 bg-gray-500 text-white rounded"
            >
              Previous
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TeacherRegistration;
