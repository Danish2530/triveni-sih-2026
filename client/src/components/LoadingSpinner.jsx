import React from 'react';

const LoadingSpinner = ({ label = 'Loading Triveni Platform data...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-medium text-sm text-slate-100">{label}</p>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center text-slate-500">
      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
