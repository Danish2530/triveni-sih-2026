import React from 'react';
import { Link } from 'react-router-dom';
import {
  Waves,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  Sparkles,
  CheckCircle2,
  Target,
  FileSpreadsheet,
  Globe
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const LandingPage = () => {
  const stats = [
    { label: 'Challenges Reported', value: '2,481', icon: FileSpreadsheet, color: 'text-blue-600 bg-blue-50' },
    { label: 'Projects Started', value: '927', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { label: 'Solutions Deployed', value: '414', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Universities Enrolled', value: '36', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
    { label: 'Industry Partners', value: '72', icon: Briefcase, color: 'text-rose-600 bg-rose-50' }
  ];

  const workflowSteps = [
    { step: '01', title: 'Report', desc: 'Citizens submit real-world societal & infrastructure challenges.', icon: FileSpreadsheet },
    { step: '02', title: 'Analyze', desc: 'AI-assisted service categorizes, ranks priority & extracts skill tags.', icon: Sparkles },
    { step: '03', title: 'Match', desc: 'Challenges matched with university R&D departments based on expertise.', icon: Target },
    { step: '04', title: 'Collaborate', desc: 'Faculty mentors, student developers & industry partners build solutions.', icon: Users },
    { step: '05', title: 'Deploy', desc: 'Field-tested prototypes installed directly in affected communities.', icon: CheckCircle2 },
    { step: '06', title: 'Measure Impact', desc: 'Government monitors social outcomes & district impact metrics.', icon: Globe }
  ];

  const stakeholders = [
    {
      title: 'Citizens & Communities',
      role: 'Problem Identification',
      desc: 'Log pressing issues like drinking water shortage, crop disease, sanitation or energy outages directly with location mapping.',
      icon: Users,
      badge: 'Grassroots Level'
    },
    {
      title: 'Universities & Students',
      role: 'R&D & Engineering',
      desc: 'Faculty & engineering students adopt verified challenges as capstone projects, receiving university credits & research grants.',
      icon: GraduationCap,
      badge: 'Academic Innovation'
    },
    {
      title: 'Industry & Startups',
      role: 'Co-funding & Hardware',
      desc: 'Enterprise CSR wings & tech startups provide hardware sensors, mentorship, cloud credits & commercial scaling support.',
      icon: Briefcase,
      badge: 'CSR & Acceleration'
    },
    {
      title: 'Government Departments',
      role: 'Policy & Execution Audit',
      desc: 'District collectors & state administrators monitor deployment milestones, budget allocation & quantifiable impact.',
      icon: Building2,
      badge: 'Government Oversight'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 2026 Problem Statement 26043 Prototype</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            JAN-SAMADHAN <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              "From Community Problems to Real Solutions"
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            A unified state innovation platform connecting citizens with universities, students, researchers, startups, and industries to transform real societal challenges into field-deployed tech solutions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/citizen/submit-problem">
              <Button variant="accent" size="lg" icon={ArrowRight}>
                Report a Problem
              </Button>
            </Link>
            <Link to="/university/challenges">
              <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
                Explore Challenges
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-10 bg-slate-950 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Innovation Workflow</h2>
          <h3 className="text-3xl font-extrabold text-white">How Triveni Solves Societal Problems</h3>
          <p className="text-slate-400 text-sm mt-2">End-to-end transparent lifecycle from citizen report to government impact audit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-emerald-400 opacity-80">{step.step}</span>
                  <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Stakeholders Section */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Multi-Stakeholder Ecosystem</h2>
            <h3 className="text-3xl font-extrabold text-white">Empowering Everyone in Society</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stakeholders.map((sh, idx) => {
              const Icon = sh.icon;
              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-lg font-bold text-white">{sh.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {sh.badge}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-emerald-400 mb-2">{sh.role}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{sh.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 to-slate-900 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to test the interactive workflow?</h3>
          <p className="text-emerald-100 text-sm mb-8">Login with one-click demo credentials as Citizen, University, Industry, or Government.</p>
          <Link to="/login">
            <Button variant="accent" size="lg">
              Launch Demo Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
