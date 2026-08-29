import React from 'react';

const Card = ({ children, className = '', hover = true, padding = 'p-6' }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${
        hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''
      } ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
