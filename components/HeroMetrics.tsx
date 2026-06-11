import React from "react";

import { Metric } from "@/app/actions/extract";

interface HeroMetricsProps {
  metrics?: Metric[];

  isLoading?: boolean;
}

const HeroMetrics: React.FC<HeroMetricsProps> = ({ metrics, isLoading }) => {
  // If no metrics provided and not loading, we can use the default or just return null

  // But let's assume if it's called without props, it might be in a preview state before extraction

  const displayMetrics = metrics && metrics.length > 0 ? metrics : [];

  const getIcon = (type: string) => {
    switch (type) {
      case "emerald":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );

      case "blue":
        return (
          <svg
            xmlns="http://www.w3.org/2050/svg"
            className="h-7 w-7 text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );

      case "purple":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-emerald-350"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case "emerald":
        return {
          trend: "text-emerald-400 bg-emerald-400/10",
          accent: "group-hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)]",
        };

      case "blue":
        return {
          trend: "text-teal-400 bg-teal-400/10",
          accent: "group-hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.15)]",
        };

      case "purple":
        return {
          trend: "text-emerald-300 bg-emerald-300/10",
          accent: "group-hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)]",
        };

      default:
        return { trend: "text-slate-400 bg-slate-400/10", accent: "" };
    }
  };

  return (
    <section className="bg-[#081510] py-16 px-6 sm:px-8 lg:px-12 w-full font-sans antialiased overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}

        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Your Highlights.
            </h2>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-light">
              Driving exponential value through strategic AI integration,
              operational excellence, and architectural simplification.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {isLoading ? (
            // Shimmer Loading Skeletons

            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="relative bg-[#0e2018] backdrop-blur-sm rounded-3xl p-8 overflow-hidden h-[320px]"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />

                <div className="flex items-center justify-between mb-12">
                  <div className="h-14 w-14 bg-[#06100c] rounded-2xl animate-pulse"></div>
                </div>

                <div className="mt-auto absolute bottom-8 left-8 right-8">
                  <div className="h-16 w-3/4 bg-slate-800 rounded-xl mb-4 animate-pulse"></div>

                  <div className="h-6 w-full bg-slate-800 rounded-lg mb-3 animate-pulse"></div>

                  <div className="h-4 w-5/6 bg-slate-800/50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))
          ) : displayMetrics.length > 0 ? (
            // Actual Metrics Data

            displayMetrics.map((metric, idx) => {
              const colors = getColors(metric.iconType);

              return (
                <div
                  key={idx}
                  className={`group relative bg-[#0e2018] backdrop-blur-sm rounded-3xl hover:bg-[#122b20] p-8 transition-all duration-500 h-[320px] flex flex-col ${colors.accent}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className="p-3.5 bg-[#06100c]/85 rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        {getIcon(metric.iconType)}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-3 drop-shadow-sm">
                        {metric.value}
                      </div>

                      <h3 className="text-xl font-bold text-slate-200 mb-3 tracking-tight">
                        {metric.label}
                      </h3>

                      <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback for when not loading but no metrics available

            <div className="col-span-3 text-center py-12 text-slate-400">
              Upload your resume to see your impact metrics.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroMetrics;
