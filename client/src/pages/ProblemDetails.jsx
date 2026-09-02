import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Users,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ImpactProjectionChart from '../components/ImpactProjectionChart';

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchProblemDetails();
  }, [id]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/problems/${id}`);
      setProblem(res.data);
    } catch (err) {
      console.error('Error fetching problem details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChallenge = async () => {
    setAccepting(true);
    try {
      await api.post(`/universities/challenges/${id}/accept`);
      fetchProblemDetails();
      navigate(`/university/create-project?problemId=${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept challenge');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Fetching problem details & AI match scores..." />;
  if (!problem) return <div className="text-center py-12">Problem challenge not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenges</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={problem.status} />
          <StatusBadge status={problem.urgency} type="urgency" />
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {problem.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">#{problem._id.slice(-6).toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 leading-snug">{problem.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{problem.district}{problem.location?.village ? `, ${problem.location.village}` : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span>~{problem.affectedPopulation} affected citizens</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Logged {new Date(problem.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {user?.role === 'university' && problem.status === 'Submitted' && (
          <Button
            variant="accent"
            size="lg"
            loading={accepting}
            onClick={handleAcceptChallenge}
            icon={GraduationCap}
            className="shrink-0 shadow-lg shadow-emerald-600/20"
          >
            Accept Challenge & Create Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Description & Specs */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Problem Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{problem.description}</p>

            {problem.images && problem.images.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Site Photo Documentation ({problem.images.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {problem.images.map((imgUrl, idx) => (
                    <a
                      key={idx}
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={imgUrl}
                        alt={`Site photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>


                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Assigned University Banner if active */}
          {problem.assignedUniversity && (
            <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Active University Partner</span>
                  <h4 className="font-bold text-base text-white">{problem.assignedUniversity.name}</h4>
                  <p className="text-xs text-emerald-200">{problem.assignedUniversity.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis & Recommended Universities */}
        <div className="space-y-6">
          {/* AI Analysis Widget */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800 shadow-xl space-y-3.5">
            <div className="flex items-center gap-2 pb-3 border-b border-indigo-800">
              <Sparkles className="w-5 h-5 text-indigo-400 fill-indigo-400" />
              <h3 className="font-bold text-sm text-white">AI ANALYSIS METRICS</h3>
            </div>

            {problem.aiAnalysis ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-indigo-300 font-bold block">Assigned Subcategory</span>
                  <p className="font-bold text-white text-sm">{problem.aiAnalysis.subcategory || problem.category}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-indigo-300 font-bold block mb-1">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {(problem.aiAnalysis.skills || ['IoT', 'Civil Engineering']).map((skill, idx) => (
                      <span key={idx} className="bg-indigo-900/80 text-indigo-200 border border-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-800 flex justify-between">
                  <span className="text-indigo-300">Estimated Impact:</span>
                  <span className="font-bold text-white">{problem.aiAnalysis.estimatedImpact || `${problem.affectedPopulation} citizens`}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-indigo-300">Standard rule-based AI classification complete.</p>
            )}
          </div>

          {/* Impact Projection */}
          <ImpactProjectionChart impact={problem.impact} />

          {/* Recommended Universities List */}
          <Card padding="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Recommended Universities</h3>
            </div>

            <div className="space-y-3">
              {(problem.recommendedUniversities || []).map((uni, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{uni.name}</h4>
                    <span className="text-[10px] text-slate-500">R&D Fit Rating</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      {uni.matchScore}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div >
    </div >
  );
};

export default ProblemDetails;