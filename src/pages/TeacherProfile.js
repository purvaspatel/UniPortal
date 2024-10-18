import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import researchOptions from "../variables/researchOptions";
import { AuthContext } from "./AuthContext";
import { PlusCircle, X } from "lucide-react";

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

function TeacherProfile() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { user, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    department: "",
    title: "",
    linkedin: "",
    profileLink: "",
    cabinNumber: "",
    photo: null,
    photoUrl: "",
    availableSlots: {},
    researchInterests: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/teacher-login", { replace: true });
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
          title: data.title || "",
          linkedin: data.linkedin || "",
          profileLink: data.profileLink || "",
          photo: null,
          photoUrl: data.photo || "",
          cabinNumber: data.cabinNumber,
          availableSlots: data.availableSlots || {},
          researchInterests:
            data.researchInterests.map((interest) => ({
              value: interest,
              label: interest,
            })) || [],
        });
        setAnnouncements(data.announcements || []);
      } catch (error) {
        alert("Failed to fetch teacher data");
      }
    };
    fetchTeacher();
  }, [id, isEditing, user, navigate]);

  const handleSlotChange = (day, time) => {
    setFormData((prev) => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.school ||
      !formData.department ||
      !formData.cabinNumber ||
      !formData.title
    ) {
      alert("Please fill in all the required fields.");
      return;
    }
    try {
      const updatedFormData = new FormData();
      updatedFormData.append("name", formData.name);
      updatedFormData.append("email", formData.email);
      updatedFormData.append("school", formData.school);
      updatedFormData.append("department", formData.department);
      updatedFormData.append("title", formData.title);
      updatedFormData.append("linkedin", formData.linkedin);
      updatedFormData.append("profileLink", formData.profileLink);
      updatedFormData.append("cabinNumber", formData.cabinNumber);
      if (formData.photo instanceof File) {
        updatedFormData.append("photo", formData.photo);
      }
      updatedFormData.append(
        "availableSlots",
        JSON.stringify(formData.availableSlots)
      );
      updatedFormData.append(
        "researchInterests",
        JSON.stringify(formData.researchInterests.map((item) => item.value))
      );

      const response = await axios.put(`/api/teachers/${id}`, updatedFormData);

      if (response.data.photo) {
        setFormData((prev) => ({
          ...prev,
          photoUrl: response.data.photo,
        }));
      }

      if (!window.confirm("Are you sure you want to save the changes?")) return;
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  // Handle delete request
  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete("/api/teachers/delete", {
        data: { teacherId: id, password },
      });
      alert(response.data.message);
      logout();
      // Redirect to homepage or login after deletion
      window.location.href = "/";
    } catch (error) {
      setDeleteError(error.response.data.message || "Error deleting profile");
    }
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    try {
      const response = await axios.post(`/api/teachers/${id}/announcements`, {
        text: newAnnouncement,
      });
      setAnnouncements([...announcements, response.data]);
      setNewAnnouncement("");
    } catch (error) {
      alert("Failed to add announcement");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await axios.delete(`/api/teachers/${id}/announcements/${announcementId}`);
      setAnnouncements(announcements.filter((a) => a._id !== announcementId));
    } catch (error) {
      alert("Failed to delete announcement");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/teacher-logout");
      logout();
      navigate("/teacher-login", { replace: true });
    } catch (error) {
      alert("Failed to logout");
    }
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://res.cloudinary.com/ds0hgmipo/image/upload/v1728231827/teacher-photos/default.jpg";
  };

  if (!formData.email) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8 border-b border-gray-200 pb-4">
          Teacher Profile
        </h2>

        {!isEditing ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Section */}
              <div className="md:col-span-1">
                {formData.photoUrl && (
                  <div className="mb-6">
                    <img
                      src={formData.photoUrl}
                      alt={formData.name}
                      className="w-48 h-48 object-cover rounded-full mx-auto shadow-md border-4 border-white"
                      onError={handleImageError}
                    />
                  </div>
                )}

                <div className="space-y-3 text-center md:text-left">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formData.name}
                  </p>
                  <p className="text-gray-600">{formData.title}</p>
                  <div className="pt-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">School:</span>{" "}
                      {formData.school}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">
                        Department:
                      </span>{" "}
                      {formData.department}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-gray-900">Cabin:</span>{" "}
                      {formData.cabinNumber}
                    </p>

                    {formData.linkedin && (
                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">
                          LinkedIn:
                        </span>{" "}
                        <a
                          href={`https://linkedin.com/in/${formData.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {formData.linkedin}
                        </a>
                      </p>
                    )}
                    {formData.profileLink && (
                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">
                          Profile:
                        </span>{" "}
                        <a
                          href={formData.profileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
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
                </div>)}
          
                  <button
                    onClick={handleLogout}
                    className="w-full bg-white hover:bg-gray-50 text-black-600 border border-black-200 py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Main Content Section */}
              <div className="md:col-span-2 space-y-8">
                {/* Research Interests */}
                {/* Announcements Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Announcements&#40;visible to students&#41;
                  </h3>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement._id}
                        className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
                      >
                        <span className="text-gray-700">
                          {announcement.text}
                        </span>
                        <button
                          onClick={() =>
                            handleDeleteAnnouncement(announcement._id)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Announcement"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                    <div className="flex mt-4">
                      <input
                        type="text"
                        value={newAnnouncement}
                        onChange={(e) => setNewAnnouncement(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="New announcement"
                      />
                      <button
                        onClick={handleAddAnnouncement}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors duration-200"
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Available Slots Table */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Available Slots
                  </h3>
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
                              className={`p-3 flex justify-center items-center border border-gray-100
                              ${
                                formData.availableSlots[day]?.includes(time)
                                  ? "bg-green-50"
                                  : "bg-white"
                              }`}
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

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Research Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.researchInterests.map((interest) => (
                      <span
                        key={interest.value}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Instructions
              </h3>
              <p className="text-gray-700 mb-2">
                The information provided in this profile will be visible to
                students, allowing them to connect with you based on your
                research interests and availability.
              </p>
              <p className="text-gray-700 mb-2">
                Please ensure that your contact details are accurate and
                up-to-date for effective communication.
              </p>

              <h4 className="font-medium text-gray-900">
                Contact Information:
              </h4>
              <p className="text-gray-700">
                Email:kalashjain124@gmail.com
                <a
                  href="mailto:your-email@example.com"
                  className="text-blue-600 hover:text-blue-800"
                ></a>
              </p>
              <p className="text-gray-700">Phone:+91 91064 12192</p>
              <p className="text-gray-700">Phone:+91 87805 60746</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form
              onSubmit={handleUpdate}
              className="space-y-6 max-w-3xl mx-auto"
            >
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
                    <option value="EEE">EEE</option>
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Username
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Link
                  </label>
                  <input
                    type="url"
                    name="profileLink"
                    value={formData.profileLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional"
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  {formData.photoUrl && (
                    <img
                      src={formData.photoUrl}
                      alt={formData.name}
                      className="w-24 h-24 rounded-full object-cover"
                      onError={handleImageError}
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

              <div>
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

              <label className="block text-gray-700">Available Slots</label>
              <div className="max-w-4xl mx-auto mt-4">
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-10 gap-1 text-center">
                    {/* Empty top-left corner */}
                    <div></div>

                    {/* Time Slot Headers */}
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="w-24 border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700"
                      >
                        {time}
                      </div>
                    ))}

                    {/* Days and Available Slots */}
                    {daysOfWeek.map((day) => (
                      <React.Fragment key={day}>
                        {/* Day Column */}
                        <div className="w-24 border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700">
                          {day}
                        </div>

                        {/* Time Slot Cells */}
                        {timeSlots.map((time) => (
                          <div
                            key={time}
                            className={`w-24 h-12 border border-gray-200 flex justify-center items-center cursor-pointer p-3
                ${
                  formData.availableSlots[day]?.includes(time)
                    ? "bg-green-50"
                    : "bg-white"
                }`}
                            onClick={() => handleSlotChange(day, time)}
                          >
                            {formData.availableSlots[day]?.includes(time) && (
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            )}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherProfile;
