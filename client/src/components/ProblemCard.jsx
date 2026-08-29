import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Sparkles, ArrowRight } from 'lucide-react';
import Card from './Card';
import StatusBadge from './StatusBadge';

const ProblemCard = ({ problem, matchScore, actionText = 'View Details', onAction }) => {
  const topMatch = matchScore || (problem.recommendedUniversities && problem.recommendedUniversities[0]?.matchScore);

  return (
    <Card hover={true} className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {problem.category}
            </span>
            <StatusBadge status={problem.status} />
          </div>
          {topMatch && (
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full shrink-0">
              <Sparkles className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              <span>{topMatch}% Match</span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 text-base mb-2">
          {problem.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {problem.description}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2 mb-4">
          <div className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{problem.district}{problem.location?.village ? `, ${problem.location.village}` : ''}</span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>~{problem.affectedPopulation || 500} people</span>
          </div>
        </div>

        {onAction ? (
          <button
            onClick={() => onAction(problem)}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            to={`/problems/${problem._id}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ProblemCard;
