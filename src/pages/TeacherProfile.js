import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import researchOptions from '../variables/researchOptions';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"];

function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    department: '',
    cabinNumber: '',
    photo: null,
    photoUrl: '',
    availableSlots: {},
    researchInterests: []
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`/api/teachers/${id}`);
        const data = response.data;
        setFormData({
          name: data.name,
          email: data.email,
          school: data.school,
          department: data.department,
          photo: null,
          photoUrl: data.photo || '',
          cabinNumber: data.cabinNumber,
          availableSlots: data.availableSlots || {},
          researchInterests: data.researchInterests.map(interest => ({ value: interest, label: interest })) || []
        });
      } catch (error) {
        alert('Failed to fetch teacher data');
      }
    };
    fetchTeacher();
  }, [id, isEditing]);

  const handleSlotChange = (day, time) => {
    setFormData(prev => {
      const updatedSlots = { ...prev.availableSlots };
      if (updatedSlots[day]?.includes(time)) {
        updatedSlots[day] = updatedSlots[day].filter((slot) => slot !== time);
      } else {
        updatedSlots[day] = [...(updatedSlots[day] || []), time];
      }
      return { ...prev, availableSlots: updatedSlots };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      // Create a temporary URL for preview
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = new FormData();
      updatedFormData.append('name', formData.name);
      updatedFormData.append('email', formData.email);
      updatedFormData.append('school', formData.school);
      updatedFormData.append('department', formData.department);
      updatedFormData.append('cabinNumber', formData.cabinNumber);
      if (formData.photo instanceof File) {
        updatedFormData.append('photo', formData.photo);
      }
      updatedFormData.append('availableSlots', JSON.stringify(formData.availableSlots));
      updatedFormData.append('researchInterests', JSON.stringify(formData.researchInterests.map(item => item.value)));

      const response = await axios.put(`/api/teachers/${id}`, updatedFormData);
      
      // Update the photoUrl with the new Cloudinary URL if a new photo was uploaded
      if (response.data.photo) {
        setFormData(prev => ({
          ...prev,
          photoUrl: response.data.photo
        }));
      }

      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/teacher-logout'); // Using relative path since baseURL is set
      
      // Clear session storage
      sessionStorage.removeItem('user');
      
      // Redirect to login page and replace history entry
      navigate('/teacher-login', { replace: true });
    } catch (error) {
      alert('Failed to logout');
    }
  }

  const handleImageError = (e) => {
    e.target.src = 'samples/man-potrait'; // Add a placeholder image in your public folder
  };

  if (!formData.email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Teacher Profile</h2>

      {!isEditing ? (
        <div>
          {formData.photoUrl && (
            <img src={formData.photoUrl} alt={formData.name} className="mt-4 max-w-xs rounded-lg shadow" onError={handleImageError}/>
          )}
          <br />
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>School:</strong> {formData.school}</p>
          <p><strong>Department:</strong> {formData.department}</p>
          <p><strong>Cabin Number:</strong> {formData.cabinNumber}</p>
          <p><strong>Research Interests:</strong> {formData.researchInterests.map(interest => interest.label).join(', ')}</p>
          <div className="max-w-md mx-auto mt-10">
            <h3 className="text-xl font-bold mt-4">Available Slots</h3>
            <div className="grid grid-cols-10 gap-1 text-center">
              <div></div>
              {timeSlots.map((time) => (
                <div key={time} className="font-semibold">{time}</div>
              ))}
              {daysOfWeek.map((day) => (
                <React.Fragment key={day}>
                  <div className="font-semibold">{day}</div>
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className={`w-10 h-10 border flex justify-center items-center ${formData.availableSlots[day]?.includes(time) ? 'bg-green-500' : ''}`}
                    ></div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(true)} 
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">School</label>
            <select
              name="school"
              value={formData.school}
              onChange={handleInputChange}
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
              name="department"
              value={formData.department}
              onChange={handleInputChange}
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
            <label className="block text-gray-700">Cabin Number</label>
            <input
              type="text"
              name="cabinNumber"
              value={formData.cabinNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Photo</label>
            {formData.photoUrl && (
              <img src={formData.photoUrl} alt="Current" className="mt-2 max-w-xs rounded-lg shadow" />
            )}
            <input
              type="file"
              onChange={handlePhotoChange}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Research Interests</label>
            <Select
              isMulti
              options={researchOptions}
              value={formData.researchInterests}
              onChange={(selectedOptions) => setFormData(prev => ({ ...prev, researchInterests: selectedOptions }))}
              className="w-full"
              placeholder="Select research interests"
            />
          </div>
          <div className="max-w-md mx-auto mt-10">
            <label className="block text-gray-700 mb-2">Available Slots</label>
            <div className="grid grid-cols-10 gap-1 text-center">
              <div></div>
              {timeSlots.map((time) => (
                <div key={time} className="font-semibold">{time}</div>
              ))}
              {daysOfWeek.map((day) => (
                <React.Fragment key={day}>
                  <div className="font-semibold">{day}</div>
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className={`w-10 h-10 border flex justify-center items-center cursor-pointer ${formData.availableSlots[day]?.includes(time) ? 'bg-green-500 text-white font-bold' : ''}`}
                      onClick={() => handleSlotChange(day, time)}
                    >
                      {formData.availableSlots[day]?.includes(time) ? '✔️' : ''}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-red-500 text-white p-2 rounded ml-4"
          >
            Cancel
          </button>
        </form>
      )}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default TeacherProfile;