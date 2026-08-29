import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  GraduationCap,
  Briefcase,
  BarChart3,
  Bell,
  UserCheck,
  Building2,
  Award
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'citizen';

  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/submit-problem', label: 'Report Problem', icon: PlusCircle },
    { to: '/citizen/my-problems', label: 'My Problems', icon: FileText }
  ];

  const universityLinks = [
    { to: '/university/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/university/challenges', label: 'Available Challenges', icon: GraduationCap },
    { to: '/university/create-project', label: 'Create R&D Project', icon: PlusCircle }
  ];

  const industryLinks = [
    { to: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/industry/projects', label: 'Explore Projects', icon: Briefcase }
  ];

  const governmentLinks = [
    { to: '/government/dashboard', label: 'Impact Analytics', icon: BarChart3 },
    { to: '/citizen/my-problems', label: 'All Challenges', icon: FileText },
    { to: '/industry/projects', label: 'All Projects', icon: Building2 }
  ];

  const getLinks = () => {
    switch (role) {
      case 'citizen': return citizenLinks;
      case 'university': return universityLinks;
      case 'industry': return industryLinks;
      case 'government': return governmentLinks;
      default: return citizenLinks;
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800 hidden md:block">
      <div className="px-3 py-2 mb-4 bg-slate-850 rounded-xl border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Active Workspace</span>
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span className="capitalize">{role} Portal</span>
        </div>
      </div>

      <nav className="space-y-1">
        {getLinks().map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Demo Credentials Switcher Footer Box */}
      <div className="mt-8 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">SIH 26043 Demo Mode</p>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Switch role view anytime from the top user menu or login screen.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
