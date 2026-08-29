import React from 'react';

const ProgressBar = ({ progress = 0, label = '', showPercentage = true, size = 'md', color = 'emerald' }) => {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-600',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-600'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1.5">
          <span>{label}</span>
          {showPercentage && <span className="font-semibold">{clampedProgress}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size] || heightClasses.md}`}>
        <div
          className={`${colorClasses[color] || colorClasses.emerald} ${heightClasses[size] || heightClasses.md} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
