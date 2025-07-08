import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiUsers, FiMail, FiLock, FiUser } = FiIcons;

const Register = () => {
  const { user, signUp, isSupabaseAvailable } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    const { error } = await signUp(
      data.email,
      data.password,
      {
        first_name: data.firstName,
        last_name: data.lastName
      }
    );

    if (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to create account');
    } else {
      if (isSupabaseAvailable) {
        toast.success('Account created successfully! Please check your email to verify your account.');
      } else {
        toast.success('Account created successfully! You can now start planning your reunion.');
      }
      navigate('/');
    }

    setLoading(false);
  };

  const password = watch('password');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <SafeIcon icon={FiUsers} className="text-3xl text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">
            Join Reunion Planner and start organizing memorable events
          </p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
                error={errors.firstName?.message}
                required
              />

              <Input
                label="Last Name"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
                error={errors.lastName?.message}
                required
              />
            </div>

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
              helper="Must be at least 6 characters"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;