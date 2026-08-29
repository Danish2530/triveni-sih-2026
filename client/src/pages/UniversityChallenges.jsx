import React, { useState, useEffect } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import api from '../services/api';
import ProblemCard from '../components/ProblemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const UniversityChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/problems');
      setChallenges(res.data || []);
    } catch (err) {
      console.error('Error fetching university challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = challenges.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-emerald-600">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Matching Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Explore Matched Societal Challenges</h1>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search challenges by title or category..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Matching university capabilities with challenges..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ch, idx) => (
            <ProblemCard key={ch._id} problem={ch} matchScore={92 - idx * 4} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversityChallenges;
