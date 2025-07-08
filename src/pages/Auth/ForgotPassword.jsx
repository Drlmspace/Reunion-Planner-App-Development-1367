import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { motion } from 'framer-motion';

const { FiMail, FiArrowLeft } = FiIcons;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await resetPassword(data.email);
    
    if (!error) {
      setEmailSent(true);
    }
    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <div className="mb-6">
              <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
                <SafeIcon icon={FiMail} className="text-2xl text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-gray-600">
                We've sent a password reset link to your email address. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
            <div className="space-y-4">
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Back to Sign In
                </Button>
              </Link>
              <button
                onClick={() => setEmailSent(false)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="bg-primary-600 p-3 rounded-full inline-flex mb-4">
            <SafeIcon icon={FiMail} className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <Card>
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
              disabled={loading}
              placeholder="Enter your email address"
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <SafeIcon icon={FiArrowLeft} className="mr-2" />
              Back to Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;