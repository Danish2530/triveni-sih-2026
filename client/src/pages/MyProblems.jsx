import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, PlusCircle } from 'lucide-react';
import api from '../services/api';
import ProblemCard from '../components/ProblemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const MyProblems = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchProblems();
  }, [statusFilter]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/problems?mine=true');
      setProblems(res.data || []);
    } catch (err) {
      console.error('Error fetching my problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Societal Challenges Database</h1>
          <p className="text-xs text-slate-500 mt-0.5">Explore community-reported problems seeking university research collaboration.</p>
        </div>
        <Link to="/citizen/submit-problem">
          <Button variant="accent" icon={PlusCircle}>
            Report Challenge
          </Button>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems by keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned to University</option>
            <option value="In Development">In Development</option>
            <option value="Testing">Testing Phase</option>
            <option value="Deployed">Deployed / Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading challenges..." />
      ) : filteredProblems.length === 0 ? (
        <EmptyState
          title="No challenges found"
          description="No challenges match your active search or status filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((p) => (
            <ProblemCard key={p._id} problem={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProblems;
