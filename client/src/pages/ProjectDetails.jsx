import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Clock,
  PlusCircle,
  Users,
  Check,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKanbanTask, setNewKanbanTask] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projRes, partRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/industry/partnerships?projectId=${id}`)
      ]);
      setProject(projRes.data);
      setPartnerships(partRes.data || []);
    } catch (err) {
      console.error('Error loading project details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMilestone = async (milestoneId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    try {
      await api.put(`/projects/${id}/milestones/${milestoneId}`, { status: nextStatus });
      fetchProjectData();
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  };

  const handlePartnershipResponse = async (partnershipId, status) => {
    try {
      await api.put(`/industry/partnerships/${partnershipId}/status`, { status });
      fetchProjectData();
    } catch (err) {
      console.error('Failed to update partnership status:', err);
    }
  };

  const handleAddKanbanItem = async (columnKey) => {
    if (!newKanbanTask.trim()) return;
    const currentKanban = project.kanban || { todo: [], inProgress: [], testing: [], completed: [] };
    const updatedCol = [...(currentKanban[columnKey] || []), newKanbanTask];
    const updatedKanban = { ...currentKanban, [columnKey]: updatedCol };

    try {
      await api.put(`/projects/${id}/kanban`, { kanban: updatedKanban });
      setNewKanbanTask('');
      fetchProjectData();
    } catch (err) {
      console.error('Error updating kanban:', err);
    }
  };

  if (loading) return <LoadingSpinner label="Loading R&D Project workspace..." />;
  if (!project) return <div className="text-center py-12">Project workspace not found.</div>;

  const kanban = project.kanban || {
    todo: ['Sensor Calibration'],
    inProgress: ['Dashboard Integration'],
    testing: ['Field Testing'],
    completed: ['Problem Survey']
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <StatusBadge status={project.status} />
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              {project.problemId?.category || 'R&D Solution'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{project.title}</h1>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>{project.universityId?.name || 'Academic Institution'}</span>
          </p>
        </div>

        <div className="w-full md:w-64">
          <ProgressBar progress={project.progress || 0} label="Project Progress" color="emerald" size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Milestones & Kanban Board */}
        <div className="lg:col-span-2 space-y-6">
          {/* Milestone Progress Checklist */}
          <Card padding="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Project Milestones</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {project.milestones?.filter(m => m.status === 'Completed').length || 0}/{project.milestones?.length || 0} Complete
              </span>
            </div>

            <div className="space-y-3">
              {(project.milestones || []).map((m) => (
                <div
                  key={m._id}
                  onClick={() => user?.role === 'university' && handleToggleMilestone(m._id, m.status)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    user?.role === 'university' ? 'cursor-pointer hover:border-emerald-400' : ''
                  } ${
                    m.status === 'Completed'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : m.status === 'In Progress'
                      ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      m.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {m.status === 'Completed' ? '✓' : '○'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{m.title}</h4>
                      {m.description && <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>}
                    </div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* Interactive Kanban Board */}
          <Card padding="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>R&D Kanban Task Board</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TODO Column */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between font-bold text-xs uppercase text-slate-600 mb-2">
                  <span>TODO</span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{kanban.todo?.length || 0}</span>
                </div>
                <div className="space-y-2 mb-3">
                  {(kanban.todo || []).map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 shadow-2xs">
                      {t}
                    </div>
                  ))}
                </div>
                {user?.role === 'university' && (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Add task..."
                      value={newKanbanTask}
                      onChange={(e) => setNewKanbanTask(e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded bg-white"
                    />
                    <button
                      onClick={() => handleAddKanbanItem('todo')}
                      className="px-2 py-1 bg-slate-900 text-white rounded text-xs"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* IN PROGRESS Column */}
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between font-bold text-xs uppercase text-amber-700 mb-2">
                  <span>IN PROGRESS</span>
                  <span className="bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">{kanban.inProgress?.length || 0}</span>
                </div>
                <div className="space-y-2">
                  {(kanban.inProgress || []).map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-amber-200 rounded-lg text-xs font-semibold text-amber-900 shadow-2xs">
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* TESTING Column */}
              <div className="bg-cyan-50/50 p-3.5 rounded-xl border border-cyan-200">
                <div className="flex items-center justify-between font-bold text-xs uppercase text-cyan-700 mb-2">
                  <span>TESTING</span>
                  <span className="bg-cyan-200 text-cyan-800 px-1.5 py-0.5 rounded">{kanban.testing?.length || 0}</span>
                </div>
                <div className="space-y-2">
                  {(kanban.testing || []).map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-cyan-200 rounded-lg text-xs font-semibold text-cyan-900 shadow-2xs">
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPLETED Column */}
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between font-bold text-xs uppercase text-emerald-700 mb-2">
                  <span>COMPLETED</span>
                  <span className="bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">{kanban.completed?.length || 0}</span>
                </div>
                <div className="space-y-2">
                  {(kanban.completed || []).map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-emerald-200 rounded-lg text-xs font-medium text-emerald-900 shadow-2xs line-through opacity-80">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Faculty & Industry Partnerships */}
        <div className="space-y-6">
          {/* Faculty & Student Team Card */}
          <Card padding="p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Academic R&D Team</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Faculty Mentor</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">{project.facultyMentor?.name || 'Dr. Raj Sharma'}</h4>
                <p className="text-slate-500 text-[11px]">{project.facultyMentor?.department}</p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Assigned Student Researchers</span>
                <div className="space-y-1.5">
                  {(project.students || []).map((st, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white text-xs">
                      <span className="font-semibold text-slate-800">{st.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{st.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Industry Partnerships Panel */}
          <Card padding="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Industry Partner Offers</h3>
            </div>

            {partnerships.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No pending industry partner requests yet.</p>
            ) : (
              <div className="space-y-3">
                {partnerships.map((p) => (
                  <div key={p._id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">{p.industryName}</h4>
                      <StatusBadge status={p.status} />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{p.message}</p>

                    <div className="flex flex-wrap gap-1">
                      {p.contributions.map((c, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                          + {c}
                        </span>
                      ))}
                    </div>

                    {user?.role === 'university' && p.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handlePartnershipResponse(p._id, 'Accepted')}
                          className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept Partner</span>
                        </button>
                        <button
                          onClick={() => handlePartnershipResponse(p._id, 'Rejected')}
                          className="py-1 px-2 border border-slate-300 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold rounded cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
