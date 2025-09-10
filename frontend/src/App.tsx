import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';
import EventsHub from './pages/EventsHub';
import AIMatching from './pages/AIMatching';
import MessagesPage from './pages/MessagesPage';
import MyEvents from './pages/MyEvents';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ReportsManagement from './pages/admin/ReportsManagement';
import EventApprovals from './pages/admin/EventApprovals';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import CreateEvent from './pages/Event/CreateEvent';
import EventDiscussion from './pages/Event/EventDiscussion';
import EventBooking from './pages/Event/EventBooking';

function App() {
    const [user, setUser] = useState<any>(null);
  //   const navigate = useNavigate();



  //     const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   sessionStorage.removeItem("user");
  //   setUser(null);
  //   navigate("/login");
  // };


  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/events" element={<EventsHub />} />
            <Route path="/matching" element={<AIMatching />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/reports" element={<ReportsManagement />} />
            <Route path="/admin/approvals" element={<EventApprovals />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/event/:eventId/discussion" element={<EventDiscussion />} />
            <Route path="/event/:eventId/book" element={<EventBooking />} />



          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;