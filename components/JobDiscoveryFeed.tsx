import React from "react";

import { Role } from "@/app/actions/extract";

interface JobDiscoveryFeedProps {
  roles?: Role[];

  isLoading?: boolean;
}

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
              className="group relative bg-[#0e2018] backdrop-blur-md rounded-2xl hover:bg-[#122b20] hover:shadow-[0_4px_25px_rgba(16,185,129,0.15)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/20 flex flex-col"
            >
              {/* Glow effect for high matches */}

              {role.matchScore > 90 && (
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
              )}

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-semibold text-emerald-450 mb-1 tracking-wide uppercase">
                      {role.company}
                    </div>

                    <h4 className="text-xl font-bold text-slate-100 leading-snug">
                      {role.title}
                    </h4>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 rounded-full  shadow-inner">
                      <span className="text-sm font-bold text-white">
                        {role.matchScore}%
                      </span>

                      <span className="text-xs text-slate-400">Match</span>
                    </div>
                  </div>
                </div>

                {role.matchScore > 90 && (
                  <div className="mb-4 inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                      High Value Match
                    </span>
                  </div>
                )}

                <p className="text-sm text-slate-400 leading-relaxed mt-auto">
                  {role.description}
                </p>

                <div className="mt-6 pt-4 border-t border-emerald-950/20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium text-slate-300">
                    Review Fit Analysis
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
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
