const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const teacherSchema = new mongoose.Schema({
  publicId: {
    type: String,
    default: uuidv4, // Generate a unique ID by default
    unique: true, // Ensure it's unique in the database
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
  },
  profileLink: {
    type: String,
  },
  school: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // Assuming you store the path to the photo
  },
  cabinNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  availableSlots: {
    type: Map,
    of: [String], // Each day (Mon, Tue, etc.) maps to an array of time slots
    required: true,
  },
  researchInterests: {
    type: [String],
    default: [],
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
