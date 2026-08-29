import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  return (
    <div className="py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        The Triveni portal page you requested does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          Return to Home Page
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
