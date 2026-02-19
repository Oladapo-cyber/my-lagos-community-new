import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const TESTIMONIAL_BG = 'https://communitycra.vercel.app/static/media/testimonial-bg.c8ade2e3b78e6414590c.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
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

          <div className="border-b border-gray-300">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              placeholder="Password"
            />
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
              Remeber Me
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
