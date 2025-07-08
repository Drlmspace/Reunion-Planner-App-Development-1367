import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ReunionProvider } from './contexts/ReunionContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ChapterRoutes from './routes/ChapterRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ReunionProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Auth routes - kept for future use but not accessible in dev mode */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Main app routes - always accessible in dev mode */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
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
  );
}

export default App;