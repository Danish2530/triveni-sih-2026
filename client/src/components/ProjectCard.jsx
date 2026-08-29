import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import Card from './Card';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

const ProjectCard = ({ project }) => {
  const completedMilestones = (project.milestones || []).filter(m => m.status === 'Completed').length;
  const totalMilestones = (project.milestones || []).length;

  return (
    <Card hover={true} className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={project.status || 'Development'} />
          {project.problemId?.category && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {project.problemId.category}
            </span>
          )}
        </div>

        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-base mb-2 line-clamp-2">
          {project.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-3">
          <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">{project.universityId?.name || 'Academic Innovation Unit'}</span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        <div className="mb-4">
          <ProgressBar progress={project.progress || 0} label="Deployment Progress" size="sm" />
        </div>
      </div>

      <div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{completedMilestones}/{totalMilestones} Milestones</span>
          </div>

          {project.industryPartners && project.industryPartners.length > 0 && (
            <div className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              <Briefcase className="w-3 h-3 text-blue-600" />
              <span>{project.industryPartners.length} Partner{project.industryPartners.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <Link
          to={`/projects/${project._id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <span>Manage & View Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};

export default ProjectCard;
