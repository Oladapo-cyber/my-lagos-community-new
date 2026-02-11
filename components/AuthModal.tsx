import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Phone, User, ArrowRight, MapPin } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: 'login' | 'signup';
  onAuthSuccess: () => void;
}

const LoginForm = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
    setTimeout(() => onAuthSuccess(), 500);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
       <div className="space-y-3 text-left">
          <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Username or Email</label>
          <div className="relative group">
             <input 
                type="text" 
                placeholder="Username or email" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400 group-hover:border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
             />
             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" /> 
          </div>
       </div>

       <div className="space-y-3 text-left">
          <div className="flex items-center justify-between ml-1">
             <label className="text-xs font-black uppercase tracking-widest text-gray-600">Password</label>
             <a href="#" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
          </div>
          <div className="relative group">
             <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-12 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400 group-hover:border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
             />
             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
             >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
             </button>
          </div>
       </div>

       <button type="submit" className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all mt-6 transform active:scale-[0.98] flex items-center justify-center gap-2 group">
          <span>LOG IN</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
       </button>
    </form>
  );
};

const SignupForm = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup:', formData);
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setTimeout(() => onAuthSuccess(), 500);
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">First Name</label>
           <div className="relative group">
              <input 
                type="text" 
                name="firstName"
                placeholder="First name" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
           </div>
        </div>

        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Last Name</label>
           <div className="relative group">
              <input 
                type="text" 
                name="lastName"
                placeholder="Last name" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
           </div>
        </div>

        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Username</label>
           <div className="relative group">
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
           </div>
        </div>

        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Email Address</label>
           <div className="relative group">
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
           </div>
        </div>

        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Phone Number</label>
           <div className="relative group">
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone number" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
           </div>
        </div>

        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Address / Location</label>
           <div className="relative group">
              <input 
                type="text" 
                name="address"
                placeholder="Address / Location" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
           </div>
        </div>

        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Password</label>
           <div className="relative group">
              <input 
                 type={showPassword ? "text" : "password"} 
                 name="password"
                 placeholder="Enter password"
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-12 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                 value={formData.password}
                 onChange={handleChange}
                 required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              <button 
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
           </div>
        </div>

        <div className="space-y-2 text-left">
           <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Confirm Password</label>
           <div className="relative group">
              <input 
                 type={showConfirmPassword ? "text" : "password"} 
                 name="confirmPassword"
                 placeholder="Confirm password"
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-12 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-gray-400"
                 value={formData.confirmPassword}
                 onChange={handleChange}
                 required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              <button 
                 type="button"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
           </div>
        </div>

        <button type="submit" className="md:col-span-2 w-full bg-[#2563eb] hover:bg-blue-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all mt-4 transform active:scale-[0.98] flex items-center justify-center gap-2 group">
           <span>CREATE ACCOUNT</span>
           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
    </form>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView, onAuthSuccess }) => {
  const [view, setView] = useState(initialView);
  
  useEffect(() => {
    if (isOpen) setView(initialView);
  }, [isOpen, initialView]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>
       <div className={`bg-white rounded-3xl w-full ${view === 'signup' ? 'max-w-[800px]' : 'max-w-[480px]'} max-h-[90vh] overflow-y-auto no-scrollbar relative z-10 shadow-2xl transition-all duration-300 transform scale-100`}>
          
          {/* Header Bar */}
          <div className="sticky top-0 left-0 right-0 p-6 flex justify-end z-20 bg-white/80 backdrop-blur-sm">
             <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all">
                <X className="w-5 h-5" />
             </button>
          </div>
          
          <div className="px-8 pb-10 md:px-12 md:pb-14">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-3xl font-black text-[#111] mb-2 tracking-tight">
                {view === 'login' ? 'Welcome back' : 'Create Account'}
              </h2>
              <p className="text-gray-500 font-bold text-sm">
                {view === 'login' ? 'Please sign in to your account' : 'Join our community today'}
              </p>
            </div>

            {view === 'login' ? (
              <LoginForm onAuthSuccess={onAuthSuccess} />
            ) : (
              <SignupForm onAuthSuccess={onAuthSuccess} />
            )}

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-sm font-medium text-gray-500">
                  {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => setView(view === 'login' ? 'signup' : 'login')} className="text-[#2563eb] hover:text-blue-700 font-black ml-1 transition-colors uppercase tracking-wider text-xs">
                    {view === 'login' ? 'Sign up' : 'Log in'}
                  </button>
              </p>
            </div>
          </div>
       </div>
    </div>
  );
}