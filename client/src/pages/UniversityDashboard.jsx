import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, FileText, Zap, Users, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import ProblemCard from '../components/ProblemCard';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

const UniversityDashboard = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversityData();
  }, []);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      const [probRes, projRes] = await Promise.all([
        api.get('/problems'),
        api.get('/projects')
      ]);
      setChallenges(probRes.data || []);
      setProjects(projRes.data || []);
    } catch (err) {
      console.error('Error loading university portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const assignedCount = challenges.filter(c => c.status === 'Assigned').length;
  const activeProjectsCount = projects.length;
  const totalStudents = projects.reduce((acc, p) => acc + (p.students?.length || 0), 0) || 12;
  const totalIndustryPartners = projects.reduce((acc, p) => acc + (p.industryPartners?.length || 0), 0) || 3;

  return (
    <div className="space-y-6">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic R&D Incubation Portal</span>
          </div>
          <h1 className="text-2xl font-bold">{user?.organization || 'University Innovation Cell'}</h1>
          <p className="text-slate-400 text-xs mt-1">
            Adopt citizen challenges, assign student research teams, and partner with industry.
          </p>
        </div>

        <Link to="/university/challenges">
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer">
            Browse Matched Challenges
          </button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Assigned Challenges" value={assignedCount} icon={FileText} color="blue" />
        <StatCard title="Active Projects" value={activeProjectsCount} icon={Zap} color="emerald" />
        <StatCard title="Students Involved" value={totalStudents} icon={Users} color="purple" />
        <StatCard title="Industry Partners" value={totalIndustryPartners} icon={Briefcase} color="amber" />
        <StatCard title="Solutions Deployed" value="4" icon={CheckCircle2} color="emerald" />
      </div>

      {/* Active Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">University R&D Projects</h2>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading university projects..." />
        ) : projects.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            No projects created yet. Accept a challenge to spawn your first R&D project.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Challenges Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recommended Citizen Challenges (AI Matched)</h2>
          <Link to="/university/challenges" className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.slice(0, 3).map((ch) => (
            <ProblemCard key={ch._id} problem={ch} matchScore={92} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
