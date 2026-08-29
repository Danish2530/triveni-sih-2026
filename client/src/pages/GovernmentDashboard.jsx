import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  Globe,
  DollarSign,
  Clock,
  Layers,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const GovernmentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  const fetchGovernmentData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/government');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching government dashboard analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Compiling State Innovation Analytics & Recharts Data..." />;
  if (!data) return <div className="text-center py-12">Failed to load government analytics.</div>;

  const { summaryStats, problemsByDomain, problemsByDistrict, projectStatusDistribution, monthlySubmissions, socialImpact } = data;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  return (
    <div className="space-y-6">
      {/* State Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>State Innovation Oversight Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Jharkhand Societal Innovation Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring of community challenges, university R&D progress, and societal outcome impact.
          </p>
        </div>
      </div>

      {/* Top 6 Executive Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <StatCard title="Total Challenges" value={summaryStats.totalProblems} icon={Layers} color="blue" />
        <StatCard title="Active Projects" value={summaryStats.activeProjects} icon={TrendingUp} color="amber" />
        <StatCard title="Deployed Solutions" value={summaryStats.deployedSolutions} icon={CheckCircle2} color="emerald" />
        <StatCard title="Universities" value={summaryStats.participatingUniversities} icon={Building2} color="purple" />
        <StatCard title="Industry Partners" value={summaryStats.industryPartners} icon={Award} color="rose" />
        <StatCard title="People Impacted" value={summaryStats.peopleImpacted.toLocaleString()} icon={Users} color="emerald" />
      </div>

      {/* Recharts Row 1: Problems by Domain & District Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problems by Domain Bar Chart */}
        <Card padding="p-6">
          <h3 className="font-bold text-slate-900 text-base mb-1">Problems by Domain Category</h3>
          <p className="text-xs text-slate-500 mb-6">Distribution across key societal sectors in Jharkhand.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={problemsByDomain} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="domain" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Problems by District Bar Chart */}
        <Card padding="p-6">
          <h3 className="font-bold text-slate-900 text-base mb-1">Problems by District</h3>
          <p className="text-xs text-slate-500 mb-6">Geographic concentration of reported challenges.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={problemsByDistrict} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="district" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recharts Row 2: Status Pipeline & Monthly Submissions Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Pipeline Pie Chart */}
        <Card padding="p-6">
          <h3 className="font-bold text-slate-900 text-base mb-1">Challenge Status Lifecycle</h3>
          <p className="text-xs text-slate-500 mb-4">Current stage distribution of reported issues.</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                >
                  {projectStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Submissions Line Chart */}
        <Card padding="p-6">
          <h3 className="font-bold text-slate-900 text-base mb-1">Monthly Submission & Resolution Trend</h3>
          <p className="text-xs text-slate-500 mb-6">Growth of challenge reporting vs deployment velocity.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySubmissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Submitted" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Social Impact Section (Section 15 of Prompt) */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-2xl border border-emerald-800 text-white shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-emerald-800 pb-3">
          <Award className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="text-lg font-black text-white">QUANTIFIABLE SOCIAL IMPACT METRICS</h2>
            <p className="text-xs text-emerald-300">Monitored outcomes of field-deployed solutions across Jharkhand blocks.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-800">
            <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">{socialImpact.peopleBenefited.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-200">People Benefited</div>
          </div>

          <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-800">
            <MapPin className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">{socialImpact.villagesCovered}</div>
            <div className="text-[11px] text-emerald-200">Villages Covered</div>
          </div>

          <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">{socialImpact.solutionsDeployed}</div>
            <div className="text-[11px] text-emerald-200">Solutions Deployed</div>
          </div>

          <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-800">
            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">₹{socialImpact.estimatedAnnualSavingsLakhs} Lakhs</div>
            <div className="text-[11px] text-emerald-200">Est. Annual Savings</div>
          </div>

          <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-800">
            <Clock className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-black text-white">{socialImpact.avgResolutionDays} Days</div>
            <div className="text-[11px] text-emerald-200">Avg Resolution Time</div>
          </div>
        </div>

        {/* Featured Project Spotlight */}
        <div className="p-4 bg-slate-900/90 rounded-xl border border-emerald-800/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Featured Case Study
            </span>
            <h4 className="font-bold text-white text-sm mt-1">Smart Water Monitoring System (Dumka)</h4>
            <p className="text-slate-300">BIT Mesra R&D Project in collaboration with Tata Steel CSR.</p>
          </div>
          <div className="flex gap-3 text-right">
            <div className="bg-emerald-950 px-3 py-1.5 rounded border border-emerald-800">
              <span className="text-[10px] text-emerald-400 block">Water Availability</span>
              <span className="font-bold text-white text-sm">+38%</span>
            </div>
            <div className="bg-emerald-950 px-3 py-1.5 rounded border border-emerald-800">
              <span className="text-[10px] text-emerald-400 block">Waiting Time</span>
              <span className="font-bold text-white text-sm">-42%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
