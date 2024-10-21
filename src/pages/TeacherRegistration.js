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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    department: "",
    title: "",
    photo: null,
    photoUrl: "",
    cabinNumber: "",
    password: "",
    confirmPassword: "",
    researchInterests: [],
    availableSlots: {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
    },
  });
  const [progressWidth, setProgressWidth] = useState("33.33%");
  const [flashMessage, setFlashMessage] = useState("");

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgressWidth(`${(step / 3) * 100}%`);
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSlotChange = (day, time) => {
    setFormData((prev) => {
      const updatedSlots = { ...prev.availableSlots };
      if (updatedSlots[day].includes(time)) {
        updatedSlots[day] = updatedSlots[day].filter((slot) => slot !== time);
      } else {
        updatedSlots[day] = [...(updatedSlots[day] || []), time];
      }
      return { ...prev, availableSlots: updatedSlots };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFlashMessage("Passwords do not match!");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setFlashMessage('Please enter a valid email address.');
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "researchInterests") {
        submitData.append(
          key,
          JSON.stringify(formData[key].map((item) => item.value))
        );
      } else if (key === "availableSlots") {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (key !== "photoUrl" && key !== "confirmPassword") {
        submitData.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();
      if (response.ok) {
        await axios.post("/api/teacher-logout");
        logout();
        setFlashMessage("Registration successful! Redirecting to login page...");
        setTimeout(() => navigate("/teacher-login"), 3000);
      } else {
        setFlashMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      setFlashMessage("An error occurred. Please try again later.");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School
                </label>
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="ICT">ICT</option>
                  <option value="ECE">ECE</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Professor, Assistant Professor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  {formData.photoUrl && (
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Research Interests
              </label>
              <Select
                isMulti
                options={researchOptions}
                value={formData.researchInterests}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    researchInterests: selected,
                  }))
                }
                className="w-full"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Availability & Cabin</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cabin Number
                </label>
                <input
                  type="text"
                  name="cabinNumber"
                  value={formData.cabinNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Available Slots
                </label>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-10 gap-1 text-center min-w-[800px]">
                    <div className="bg-gray-50 p-3 rounded-tl-lg"></div>
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="bg-gray-50 p-3 text-sm font-medium text-gray-700"
                      >
                        {time}
                      </div>
                    ))}

                    {daysOfWeek.map((day) => (
                      <React.Fragment key={day}>
                        <div className="bg-gray-50 p-3 text-sm font-medium text-gray-700">
                          {day}
                        </div>
                        {timeSlots.map((time) => (
                          <div
                            key={`${day}-${time}`}
                            className={`p-3 flex justify-center items-center border border-gray-100 cursor-pointer
                              ${
                                formData.availableSlots[day]?.includes(time)
                                  ? "bg-green-50"
                                  : "bg-white"
                              }`}
                            onClick={() => handleSlotChange(day, time)}
                          >
                            {formData.availableSlots[day]?.includes(time) && (
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Set Password</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Registration</h1>
          <div className="mt-4 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>

        {flashMessage && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            {flashMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Next
              </button>
            ) : (
              <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Complete Registration
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Registration Instructions
        </h3>
        <div className="space-y-4 text-gray-700">
          <p>
            Please complete all three steps of the registration process:
          </p>
          <div className="ml-4 space-y-2">
            <p>
              1. <span className="font-medium">Basic Information:</span> Fill in your personal and professional details, including your profile photo and research interests.
            </p>
            <p>
              2. <span className="font-medium">Availability & Cabin:</span> Set your weekly availability schedule and provide your cabin number for student consultations.
            </p>
            <p>
              3. <span className="font-medium">Password Setup:</span> Create a secure password for your account.
            </p>
          </div>
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>All fields marked as required must be completed</li>
              <li>Your email address will be used for account verification</li>
              <li>Please choose a strong password that includes numbers and special characters</li>
              <li>You can update your availability schedule later from your profile</li>
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-medium text-gray-900">Need Help?</h4>
            <p className="mt-2">
              For assistance with registration, please contact:
              <br />
              Email: kalashjain124@gmail.com
              <br />
              Phone: +918780560746
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default TeacherRegistration;