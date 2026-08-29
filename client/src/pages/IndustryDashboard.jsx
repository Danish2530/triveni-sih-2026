import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building2, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Button from '../components/Button';

const IndustryDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Partnership Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [contributions, setContributions] = useState(['Hardware', 'Mentorship']);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchIndustryProjects();
  }, []);

  const fetchIndustryProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/industry/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error('Error fetching industry projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (option) => {
    if (contributions.includes(option)) {
      setContributions(contributions.filter(c => c !== option));
    } else {
      setContributions([...contributions, option]);
    }
  };

  const handleSendPartnership = async () => {
    if (!selectedProject) return;
    setSubmitting(true);
    try {
      await api.post(`/projects/${selectedProject._id}/partner`, {
        contributions,
        message
      });
      alert(`Partnership request sent successfully to ${selectedProject.universityId?.name || 'University'}!`);
      setSelectedProject(null);
      fetchIndustryProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit partnership request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Enterprise CSR & Startup Co-Creation</span>
          </div>
          <h1 className="text-2xl font-bold">{user?.organization || 'Industry Collaboration Portal'}</h1>
          <p className="text-slate-400 text-xs mt-1">
            Accelerate university R&D projects through hardware sponsorship, mentorship, and commercial deployment.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Available Projects" value={projects.length} icon={Building2} color="blue" />
        <StatCard title="Active CSR Partners" value="72" icon={Briefcase} color="purple" />
        <StatCard title="Hardware Grants" value="₹28.4 Lakhs" icon={Zap} color="amber" />
        <StatCard title="Deployments Scaled" value="18" icon={CheckCircle2} color="emerald" />
      </div>

      {/* Available Projects List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Projects Seeking Industry Collaboration</h2>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading industry collaboration projects..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <div key={proj._id} className="flex flex-col justify-between h-full bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {proj.problemId?.category || 'Tech Solution'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{proj.problemId?.district}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{proj.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{proj.universityId?.name}</p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">{proj.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">Support Needed:</span>
                    <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium">Hardware</span>
                    <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium">Mentorship</span>
                    <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-medium">Funding</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedProject(proj)}
                  >
                    Partner With Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Partnership Proposal Modal */}
      {selectedProject && (
        <Modal
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={`Partner With: ${selectedProject.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900">{selectedProject.title}</p>
              <p className="text-slate-500">{selectedProject.universityId?.name} | {selectedProject.problemId?.district}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-2">How can your organization contribute?</label>
              <div className="grid grid-cols-2 gap-2">
                {['Funding', 'Mentorship', 'Hardware', 'Software', 'Testing', 'Deployment'].map((option) => (
                  <label key={option} className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contributions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Partnership Proposal Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your organization's sponsorship offer, mentorship availability or technical components..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>Cancel</Button>
              <Button variant="accent" loading={submitting} onClick={handleSendPartnership}>
                Send Partnership Request
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IndustryDashboard;
