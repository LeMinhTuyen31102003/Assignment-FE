import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import registerBg from '../../assets/images/auth/d0cdc9e65a2ca9c7e53886f43f0cf62356d4105f.png';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'),
  username: z.string().min(1, 'Username is required'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;
type PasswordStrength = 'weak' | 'medium' | 'strong' | '';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  // Update password strength whenever password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Transform data to match backend API format
      const registerPayload = {
        email: data.email,
        password: data.password,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone,
      };
      
      await registerUser(registerPayload);
      toast.success('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Registration failed. Please try again.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
      style={{ backgroundImage: `url(${registerBg})` }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        .password-strength-bar.weak {
          width: 33%;
          background: #ff4444;
        }
        .password-strength-bar.medium {
          width: 66%;
          background: #ffa500;
        }
        .password-strength-bar.strong {
          width: 100%;
          background: #4CAF50;
        }
      `}</style>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/85 to-blue-600/85 z-[1]"></div>

      <div className="relative z-[2] w-full max-w-[600px] px-5 py-5">
        <div className="bg-white rounded-xl p-8 md:px-10 md:py-8 shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-slide-in max-h-screen overflow-y-auto">
          <h1 className="text-center text-gray-800 text-3xl mb-5 font-bold">Register</h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-semibold text-gray-800">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register('firstName')}
                  className={`px-4 py-3 border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]`}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>
                )}
              </div>

              <div className="form-group flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-semibold text-gray-800">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  {...register('lastName')}
                  className={`px-4 py-3 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]`}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="form-group flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register('email')}
                className={`px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="form-group flex flex-col gap-2">
                <label htmlFor="username" className="text-sm font-semibold text-gray-800">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  {...register('username')}
                  className={`px-4 py-3 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]`}
                />
                {errors.username && (
                  <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>
                )}
              </div>

              <div className="form-group flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-semibold text-gray-800">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  {...register('phone')}
                  className={`px-4 py-3 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]`}
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>
                )}
              </div>
            </div>

            <div className="form-group flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register('password', {
                  onChange: (e) => setPasswordStrength(calculatePasswordStrength(e.target.value))
                })}
                className={`px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]`}
              />
              <div className="password-strength h-1 bg-gray-300 rounded-sm mt-1 overflow-hidden">
                <div className={`password-strength-bar h-full w-0 transition-all rounded-sm ${passwordStrength}`}></div>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className={`px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)]`}
              />
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="flex gap-3 mt-1 flex-col md:flex-row">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-white text-gray-600 border-2 border-gray-300 rounded-md text-base font-semibold cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400"
              >
                Back to Home
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-500 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(77,166,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-500 no-underline font-semibold transition-colors hover:text-blue-600 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
