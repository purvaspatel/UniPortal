import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import researchOptions from '../variables/researchOptions';

function TeacherRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [cabinNumber, setCabinNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [researchInterests, setResearchInterests] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
  });
  const [progressWidth, setProgressWidth] = useState('33.33%');
  const [flashMessage, setFlashMessage] = useState('');

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
      setFlashMessage('Passwords do not match!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('school', school);
    formData.append('department', department);
    formData.append('cabinNumber', cabinNumber);
    formData.append('availableSlots', JSON.stringify(availableSlots));
    formData.append('password', password);
    formData.append('researchInterests', JSON.stringify(researchInterests.map(item => item.value)));
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await fetch('http://localhost:5000/api/teachers', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Teacher registered:', data);
        setFlashMessage('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/teacher-login');
        }, 3000);
      } else {
        console.error('Error:', data);
        setFlashMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFlashMessage('An error occurred. Please try again later.');
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
                <label className="block text-gray-700">Research Interests</label>
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
        const times = ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4', '4-5', '5-6'];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
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
                <label className="block text-gray-700 mb-2">Available Slots</label>
                <div className="grid grid-cols-10 gap-1 text-center">
                  <div></div>
                  {times.map((time) => (
                    <div key={time} className="font-semibold">{time}</div>
                  ))}
                  {days.map((day) => (
                    <React.Fragment key={day}>
                      <div className="font-semibold">{day}</div>
                      {times.map((time) => (
                        <div
                          key={time}
                          className={`w-10 h-10 border flex justify-center items-center cursor-pointer ${availableSlots[day].includes(time) ? 'bg-green-500 text-white font-bold' : ''}`}
                          onClick={() => handleSlotChange(day, time)}
                        >
                          {availableSlots[day].includes(time) ? '✔' : ''}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg border border-gray-400 mb-20">
      <h1 className="text-4xl font-bold text-center mb-6">Teacher Registration</h1>
      {flashMessage && (
        <div className={`px-4 py-3 rounded relative mb-4 ${
          flashMessage.includes('successful') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`} role="alert">
          <span className="block sm:inline">{flashMessage}</span>
        </div>
      )}
      <div className="relative pt-1 mb-6">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: progressWidth }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
          ></div>
        </div>
      </div>
      <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-4">
        {renderStepContent()}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {step === 3 ? 'Submit' : 'Next'}
        </button>
      </form>
    </div>
  );
}

export default TeacherRegistration;