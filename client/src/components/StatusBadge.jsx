import React from 'react';

const StatusBadge = ({ status, type = 'status' }) => {
  const getBadgeStyle = () => {
    const val = (status || '').toLowerCase();
    
    // Urgency / Priority Badges
    if (val === 'critical' || val === 'high') {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (val === 'medium') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (val === 'low') {
      return 'bg-slate-100 text-slate-700 border-slate-200';
    }

    // Problem & Project Status Badges
    switch (val) {
      case 'submitted':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'under review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'validated':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in development':
      case 'development':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'testing':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'deployed':
      case 'completed':
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
