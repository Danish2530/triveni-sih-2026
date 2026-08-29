import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Waves, Bell, LogOut, User, PlusCircle, CheckCircle, ChevronDown } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
      setUnreadCount((res.data || []).filter(n => !n.isRead).length);
    } catch (err) {
      // Silent catch for guest mode
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'citizen': return '/citizen/dashboard';
      case 'university': return '/university/dashboard';
      case 'industry': return '/industry/dashboard';
      case 'government': return '/government/dashboard';
      default: return '/citizen/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 text-slate-900 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <Waves className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">TRIVENI</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">SIH 26043</span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium hidden sm:block">From Community Problems to Real Solutions</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            {user ? (
              <>
                <Link to={getDashboardPath()} className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400">
                  Dashboard
                </Link>
                {user.role === 'citizen' && (
                  <>
                    <Link to="/citizen/submit-problem" className="hover:text-emerald-400 transition-colors">Report Problem</Link>
                    <Link to="/citizen/my-problems" className="hover:text-emerald-400 transition-colors">My Problems</Link>
                  </>
                )}
                {user.role === 'university' && (
                  <>
                    <Link to="/university/challenges" className="hover:text-emerald-400 transition-colors">Challenges</Link>
                    <Link to="/university/dashboard" className="hover:text-emerald-400 transition-colors">Projects</Link>
                  </>
                )}
                {user.role === 'industry' && (
                  <Link to="/industry/projects" className="hover:text-emerald-400 transition-colors">Explore Projects</Link>
                )}
                {user.role === 'government' && (
                  <Link to="/government/dashboard" className="hover:text-emerald-400 transition-colors">Impact Analytics</Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Challenges</Link>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Universities</Link>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">Impact</Link>
              </>
            )}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'citizen' && (
                  <Link
                    to="/citizen/submit-problem"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Report Problem</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative cursor-pointer"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in text-slate-200">
                      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications ({unreadCount})</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Triveni Updates</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">No notifications yet</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkAsRead(n._id)}
                              className={`p-3 text-xs hover:bg-slate-800/80 transition-colors cursor-pointer ${
                                !n.isRead ? 'bg-slate-800/40 border-l-2 border-emerald-500' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between font-semibold text-white mb-1">
                                <span>{n.title}</span>
                                {!n.isRead && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
                              </div>
                              <p className="text-slate-400 text-[11px] leading-snug">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wider leading-tight mt-0.5">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in text-slate-200 divide-y divide-slate-800">
                      <div className="p-3 bg-slate-950">
                        <p className="text-xs font-semibold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          Role: {user.role}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <User className="w-4 h-4 text-emerald-400" />
                          <span>My Dashboard</span>
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
