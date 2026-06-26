import React from "react";

import { Role } from "@/app/actions/extract";

interface JobDiscoveryFeedProps {
  roles?: Role[];
  isLoading?: boolean;
}

const getSourceBadgeStyle = (source?: string) => {
  switch (source) {
    case "LinkedIn":
      return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
    case "Ladders":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Wellfound":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Built In":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "We Work Remotely":
      return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  }
};

const getLevelBadgeStyle = (levelLabel?: string) => {
  if (!levelLabel) return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  const label = levelLabel.toLowerCase();
  if (label.includes("executive") || label.includes("vp")) {
    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  }
  if (label.includes("management") || label.includes("director")) {
    return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
  }
  if (label.includes("senior") || label.includes("lead")) {
    return "bg-sky-500/10 text-sky-400 border border-sky-500/20";
  }
  if (label.includes("professional") || label.includes("mid")) {
    return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
  }
  return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
};

const JobDiscoveryFeed: React.FC<JobDiscoveryFeedProps> = ({
  roles,
  isLoading,
}) => {
  const displayRoles = roles && roles.length > 0 ? roles : [];

  return (
    <section className="w-full max-w-5xl mx-auto pb-16 px-6 sm:px-8">
      {/* Results Feed Header */}

      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          Matched Roles
        </h3>

        <div className="h-px flex-grow bg-gradient-to-r from-slate-800 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          // Shimmer Loading Skeletons
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`skeleton-role-${idx}`}
              className="relative bg-[#0e2018] backdrop-blur-md rounded-2xl p-6 h-[200px] overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />

              <div className="flex justify-between items-start mb-4">
                <div className="w-2/3">
                  <div className="h-4 w-24 bg-neutral-900 rounded-md mb-2 animate-pulse"></div>

                  <div className="h-6 w-full bg-neutral-900 rounded-md animate-pulse"></div>
                </div>

                <div className="h-8 w-16 bg-slate-800 rounded-full animate-pulse"></div>
              </div>

              <div className="h-4 w-1/3 bg-slate-800 rounded-md mb-4 animate-pulse"></div>

              <div className="h-10 w-full bg-slate-800/50 rounded-md animate-pulse"></div>
            </div>
          ))
        ) : displayRoles.length > 0 ? (
          displayRoles.map((role) => (
            <div
              key={role.id}
              className="group relative bg-[#0e2018] backdrop-blur-md rounded-2xl hover:bg-[#122b20] hover:shadow-[0_4px_25px_rgba(16,185,129,0.15)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/20 flex flex-col justify-between"
            >
              {/* Glow effect for high matches */}
              {role.matchScore > 90 && (
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Card Header: Company, Title, Match, and Source/Level Badges */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-sm font-semibold text-emerald-450 mb-1 tracking-wide uppercase font-sans">
                      {role.company}
                    </div>

                    <h4 className="text-xl font-bold text-slate-100 leading-snug">
                      {role.title}
                    </h4>

                    {/* Location Tag */}
                    {role.location && (
                      <div className="text-xs text-slate-400 mt-1.5 flex items-center gap-1 select-none font-sans">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {role.location}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                    {/* Match Percentage */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 rounded-full shadow-inner select-none font-sans">
                      <span className="text-sm font-bold text-white">
                        {role.matchScore}%
                      </span>

                      <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider">Match</span>
                    </div>

                    {/* Source Board Badge */}
                    {role.source && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider select-none font-sans ${getSourceBadgeStyle(role.source)}`}>
                        {role.source}
                      </span>
                    )}

                    {/* Career Level Badge */}
                    {role.levelLabel && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider select-none font-sans ${getLevelBadgeStyle(role.levelLabel)}`}>
                        {role.levelLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* High Value Badge */}
                {role.matchScore > 90 && (
                  <div className="mb-4 inline-flex items-center gap-1.5 select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-sans">
                      High Value Match
                    </span>
                  </div>
                )}

                {/* Job Description / Snippet */}
                <p className="text-sm text-slate-400 leading-relaxed mt-2 mb-6">
                  {role.description}
                </p>

                {/* Card Footer: Post Date and Active Apply Link */}
                <div className="mt-auto pt-4 border-t border-emerald-950/20 flex justify-between items-center relative z-20 font-sans">
                  <span className="text-xs text-slate-500 select-none">
                    {role.postDate || 'Open Position'}
                  </span>

                  {role.link ? (
                    <a
                      href={role.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-440 hover:text-emerald-350 hover:underline transition-colors cursor-pointer"
                    >
                      Apply on {role.source || 'Board'}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-emerald-450 select-none">
                      Match Insights &rarr;
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-400">
            No matching roles found yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default JobDiscoveryFeed;
