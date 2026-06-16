import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, ArrowRight, Lock, User } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    axios.post('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(res => {
        const token = res.data.access_token;
        // NOTE: The backend expects the token in localStorage as 'token' not 'adminToken' based on AdminLayout
        localStorage.setItem('token', token); 
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/admin/dashboard');
      })
      .catch(err => {
        console.error('Login error:', err);
        setErrorMsg('Invalid credentials. Please try again or contact IT.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex bg-white font-body">
      
      {/* Left Column - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
          style={{ backgroundImage: "url('/img/banners/aboutba.jpeg')" }}
        ></div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 p-16 max-w-2xl text-white">
          <div className="mb-12">
            <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-2xl mb-6 flex items-center justify-center">
              <img src="/img/psa.png" alt="PSA logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-5xl font-extrabold font-heading leading-tight mb-4">
              Parmanand <span className="text-accent">Sports</span><br />Academy
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-md">
              Secure management portal for academy staff. Oversee athlete registrations, update the public gallery, and track performance analytics.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-400">
            <ShieldAlert size={18} className="text-accent" />
            Authorized Personnel Only
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-slate-50 relative overflow-hidden">
        
        {/* Abstract Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

        <div className="w-full max-w-md relative z-10">
          
          <div className="lg:hidden flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-lg border border-slate-100 flex items-center justify-center">
              <img src="/img/psa.png" alt="PSA logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-primary leading-tight">
              PSA <span className="text-accent">Admin</span>
            </h2>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold font-heading text-primary mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your administrator account.</p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm mb-6 font-semibold flex items-start gap-3 animate-fade-in">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" /> 
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 text-base border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 text-base border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-4 text-lg font-bold bg-primary text-white rounded-xl shadow-lg hover:bg-primary-light hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
