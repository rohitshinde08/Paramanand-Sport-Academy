import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import AchievementsPage from './pages/AchievementsPage';
import GalleryPage from './pages/GalleryPage';
import ContactUs from './pages/ContactUs';
import Register from './pages/Register';
import SportDetail from './pages/SportDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSports from './pages/admin/AdminSports';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminQueries from './pages/admin/AdminQueries';
import AdminLayout from './components/admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import LenisScroll from './components/LenisScroll';

// A wrapper component to conditionally hide Header and Footer on Admin pages
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sports/:slug" element={<SportDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Protected Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/queries" element={<AdminQueries />} />
          <Route path="/admin/sports" element={<AdminSports />} />
          <Route path="/admin/coaches" element={<div className="p-10 text-xl font-bold">Coaches CMS Coming Soon</div>} />
          <Route path="/admin/achievements" element={<div className="p-10 text-xl font-bold">Achievements CMS Coming Soon</div>} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
        </Route>
      </Routes>
      {!isAdminPage && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LenisScroll>
        <ScrollToTop />
        <AppContent />
      </LenisScroll>
    </Router>
  );
};

export default App;
