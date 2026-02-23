import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const TESTIMONIAL_BG = 'https://communitycra.vercel.app/static/media/testimonial-bg.c8ade2e3b78e6414590c.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('admin_remember_email');
    const savedPassword = localStorage.getItem('admin_remember_password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      if (rememberMe) {
        localStorage.setItem('admin_remember_email', email);
        localStorage.setItem('admin_remember_password', password);
      } else {
        localStorage.removeItem('admin_remember_email');
        localStorage.removeItem('admin_remember_password');
      }
      
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('incorrect password')) {
        setError('Incorrect password');
      } else if (msg.includes('incorrect username') || msg.includes('incorrect email')) {
        setError('Incorrect username or email');
      } else if (msg.includes('unauthorized') || msg.includes('admin access')) {
        setError(err.message); // Keep the specific admin role error
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: `url(${TESTIMONIAL_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Login Card */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm px-10 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-7">Hello Admin!</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-gray-300">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              placeholder="Email Address"
            />
          </div>

          <div className="border-b border-gray-300 flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-400 hover:text-gray-600 transition focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-md transition-colors duration-200 text-sm tracking-widest uppercase mt-2 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Forgot password — outside the card */}
      <div className="mt-5">
        <a
          href="#"
          className="text-sm text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
        >
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
