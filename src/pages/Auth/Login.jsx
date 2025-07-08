import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Footer from '../../components/Layout/Footer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiMail, FiLock, FiUsers, FiShield } = FiIcons;

const Login = () => {
  const { user, signIn, isSupabaseAvailable } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Admin login form state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminForm, setShowAdminForm] = useState(false);

  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  if (user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    const { error } = await signIn(data.email, data.password);
    if (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Signed in successfully!');
      navigate(from, { replace: true });
    }

    setLoading(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check admin credentials
    if (adminUsername !== 'GameMicey' || adminPassword !== 'RUReady25?') {
      setError('Invalid administrator credentials');
      toast.error('Invalid administrator credentials');
      setLoading(false);
      return;
    }

    // Create admin user object
    const mockAdminUser = {
      id: 'admin-user-id',
      email: 'admin@reunionplanner.com',
      user_metadata: {
        first_name: 'Administrator',
        last_name: 'User',
        role: 'admin'
      },
      role: 'admin'
    };

    // Store admin session in localStorage for this session
    try {
      localStorage.setItem('adminSession', JSON.stringify(mockAdminUser));
      toast.success('Administrator logged in successfully!');
      navigate(from, { replace: true });
      // Force page reload to trigger auth context update
      window.location.reload();
    } catch (error) {
      console.error('Error during admin login:', error);
      toast.error('Failed to login as administrator');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-600 p-3 rounded-full">
                <SafeIcon icon={FiUsers} className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to your Reunion Planner account</p>
          </div>

          <Card>
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            {!showAdminForm ? (
              <>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Please enter a valid email'
                      }
                    })}
                    error={errors.email?.message}
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    error={errors.password?.message}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                </form>

                {/* Administrator Login Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <SafeIcon icon={FiShield} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">Administrator Access</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      For system administrators and demo access
                    </p>
                    <Button
                      onClick={() => setShowAdminForm(true)}
                      variant="outline"
                      fullWidth
                      className="flex items-center justify-center space-x-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <SafeIcon icon={FiShield} />
                      <span>Administrator Login</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <SafeIcon icon={FiShield} className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center mb-6 dark:text-white">Administrator Login</h2>

                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <Input
                    label="Username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter administrator username"
                    required
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                  >
                    Login as Administrator
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => setShowAdminForm(false)}
                  >
                    Back to Regular Login
                  </Button>
                </form>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;