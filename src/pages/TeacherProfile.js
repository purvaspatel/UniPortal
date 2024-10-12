import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import researchOptions from '../variables/researchOptions';
import { AuthContext } from './AuthContext';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"];

function TeacherProfile() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { user, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    department: '',
    title: '',
    linkedin: '',
    profileLink: '',
    cabinNumber: '',
    photo: null,
    photoUrl: '',
    availableSlots: {},
    researchInterests: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/teacher-login', { replace: true });
    }

    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`/api/teachers/${id}`);
        const data = response.data;
        setFormData({
          name: data.name,
          email: data.email,
          school: data.school,
          department: data.department,
          title: data.title || '',
          linkedin: data.linkedin || '',
          profileLink: data.profileLink || '',
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
  }, [id, isEditing, user, navigate]);

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
      updatedFormData.append('title', formData.title);
      updatedFormData.append('linkedin', formData.linkedin);
      updatedFormData.append('profileLink', formData.profileLink);
      updatedFormData.append('cabinNumber', formData.cabinNumber);
      if (formData.photo instanceof File) {
        updatedFormData.append('photo', formData.photo);
      }
      updatedFormData.append('availableSlots', JSON.stringify(formData.availableSlots));
      updatedFormData.append('researchInterests', JSON.stringify(formData.researchInterests.map(item => item.value)));

      const response = await axios.put(`/api/teachers/${id}`, updatedFormData);
      
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

  // Handle delete request
  const handleDeleteProfile = async () => {
    try {
        const response = await axios.delete('/api/teachers/delete', {
            data: { teacherId: id, password }
        });
        alert(response.data.message);
        logout();
        // Redirect to homepage or login after deletion
        window.location.href = '/';
    } catch (error) {
        setDeleteError(error.response.data.message || "Error deleting profile");
    }
};

  const handleLogout = async () => {
    try {
      await axios.post('/api/teacher-logout');
      logout();
      navigate('/teacher-login', { replace: true });
    } catch (error) {
      alert('Failed to logout');
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://res.cloudinary.com/ds0hgmipo/image/upload/v1728231827/teacher-photos/default.jpg';
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
          <p><strong>Title:</strong> {formData.title}</p>
          {formData.linkedin && (
            <p><strong>LinkedIn:</strong> <a href={`https://linkedin.com/in/${formData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">{formData.linkedin}</a></p>
          )}
          {formData.profileLink && (
            <p><strong>Profile Link:</strong> <a href={formData.profileLink} target="_blank" rel="noopener noreferrer">{formData.profileLink}</a></p>
          )}
          <p><strong>Cabin Number:</strong> {formData.cabinNumber}</p>
          <p><strong>Research Interests:</strong> {formData.researchInterests.map(interest => interest.label).join(', ')}</p>

          {/* Available Slots Table */}
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

          <button 
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => setDeleteModalOpen(true)}
            >
                Delete Profile
            </button>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2>Confirm Deletion</h2>
                        <p>Please enter your password to confirm:</p>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded w-full mt-2"
                        />
                        {deleteError && (
                            <p className="text-red-500 mt-2">{deleteError}</p>
                        )}
                        <div className="flex justify-end mt-4">
                            <button 
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                onClick={() => setDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleDeleteProfile}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
              <option value="CSE">CSE</option>
              <option value="ICT">ICT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Chemical">Chemical</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., Professor, Assistant Professor"
            />
          </div>
          <div>
            <label className="block text-gray-700">LinkedIn Username</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-gray-700">Profile Link</label>
            <input
              type="url"
              name="profileLink"
              value={formData.profileLink}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Optional"
            />
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
              <img src={formData.photoUrl} alt={formData.name} className="mt-4 max-w-xs rounded-lg shadow" onError={handleImageError}/>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Research Interests</label>
            <Select
              isMulti
              options={researchOptions}
              value={formData.researchInterests}
              onChange={(selected) => setFormData(prev => ({ ...prev, researchInterests: selected }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Available Slots</label>
            <div className="max-w-md mx-auto mt-4">
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
                        className={`w-10 h-10 border flex justify-center items-center cursor-pointer ${formData.availableSlots[day]?.includes(time) ? 'bg-green-500' : ''}`}
                        onClick={() => handleSlotChange(day, time)}
                      ></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white p-2 rounded ml-4"
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
