import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Rocket, PlusCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';

const CreateProject = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const problemIdParam = searchParams.get('problemId');

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    problemId: problemIdParam || '',
    title: 'Smart Water Monitoring System (Dumka)',
    description: 'An IoT-enabled solar powered water level monitoring and automated distribution solution.',
    facultyName: 'Dr. Raj Sharma',
    facultyEmail: 'faculty@demo.com',
    facultyDept: 'Computer Science & Engineering',
    expectedOutcome: 'IoT-based water-level monitoring and community water distribution management.',
    students: [
      { name: 'Rahul Kumar', email: 'rahul@student.demo', department: 'Computer Science', role: 'IoT Lead' },
      { name: 'Aman Singh', email: 'aman@student.demo', department: 'Electronics', role: 'Hardware Dev' },
      { name: 'Priya Verma', email: 'priya@student.demo', department: 'Civil Engineering', role: 'Field Researcher' }
    ]
  });

  useEffect(() => {
    fetchAvailableProblems();
  }, []);

  const fetchAvailableProblems = async () => {
    try {
      const res = await api.get('/problems');
      setProblems(res.data || []);
      if (!formData.problemId && res.data.length > 0) {
        setFormData(prev => ({ ...prev, problemId: res.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (idx, field, val) => {
    const updated = [...formData.students];
    updated[idx][field] = val;
    setFormData({ ...formData, students: updated });
  };

  const addStudentRow = () => {
    setFormData({
      ...formData,
      students: [...formData.students, { name: '', email: '', department: 'CSE', role: 'Student Researcher' }]
    });
  };

  const removeStudentRow = (idx) => {
    setFormData({
      ...formData,
      students: formData.students.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.problemId) {
      alert('Please select an associated challenge.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        problemId: formData.problemId,
        title: formData.title,
        description: formData.description,
        facultyMentor: {
          name: formData.facultyName,
          email: formData.facultyEmail,
          department: formData.facultyDept
        },
        students: formData.students,
        expectedOutcome: formData.expectedOutcome
      };

      const res = await api.post('/projects', payload);
      navigate(`/projects/${res.data._id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600">
          <GraduationCap className="w-4 h-4" />
          <span>University Portal</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Create R&D Innovation Project</h1>
      </div>

      <Card padding="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Associated Challenge *</label>
            <select
              name="problemId"
              value={formData.problemId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900"
            >
              {problems.map((p) => (
                <option key={p._id} value={p._id}>
                  [{p.category}] {p.title} ({p.district})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Project Name *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Smart Water Monitoring System"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Project Scope & Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-800"
            />
          </div>

          {/* Faculty Mentor Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700">Faculty Mentor Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="facultyName"
                value={formData.facultyName}
                onChange={handleChange}
                placeholder="Faculty Name"
                className="px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              />
              <input
                type="email"
                name="facultyEmail"
                value={formData.facultyEmail}
                onChange={handleChange}
                placeholder="Faculty Email"
                className="px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              />
              <input
                type="text"
                name="facultyDept"
                value={formData.facultyDept}
                onChange={handleChange}
                placeholder="Department"
                className="px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Student Team Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase text-slate-700">Student Team Members</label>
              <button
                type="button"
                onClick={addStudentRow}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.students.map((st, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={st.name}
                    onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                    placeholder="Student Name"
                    className="w-1/3 px-3 py-1.5 text-xs rounded border border-slate-300"
                  />
                  <input
                    type="text"
                    value={st.department}
                    onChange={(e) => handleStudentChange(idx, 'department', e.target.value)}
                    placeholder="Department (e.g. CSE)"
                    className="w-1/4 px-3 py-1.5 text-xs rounded border border-slate-300"
                  />
                  <input
                    type="text"
                    value={st.role}
                    onChange={(e) => handleStudentChange(idx, 'role', e.target.value)}
                    placeholder="Role (e.g. Developer)"
                    className="w-1/3 px-3 py-1.5 text-xs rounded border border-slate-300"
                  />
                  {formData.students.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStudentRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Expected Outcome</label>
            <input
              type="text"
              name="expectedOutcome"
              value={formData.expectedOutcome}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            loading={loading}
            icon={Rocket}
            className="w-full py-2.5"
          >
            Spawn & Initialize Project
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateProject;
