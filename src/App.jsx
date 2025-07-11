import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ReunionProvider } from './contexts/ReunionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import FirstLaunchHandler from './components/FirstLaunch/FirstLaunchHandler';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ChapterRoutes from './routes/ChapterRoutes';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <FirstLaunchHandler>
        <AuthProvider>
          <ReunionProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Routes>
                  {/* Public Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected app routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="chapters/*" element={<ChapterRoutes />} />
                  </Route>
                </Routes>

                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </div>
            </Router>
          </ReunionProvider>
        </AuthProvider>
      </FirstLaunchHandler>
    </ThemeProvider>
  );
}

export default App;