require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const Teacher = require('./models/Teacher');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production (HTTPS)
    httpOnly: true, // Makes cookie inaccessible to client-side JS
    maxAge: 1 * 60 * 60 * 1000 // 1 hour session expiration
  }
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

cloudinary.config({ 
  cloud_name: 'ds0hgmipo', 
  api_key: '755621992983658', 
  api_secret: 'FU6uSEMyjKwjCIXKzoeDuMgBPGo'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'teacher-photos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 500, height: 500, crop: 'fill' },
      { quality: 'auto:low' },
      { fetch_format: 'auto' },
      { compression: 'low' }
    ]
  }
});

const upload = multer({ storage: storage });

// MongoDB connection
const mongo_uri = process.env.MONGO_URI || "mongodb+srv://kalashjain124:KalashJain12@cluster0.ev11zj4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware to check if the teacher is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.teacherId) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}


app.get('/api/teachers/search', async (req, res) => {
  try {
    const { interests } = req.query;
    console.log('Received interests:', interests);
    let teachers;

    if (interests) {
      const interestsArray = interests.split(',').map(interest => interest.trim());
      console.log('Searching for interests:', interestsArray);
      teachers = await Teacher.find({ researchInterests: { $in: interestsArray } }).sort({ name: 1 });
    } else {
      teachers = await Teacher.find({}).sort({ name: 1 });
    }

    console.log('Found teachers:', teachers.length);
    res.json(teachers || []);
  } catch (error) {
    console.error('Detailed error in fetching teachers:', error);
    res.status(500).json({ 
      message: 'Error fetching teacher(s)', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.delete('/api/teachers/delete', async (req, res) => {
  try {
      const { teacherId, password } = req.body;

      // Find the teacher by ID
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
          return res.status(404).json({ message: "Teacher not found" });
      }

      // Compare the provided password with the stored password
      if (teacher.password !== password) {
          return res.status(401).json({ message: "Incorrect password" });
      }

      // Delete the teacher's profile
      await Teacher.findByIdAndDelete(teacherId);

      // Destroy session and clear cookie
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to destroy session' });
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        return res.status(200).json({ message: "Profile deleted successfully" }); // Send response only once here
      });
  } catch (error) {
      res.status(500).json({ message: "Error deleting profile", error });
  }
});

// Route to handle teacher registration
app.post('/api/teachers', upload.single('photo'), async (req, res) => {
  try {
    const { name, email, school, department, title, cabinNumber, password, availableSlots, researchInterests } = req.body;

    if (!name || !email || !school || !department || !title || !cabinNumber || !password || !availableSlots) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const photo = req.file ? req.file.path : null;
    let parsedSlots = {};
    let parsedInterests = [];

    try {
      parsedSlots = JSON.parse(availableSlots);
      parsedInterests = JSON.parse(researchInterests);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid availableSlots or researchInterests format' });
    }

    const newTeacher = new Teacher({
      name,
      email,
      school,
      department,
      title,
      cabinNumber,
      photo,
      password,
      availableSlots: parsedSlots,
      researchInterests: parsedInterests,
    });

    await newTeacher.save();
    const serverBaseUrl = req.protocol + '://' + req.get('host');
    res.status(201).json({
      ...newTeacher.toObject(),
      photoUrl: photo ? `${serverBaseUrl}${photo}` : null,
    });
  } catch (error) {
    console.error('Error saving teacher:', error);
    res.status(500).json({ message: 'Server error, please try again later.', error: error.message });
  }
});

app.get('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
});

// Teacher login
app.post('/api/teacher-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher || teacher.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    req.session.teacherId = teacher._id;

    res.json({
      message: 'Login successful',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get teacher profile
app.get('/api/teachers/:id?', async (req, res) => {
  try {
    if (req.params.id) {
      // If an ID is provided, fetch the specific teacher
      const teacher = await Teacher.findById(req.params.id).select('-password');
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json(teacher);
    } else {
      // If no ID is provided, fetch all teachers
      const teachers = await Teacher.find();
      res.json(teachers);
    }
  } catch (error) {
    console.error('Error fetching teacher(s):', error);
    res.status(500).json({ message: 'Error fetching teacher(s)', error: error.message });
  }
});


// Teacher profile update
app.put('/api/teachers/:id', isAuthenticated, upload.single('photo'), async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updateData = req.body;

    // If a new photo was uploaded
    if (req.file) {
      const currentTeacher = await Teacher.findById(teacherId).select('-password');

      if (currentTeacher.photo) {
        console.log(currentTeacher.photo)
        const publicId = "teacher-photos/" + currentTeacher.photo
          .split('/')
          .pop()
          .split('.')[0]; // Extract public_id from URL
        console.log(publicId);
        
        try {
          cloudinary.uploader.destroy(publicId, function(result) { console.log(result) });
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          // Continue with the update even if delete fails
        }
      }

      updateData.photo = req.file.path;
    }

    // Parse JSON strings if they exist
    if (typeof updateData.availableSlots === 'string') {
      updateData.availableSlots = JSON.parse(updateData.availableSlots);
    }
    if (typeof updateData.researchInterests === 'string') {
      updateData.researchInterests = JSON.parse(updateData.researchInterests);
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    res.status(500).json({ 
      message: 'Error updating teacher profile', 
      error: error.message 
    });
  }
});

app.post('/api/teachers/:id/announcements', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const newAnnouncement = { text, createdAt: new Date() };
    teacher.announcements.push(newAnnouncement);
    await teacher.save();

    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ message: 'Error adding announcement', error: error.message });
  }
});

// Delete an announcement
app.delete('/api/teachers/:teacherId/announcements/:announcementId', isAuthenticated, async (req, res) => {
  try {
    const { teacherId, announcementId } = req.params;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.announcements = teacher.announcements.filter(
      (announcement) => announcement._id.toString() !== announcementId
    );
    await teacher.save();

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
});

// Teacher logout
app.post('/api/teacher-logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); // Clears the session cookie
    res.json({ message: 'Logout successful' });
  });
});

app.get('/api/check-auth', (req, res) => {
  if (req.session.teacherId) {
    res.json({ loggedIn: true, user: req.session.teacherId });
  } else {
    res.json({ loggedIn: false });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});