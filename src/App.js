import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TeacherRegistration from './pages/TeacherRegistration';
import TeacherShowProfile from './pages/TeacherShowProfile';
import TeacherSearch from './pages/TeacherSearch';
import TeacherLogin from './pages/TeacherLogin';
import TeacherProfile from './pages/TeacherProfile';
import Navbar from './pages/Navbar';
import { AuthProvider } from './pages/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
import UniClubHero from './pages/UniClubHero';
import Faq from './pages/Faq';
import AboutUs from './pages/AboutUs';
import Announcements from './pages/Announcements';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  return (
    
    <Router>  {/* Router should wrap the entire app */}
    <Navbar/>
      <AuthProvider> {/* AuthProvider must be inside Router to use useNavigate */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/teacher-registration" element={<TeacherRegistration />} />
          <Route path="/teacher/:id" element={<TeacherShowProfile />} />
          <Route path="/teacher-list" element={<TeacherSearch />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/university-clubs" element={<UniClubHero/>}/>
          <Route path="faqs-students-pdeu" element={<Faq/>}/>
          <Route path="announcements" element={<Announcements/>}/>
          <Route
            path="/teacher-profile/:id"
            element={
              <ProtectedRoute>
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      
    </Router>
  );
}

export default App;
