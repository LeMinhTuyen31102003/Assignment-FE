import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from '../../assets/images/auth/d0cdc9e65a2ca9c7e53886f43f0cf62356d4105f.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: false, password: false });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      username: username.trim() === '',
      password: password.trim() === '',
    };

    setErrors(newErrors);

    if (!newErrors.username && !newErrors.password) {
      console.log('Login submitted:', { username, password });
      // TODO: Implement actual login logic
      // navigate('/');
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

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-semibold text-gray-800">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: false }));
                }}
                className={`px-4 py-3 border rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)] ${
                  errors.username
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.username && (
                <span className="text-red-500 text-xs mt-1">This field is required</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: false }));
                }}
                className={`px-4 py-3 border rounded-md text-sm transition-all outline-none placeholder-gray-400 focus:shadow-[0_0_0_3px_rgba(77,166,255,0.1)] ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">This field is required</span>
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
                className="flex-1 px-6 py-3 bg-blue-500 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(77,166,255,0.4)]"
              >
                Login
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
