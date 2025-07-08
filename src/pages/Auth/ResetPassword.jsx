import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const { FiLock, FiEye, FiEyeOff } = FiIcons;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      toast.error('Invalid reset link');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await updatePassword(data.password);
    
    if (!error) {
      toast.success('Password updated successfully!');
      navigate('/login');
    }
    setLoading(false);
  };

  const password = watch('password');

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
            <SafeIcon icon={FiLock} className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                })}
                error={errors.password?.message}
                helper="Must contain at least 6 characters with uppercase, lowercase, and number"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <SafeIcon icon={showConfirmPassword ? FiEyeOff : FiEye} />
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Update Password
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;