"use client";

import React, { useState, useRef } from "react";

import { uploadResume } from "@/app/actions/upload";

interface ResumeUploadProps {
  onUploadComplete: (metrics?: any[], roles?: any[]) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    setIsUploading(true);

    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 5));
    }, 100);

    const formData = new FormData();

    formData.append("resume", file);

    try {
      const result = await uploadResume(formData);

      if (result.success) {
        clearInterval(interval);

        setProgress(100);

        setTimeout(() => {
          setUploadSuccess(true);

          onUploadComplete(result.metrics, result.roles);
        }, 500);
      } else {
        clearInterval(interval);

        console.error(result.error);

        setIsUploading(false);
      }
    } catch (err) {
      clearInterval(interval);

      console.error(err);

      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <section className="w-full max-w-4xl mx-auto py-6 px-6 sm:px-8">
        <div className="flex items-center justify-between p-6 border border-emerald-500/30 rounded-2xl bg-emerald-500/10 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Profile Initialized
              </h3>

              <p className="text-sm text-slate-400">
                Career impact metrics successfully extracted.
              </p>
            </div>
          </div>

          <div className="hidden sm:block px-4 py-1.5 bg-[#0e2018] rounded-full border border-emerald-900/20">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Ready for Discovery
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-3xl mx-auto py-8 px-6 sm:px-8">
      {!isUploading ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed rounded-3xl transition-all duration-300 bg-[#0e2018]/50 backdrop-blur-sm ${
            isDragging
              ? "border-emerald-500 bg-emerald-950/10"
              : "border-emerald-900/20 hover:border-slate-500 hover:bg-slate-800/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />

          <div className="p-4 bg-[#06100c]/85 rounded-2xl border border-emerald-900/20/50 shadow-inner mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-slate-400 group-hover:text-emerald-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-slate-200 mb-2 tracking-tight">
            Upload your resume
          </h3>

          <p className="text-sm text-slate-400 text-center max-w-sm leading-relaxed">
            Drag & drop your resume here, or{" "}
            <span className="text-emerald-400 font-medium">
              click to browse
            </span>
            . We support PDF and Word documents.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 px-8  rounded-3xl bg-[#0e2018]/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-950/20 border border-emerald-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-emerald-400 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-100 tracking-tight">
                Securely sending your experience to the cloud...
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Extracting your key wins & metrics
              </p>
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="h-2 w-full bg-[#06100c]/85 rounded-full overflow-hidden shadow-inner ">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-100 ease-linear rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>

            <div className="flex justify-between mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Processing</span>

              <span className="text-emerald-400">{progress}%</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResumeUpload;
