import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertTriangle, CheckCircle, FilePlus, MapPin, UploadCloud, Users, ArrowRight, X } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';

const SubmitProblem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water Management',
    district: 'Dumka',
    village: 'Kathikund Village',
    latitude: 24.2676,
    longitude: 87.2479,
    urgency: 'High',
    affectedPopulation: 1200,
  });

  const [imageFiles, setImageFiles] = useState([]);

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const domains = [
    'Water Management',
    'Agriculture',
    'Healthcare',
    'Education',
    'Sanitation',
    'Environment',
    'Energy',
    'Urban Development',
    'Accessibility',
    'Public Administration',
    'Rural Livelihoods',
    'Other'
  ];

  const districts = [
    'Dumka',
    'Ranchi',
    'Dhanbad',
    'Bokaro',
    'East Singhbhum',
    'West Singhbhum',
    'Hazaribagh',
    'Giridih',
    'Deoghar',
    'Palamu',
    'Latehar',
    'Simdega'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + imageFiles.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }
    setImageFiles((prev) => [...prev, ...selected]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAiAnalyze = async () => {
    if (!formData.title || !formData.description) {
      alert('Please provide a Title and Description before running AI analysis.');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await api.post('/problems/analyze', {
        title: formData.title,
        description: formData.description,
        category: formData.category
      });

      setAiResult(res.data.analysis);
      if (res.data.duplicateCheck && res.data.duplicateCheck.isDuplicate) {
        setDuplicateWarning(res.data.duplicateCheck);
        setShowDuplicateModal(true);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmitProblem = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Title and Description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('district', formData.district);
      payload.append('village', formData.village);
      payload.append('latitude', formData.latitude);
      payload.append('longitude', formData.longitude);
      payload.append('urgency', formData.urgency);
      payload.append('affectedPopulation', formData.affectedPopulation);

      imageFiles.forEach((file) => {
        payload.append('images', file); // field name MUST match upload.array('images', 5)
      });

      const res = await api.post('/problems', payload);
      const newProblemId = res.data.problem._id;

      if (res.data.duplicateWarning) {
        setDuplicateWarning(res.data.duplicateWarning);
        setShowDuplicateModal(true);
      } else {
        navigate(`/problems/${newProblemId}`);
      }
    } catch (err) {
      console.error('Failed to submit problem:', err);
      alert('Error submitting problem. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Citizen Form</span>
          <h1 className="text-2xl font-extrabold text-slate-900">Report a Community Problem</h1>
          <p className="text-xs text-slate-500 mt-0.5">Submit real societal challenges for AI matching with university research teams.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-5">
          <Card hover={false} padding="p-6">
            <form onSubmit={handleSubmitProblem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Drinking water shortage in Dumka village"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue, affected residents, damaged infrastructure, and daily challenges..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Domain Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-emerald-500"
                  >
                    {domains.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-semibold focus:ring-emerald-500"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Village / City</label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Kathikund Village"
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-medium"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Urgency</option>
                    <option value="Critical">Critical Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Estimated Affected Citizens
                  </label>
                  <input
                    type="number"
                    name="affectedPopulation"
                    value={formData.affectedPopulation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Upload Mock UI */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Upload Site Photos (up to 5)
                </label>
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer block"
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-slate-600">Drag & drop photos or click to select files</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 10MB each</p>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  loading={analyzing}
                  onClick={handleAiAnalyze}
                  icon={Sparkles}
                  className="w-full sm:w-auto border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  Analyze Problem with AI
                </Button>

                <Button
                  type="submit"
                  variant="accent"
                  loading={submitting}
                  icon={FilePlus}
                  className="w-full sm:w-auto"
                >
                  Submit Challenge
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* AI Analysis Sidebar Widget */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/80">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Sparkles className="w-5 h-5 fill-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">AI ANALYSIS ENGINE</h3>
                <p className="text-[10px] text-indigo-300">Triveni Automated Classifier</p>
              </div>
            </div>

            {aiResult ? (
              <div className="space-y-3.5 text-xs animate-fade-in">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block">Category & Subcategory</span>
                  <p className="font-bold text-white text-sm">{aiResult.category}</p>
                  <p className="text-slate-300 text-[11px]">{aiResult.subcategory}</p>
                </div>

                <div className="flex items-center justify-between py-2 border-y border-indigo-800/80">
                  <span className="text-indigo-300 font-medium">Priority Rating</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${aiResult.priority === 'HIGH' || aiResult.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                    {aiResult.priority}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1">Suggested University Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {aiResult.skills.map((skill, idx) => (
                      <span key={idx} className="bg-indigo-950 text-indigo-200 border border-indigo-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block mb-1">Extracted Keywords</span>
                  <p className="text-slate-300 italic text-[11px]">{aiResult.keywords.join(', ')}</p>
                </div>

                <div className="pt-2 border-t border-indigo-800/80 flex items-center justify-between text-indigo-200">
                  <span>Estimated Impact:</span>
                  <span className="font-bold text-white">{aiResult.estimatedImpact}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-indigo-300 space-y-2">
                <p>Fill out the form title & description, then click "Analyze Problem with AI".</p>
                <p className="text-[10px] text-indigo-400/80">AI will automatically categorize, assign priority, and identify matching university department skills.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Duplicate Challenge Warning Modal */}
      {duplicateWarning && (
        <Modal
          isOpen={showDuplicateModal}
          onClose={() => setShowDuplicateModal(false)}
          title="⚠ Similar Challenge Found in Database"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Potential Duplicate Challenge ({duplicateWarning.similarityScore}% Match)</p>
                <p className="text-xs text-amber-800 mt-1">
                  We found an existing active challenge with high similarity in title & location:
                </p>
              </div>
            </div>

            {duplicateWarning.existingProblem && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{duplicateWarning.existingProblem.code}</span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Status: {duplicateWarning.existingProblem.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{duplicateWarning.existingProblem.title}</h4>
                <p className="text-xs text-slate-500">
                  Category: {duplicateWarning.existingProblem.category} | District: {duplicateWarning.existingProblem.district}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/problems/${duplicateWarning.existingProblem?.id}`)}
              >
                View Existing Challenge
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  setShowDuplicateModal(false);
                  handleSubmitProblem();
                }}
              >
                Submit Challenge Anyway
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubmitProblem;
