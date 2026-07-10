import { Routes, Route, Outlet } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import CapabilityDetail from './sections/CapabilityDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AIChat from './pages/user/AIChat';
import NewsDetail from './pages/NewsDetail';
import EventDetail from './pages/EventDetail';
import Events from './pages/Events';
import Courses from './pages/Courses';
import Blog from './pages/Blog';
import ReportDetail from './pages/ReportDetail';
import Social from './pages/Social';
import Marketplace from './pages/Marketplace';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from '@/pages/user/Dashboard';
import ScrollToTop from './components/ScrollToTop';

import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RiskDisclaimer from './pages/RiskDisclaimer';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<PublicLayout />}>
        {/* Public Homepage */}
        <Route path="/" element={<Home />} />
        
        {/* Legal Pages */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/risk-disclaimer" element={<RiskDisclaimer />} />

        {/* Protected Routes - user must log in to access anything else */}
        <Route 
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/capability/:slug" element={<CapabilityDetail />} />
          <Route path="/blog/:slug" element={<NewsDetail />} />
          <Route path="/report/:type" element={<ReportDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/social" element={<Social />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* Auth Routes with isolated layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Standalone Routes (e.g., AI Chat) */}
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}
