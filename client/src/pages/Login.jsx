import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Waves, LogIn, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Login = () => {
  const { login, quickDemoLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      redirectUser(user.role);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    try {
      const user = await quickDemoLogin(role);
      redirectUser(user.role);
    } catch (err) {
      setError('Demo login failed. Make sure backend seed script ran.');
    }
  };

  const redirectUser = (role) => {
    switch (role) {
      case 'citizen': navigate('/citizen/dashboard'); break;
      case 'university': navigate('/university/dashboard'); break;
      case 'industry': navigate('/industry/dashboard'); break;
      case 'government': navigate('/government/dashboard'); break;
      default: navigate('/citizen/dashboard'); break;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <Waves className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to Triveni</h2>
          <p className="text-xs text-slate-400 mt-1">SIH 2026 Problem Statement 26043 Platform</p>
        </div>

        {/* 1-Click Demo Accounts Selector */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-3">
            <Sparkles className="w-4 h-4" />
            <span>SIH Fast 1-Click Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoClick('citizen')}
              className="px-3 py-2 bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <span>Citizen</span>
              <span className="text-[10px] text-slate-500">Ramesh</span>
            </button>
            <button
              onClick={() => handleDemoClick('university')}
              className="px-3 py-2 bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <span>University</span>
              <span className="text-[10px] text-slate-500">BIT Mesra</span>
            </button>
            <button
              onClick={() => handleDemoClick('industry')}
              className="px-3 py-2 bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <span>Industry</span>
              <span className="text-[10px] text-slate-500">Tata Steel</span>
            </button>
            <button
              onClick={() => handleDemoClick('government')}
              className="px-3 py-2 bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 rounded-lg text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all text-left flex items-center justify-between cursor-pointer"
            >
              <span>Government</span>
              <span className="text-[10px] text-slate-500">Jharkhand</span>
            </button>
          </div>
        </div>

        <Card hover={false} padding="p-6" className="bg-slate-900 border-slate-800 text-slate-100">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. citizen@demo.com"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              loading={loading}
              className="w-full py-2.5 mt-2"
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
              Register now
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
