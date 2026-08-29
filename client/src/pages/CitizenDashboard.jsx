import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, FileText, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import ProblemCard from '../components/ProblemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProblems();
  }, []);

  const fetchMyProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/problems');
      setProblems(res.data || []);
    } catch (err) {
      console.error('Error fetching citizen problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalSubmitted = problems.length;
  const activeProblems = problems.filter(p => ['Submitted', 'Under Review', 'Validated', 'Assigned', 'In Development', 'Testing'].includes(p.status)).length;
  const acceptedProblems = problems.filter(p => ['Assigned', 'In Development', 'Testing', 'Deployed', 'Resolved'].includes(p.status)).length;
  const deployedSolutions = problems.filter(p => ['Deployed', 'Resolved'].includes(p.status)).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <span>Grassroots Citizen Portal</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Citizen'}</h1>
          <p className="text-slate-400 text-xs mt-1">
            Transform your village & community challenges into real university-backed engineering solutions.
          </p>
        </div>
        <Link to="/citizen/submit-problem">
          <Button variant="accent" icon={PlusCircle} className="shrink-0 shadow-lg shadow-emerald-600/20">
            Report a Problem
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Submitted Problems" value={totalSubmitted} icon={FileText} color="blue" />
        <StatCard title="Active Problems" value={activeProblems} icon={Clock} color="amber" />
        <StatCard title="Problems Accepted" value={acceptedProblems} icon={Zap} color="purple" />
        <StatCard title="Solutions Deployed" value={deployedSolutions} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Recent Submissions List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Your Submitted Challenges</h2>
          <Link to="/citizen/my-problems" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading your reported problems..." />
        ) : problems.length === 0 ? (
          <EmptyState
            title="No problems submitted yet"
            description="Be the first in your community to report a societal issue and get university researchers working on it."
            actionLabel="+ Report First Problem"
            onAction={() => window.location.href = '/citizen/submit-problem'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.slice(0, 6).map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
