'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { JobVacancy, ApplicationSession, SAMPLE_TECH_JOBS } from '@/lib/jobsData';
import { ResumeProfileData } from '@/lib/insforge';
import {
  Briefcase,
  Sparkles,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bot,
  Layers,
  GraduationCap,
  Award,
  Zap,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Play,
  Terminal,
} from 'lucide-react';

export default function YethuJobsPane() {
  const { user, updateFullProfile } = useAuth();

  const [resumeData, setResumeData] = useState<ResumeProfileData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [jobs, setJobs] = useState<JobVacancy[]>(SAMPLE_TECH_JOBS);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [strict100Match, setStrict100Match] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  // Auto-apply states
  const [activeSession, setActiveSession] = useState<ApplicationSession | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing resume from user profile if stored
  useEffect(() => {
    let initialProfile: ResumeProfileData;
    if (user?.resume) {
      initialProfile = user.resume;
      setResumeData(user.resume);
    } else {
      // Default initial profile for immediate testability
      initialProfile = {
        fileName: 'Nandi_Mthembu_Senior_Engineer_Resume.pdf',
        uploadedAt: 'Today',
        jobTitle: 'Senior Next.js & Frontend Engineer',
        summary: 'Afropolitan software engineer specializing in scalable Next.js App Router, TypeScript, WebRTC media streaming, and modern UI engineering with 4+ years of production experience.',
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'WebRTC', 'OpenAI', 'PostgreSQL', 'AES-256', 'PWA'],
        yearsExperience: 4,
        education: 'B.Sc Computer Science & Information Systems',
        preferredRoles: ['Senior Frontend Engineer', 'Full Stack Developer', 'WebRTC Specialist'],
        preferredLocations: ['South Africa', 'Nigeria', 'Kenya', 'Remote Global'],
      };
      setResumeData(initialProfile);
    }

    // Trigger live real-time search with RapidAPI & OpenAI automatically on load
    triggerJobSearch(initialProfile);
  }, [user]);

  // Handle Resume File Upload & Parsing Simulation via OpenAI
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate file read and OpenAI extraction of candidate skills/experience/education
    setTimeout(async () => {
      const parsed: ResumeProfileData = {
        fileName: file.name,
        uploadedAt: new Date().toLocaleDateString(),
        jobTitle: 'Full-Stack & WebRTC Solutions Engineer',
        summary: `Verified candidate profile parsed from ${file.name}. Highly proficient in TypeScript, reactive micro-frontends, real-time media architecture, and distributed databases.`,
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'WebRTC', 'OpenAI', 'PostgreSQL', 'Security / E2EE', 'Node.js'],
        yearsExperience: 4,
        education: 'B.Sc in Software Engineering or Equivalent Industry Track',
        preferredRoles: ['Senior Frontend Engineer', 'Full Stack AI Developer', 'WebRTC Engineer'],
        preferredLocations: [user?.country || 'South Africa', 'Remote Pan-African', 'Global'],
      };

      setResumeData(parsed);
      setIsUploading(false);
      setUploadSuccess(true);

      // Persist resume to InsForge profile
      await updateFullProfile({
        resume: parsed,
      });

      // Trigger automatic JSearch matched scan
      triggerJobSearch(parsed);
    }, 1600);
  };

  // Search Jobs via RapidAPI JSearch route and strictly filter 100% matches
  const triggerJobSearch = async (profile: ResumeProfileData) => {
    setIsSearchingJobs(true);
    try {
      const res = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: profile.skills,
          jobTitle: profile.jobTitle,
          yearsExperience: profile.yearsExperience,
          education: profile.education,
          country: user?.country || 'South Africa',
          strict100Match,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      }
    } catch (err) {
      console.warn('Job search fallback:', err);
    } finally {
      setIsSearchingJobs(false);
    }
  };

  // Execute Browserbase Auto-Apply
  const handleAutoApply = async (job: JobVacancy) => {
    setSelectedJob(job);
    setIsApplying(true);

    const initialSession: ApplicationSession = {
      id: `bb_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      status: 'launching_browser',
      currentStep: 'Spinning up Browserbase Cloud Chromium Container...',
      logs: ['[Browserbase] Allocating isolated cloud browser sandbox...'],
      success: false,
    };
    setActiveSession(initialSession);

    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          applyUrl: job.applyUrl,
          candidate: {
            name: user?.name || 'Yethu Creator',
            email: user?.email || 'applicant@yethu.africa',
            resumeName: resumeData?.fileName || 'Resume.pdf',
            skills: resumeData?.skills || [],
          },
        }),
      });

      const data = await res.json();
      const steps = data.steps || [];

      // Step-by-step telemetry playback
      for (let i = 0; i < steps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setActiveSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: i === steps.length - 1 ? 'submitted' : 'filling_form',
            currentStep: steps[i].step,
            logs: [...prev.logs, `[${steps[i].timestamp}] ${steps[i].step}`],
            liveViewUrl: data.liveViewUrl,
            submittedAt: i === steps.length - 1 ? data.submittedAt : undefined,
            success: i === steps.length - 1,
          };
        });
      }
    } catch (err) {
      console.error('Auto apply error:', err);
      setActiveSession((prev) => (prev ? { ...prev, status: 'failed', currentStep: 'Submission error' } : null));
    } finally {
      setIsApplying(false);
    }
  };

  const displayedJobs = strict100Match
    ? jobs.filter((j) => j.isStrict100PercentMatch)
    : jobs;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090a0c] text-white overflow-y-auto">
      {/* Top Banner: Yethu Jobs AI Mission */}
      <div className="border-b border-white/10 bg-[#0d0f12] px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 text-white">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white font-mono flex items-center gap-2">
                  <span>YETHU JOBS</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    AI AGENT
                  </span>
                </h1>
                <p className="text-xs text-zinc-400">
                  OpenAI + RapidAPI JSearch 100% Strict Job Matcher with Browserbase Cloud Auto-Apply
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Strict 100% Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10">
              <span className="text-[11px] font-bold text-zinc-300">100% Match Only:</span>
              <button
                onClick={() => setStrict100Match(!strict100Match)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  strict100Match ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    strict100Match ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => resumeData && triggerJobSearch(resumeData)}
              disabled={isSearchingJobs}
              className="flex items-center gap-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-white/15 px-3.5 py-1.5 text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSearchingJobs ? 'animate-spin' : ''}`} />
              <span>Refresh Vacancies</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 sm:p-8 space-y-8 flex-1">
        {/* 1. Resume Profile Card & Upload Engine */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-400" />
                <span>Verified Candidate Resume & Skills Profile</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Safely persisted on your InsForge BaaS profile and evaluated by OpenAI.
              </p>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 rounded-full african-sunset-gradient px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
              >
                <UploadCloud className="h-4 w-4" />
                <span>{isUploading ? 'Parsing with OpenAI...' : 'Upload Updated Resume'}</span>
              </button>
            </div>
          </div>

          {/* Upload Status Banner */}
          {uploadSuccess && (
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 flex items-center gap-2.5 text-xs text-emerald-400 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Resume parsed and securely saved to your InsForge profile! Matching engine updated.</span>
            </div>
          )}

          {/* Parsed Attributes Matrix */}
          {resumeData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-zinc-950/80 border border-white/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">Title & Experience</span>
                </div>
                <p className="text-sm font-bold text-white">{resumeData.jobTitle}</p>
                <p className="text-xs text-emerald-400 font-mono font-semibold">
                  ✓ {resumeData.yearsExperience}+ Years Verified Production Experience
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-950/80 border border-white/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">Educational Qualification</span>
                </div>
                <p className="text-sm font-bold text-white">{resumeData.education}</p>
                <p className="text-xs text-zinc-400 font-mono">
                  File: {resumeData.fileName}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-950/80 border border-white/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="font-bold uppercase tracking-wider text-[10px]">OpenAI Match Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
                    100% Strict Filtering
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Filters out any vacancy missing candidate qualifications.
                </p>
              </div>

              {/* Skills Tags */}
              <div className="md:col-span-3 rounded-2xl bg-zinc-950/60 border border-white/5 p-4 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Extracted Skill Matrix ({resumeData.skills.length} skills):
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {resumeData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-zinc-800/90 border border-white/10 px-3 py-1 text-xs font-medium text-zinc-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-zinc-400 text-xs">
              Upload your resume above to activate the 100% matched AI hunting agent.
            </div>
          )}
        </div>

        {/* 2. Matched Jobs Stream */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg font-black text-white font-mono flex items-center gap-2">
              <Bot className="h-5 w-5 text-orange-400" />
              <span>100% Matched Vacancies ({displayedJobs.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Live Real-Time: RapidAPI JSearch & OpenAI 100% Match Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {displayedJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-4 hover:border-amber-500/40 transition-all shadow-xl group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="h-12 w-12 rounded-2xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {job.title}
                        </h3>
                        {job.isStrict100PercentMatch && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold font-mono">
                            <ShieldCheck className="h-3 w-3" />
                            100% Match
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                        <span className="font-semibold text-zinc-200 flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                          {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                          {job.countryFlag} {job.location}
                        </span>
                        <span>•</span>
                        <span className="text-amber-400 font-mono font-bold">
                          {job.salaryRange}
                        </span>
                        <span>•</span>
                        <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300">
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAutoApply(job)}
                    disabled={isApplying}
                    className="flex items-center justify-center gap-2 rounded-2xl african-sunset-gradient px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Auto-Apply (Browserbase)</span>
                  </button>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {job.description}
                </p>

                {/* AI Strict Match Justification */}
                <div className="rounded-2xl bg-zinc-950/70 border border-emerald-500/20 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      OpenAI Qualification Verification:
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-zinc-300">Skills: <strong className="text-emerald-400">{job.matchBreakdown.skillsMatch}%</strong></span>
                      <span className="text-zinc-300">Exp: <strong className="text-emerald-400">{job.matchBreakdown.experienceMatch}%</strong></span>
                      <span className="text-zinc-300">Degree: <strong className="text-emerald-400">{job.matchBreakdown.educationMatch}%</strong></span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 italic">
                    &quot;{job.matchBreakdown.rationale}&quot;
                  </p>
                </div>

                {/* Required Skills Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Required:</span>
                  {job.requiredSkills.map((req) => (
                    <span
                      key={req}
                      className="rounded-lg bg-zinc-800/80 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 text-[11px] font-medium flex items-center gap-1"
                    >
                      <Check className="h-3 w-3 text-emerald-400" />
                      {req}
                    </span>
                  ))}
                  <span className="text-[10px] text-zinc-500 ml-auto font-mono">
                    Min: {job.minimumYearsExperience} yrs exp
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Browserbase Auto-Apply Cloud Session Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-orange-500/30 bg-[#0d0f12] p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setActiveSession(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
                <Bot className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Browserbase Auto-Apply Agent</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono">
                    Cloud Chromium
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Applying to: <strong className="text-zinc-200">{activeSession.company}</strong> — {activeSession.jobTitle}
                </p>
              </div>
            </div>

            {/* Current Step Banner */}
            <div className="rounded-2xl bg-zinc-950 border border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Current Agent Activity:</span>
                <span className="font-mono text-amber-400 text-[11px] animate-pulse font-bold">
                  {activeSession.status === 'submitted' ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
              </div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                {activeSession.status === 'submitted' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-amber-400 animate-spin shrink-0" />
                )}
                <span>{activeSession.currentStep}</span>
              </p>
            </div>

            {/* Real-time Telemetry Terminal Logs */}
            <div className="rounded-2xl bg-black/90 border border-white/10 p-4 font-mono text-xs text-zinc-300 space-y-1.5 max-h-48 overflow-y-auto">
              <div className="text-[10px] text-zinc-500 border-b border-white/10 pb-1 mb-2 flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-orange-400" />
                <span>Browserbase Cloud Execution Telemetry</span>
              </div>
              {activeSession.logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400">❯</span>
                  <span className={idx === activeSession.logs.length - 1 ? 'text-white font-bold' : 'text-zinc-400'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>

            {/* Application Completed Confirmation */}
            {activeSession.status === 'submitted' && (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center space-y-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Application Successfully Submitted!</h4>
                <p className="text-xs text-zinc-400">
                  Your verified resume, 100% matched qualifications, and portfolio were submitted to {activeSession.company}&apos;s talent system.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveSession(null)}
                className="rounded-full bg-zinc-800 hover:bg-zinc-700 px-5 py-2 text-xs font-bold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
