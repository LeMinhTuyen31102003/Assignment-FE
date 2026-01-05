import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/contexts/useAuthContext';
import loginBg from '../../assets/images/auth/d0cdc9e65a2ca9c7e53886f43f0cf62356d4105f.png';

const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginApi } = useAuth();
  const { login: setAuthUser } = useAuthContext();
  
  // Get the return URL from location state or default to home
  const from = (location.state as { from?: string })?.from || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginApi(data);
      
      if (result) {
        setAuthUser(result.user);
        toast.success('Login successful!');
        // Redirect to the page user was trying to access, or home
        navigate(from, { replace: true });
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Login failed. Please check your connection.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/85 to-blue-600/85 z-[1]"></div>

      <div className="relative z-[2] w-full max-w-[600px] px-5">
        <div className="bg-white rounded-xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-[slideIn_0.5s_ease-out]">
          <h1 className="text-center text-gray-800 text-4xl mb-8 font-bold">Login</h1>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register('email')}
                className={`px-4 py-3 border rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)] ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register('password')}
                className={`px-4 py-3 border rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)] ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
              )}
            </div>

            <div className="flex gap-3 mt-2.5 flex-col md:flex-row">
              <button
                type="button"
                onClick={handleBackToHome}
                className="flex-1 px-6 py-3 bg-white text-gray-600 border-2 border-gray-300 rounded-md text-base font-semibold cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400"
              >
                Back to Home
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-500 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(77,166,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="text-center mt-2.5">
              <Link
                to="/forgot-password"
                className="text-blue-500 text-sm no-underline transition-colors hover:text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-500 no-underline font-semibold transition-colors hover:text-blue-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default Login;
