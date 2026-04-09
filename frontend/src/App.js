import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import ProfilesPage from './pages/ProfilesPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import ProfileRequestPage from './pages/ProfileRequestPage';
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfilesPage from './pages/admin/AdminProfilesPage';
import AdminProfileFormPage from './pages/admin/AdminProfileFormPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0A0A0A',
              color: '#F8F8F8',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }
          }}
        />
        
        <Routes>
          {/* Admin Routes (no header/footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/profiles" element={<AdminProfilesPage />} />
          <Route path="/admin/profiles/new" element={<AdminProfileFormPage />} />
          <Route path="/admin/profiles/:id/edit" element={<AdminProfileFormPage />} />

          {/* Public Routes (with header/footer) */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profiles" element={<ProfilesPage />} />
                  <Route path="/profiles/:id" element={<ProfileDetailPage />} />
                  <Route path="/profiles/:id/request" element={<ProfileRequestPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
