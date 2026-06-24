"use client";

import { useState, useEffect, useRef } from "react";

import HeroMetrics from "@/components/HeroMetrics";

import JobDiscoveryFeed from "@/components/JobDiscoveryFeed";

import ResumeUpload from "@/components/ResumeUpload";

import { Metric, Role } from "@/app/actions/extract";

import {
  generateSchedule,
  CalendarEvent,
  ProfileData,
} from "@/app/actions/rhythm";

import { dailyNewsData, podcastsData, xFeedData } from "@/app/pulseData";

import { playgroundAssignments, Assignment } from "@/app/playgroundData";

type Tab = "home" | "match" | "rhythm" | "pulse" | "playground";

type RhythmStep =
  | "auth"
  | "archetype"
  | "custom_questions"
  | "calendar_blocking"
  | "weekly_schedule";

const getCategoryStyles = (category: string) => {
  const norm = (category || "").toLowerCase().trim();

  if (norm === "career") {
    return {
      border: "border-l-emerald-800/20 border-l-2",

      tag: "bg-emerald-950/20 text-emerald-400",

      bg: "bg-emerald-955/5 hover:bg-emerald-950/10 hover:border-emerald-900/10",
    };
  } else if (norm === "learning") {
    return {
      border: "border-l-teal-800/20 border-l-2",

      tag: "bg-teal-950/20 text-teal-400",

      bg: "bg-teal-955/5 hover:bg-teal-955/10 hover:border-teal-900/10",
    };
  } else if (norm === "health and fitness" || norm === "health") {
    return {
      border: "border-l-emerald-800/20 border-l-2",

      tag: "bg-emerald-950/20 text-emerald-400",

      bg: "bg-emerald-955/5 hover:bg-emerald-955/10 hover:border-emerald-900/10",
    };
  } else if (
    norm === "life operations" ||
    norm === "life" ||
    norm === "operations" ||
    norm === "ops"
  ) {
    return {
      border: "border-l-amber-800/20 border-l-2",

      tag: "bg-amber-950/20 text-amber-400",

      bg: "bg-amber-955/5 hover:bg-amber-955/10 hover:border-amber-900/10",
    };
  } else if (norm === "social / networking" || norm === "social") {
    return {
      border: "border-l-fuchsia-800/20 border-l-2",

      tag: "bg-fuchsia-950/20 text-fuchsia-400",

      bg: "bg-fuchsia-955/5 hover:bg-fuchsia-955/10 hover:border-fuchsia-900/10",
    };
  } else if (norm === "miscellaneous" || norm === "misc") {
    return {
      border: "border-l-zinc-800 border-l-2",

      tag: "bg-zinc-800/25 text-zinc-400",

      bg: "bg-zinc-955/5 hover:bg-zinc-955/10 hover:border-zinc-900/10",
    };
  } else {
    // Custom category fallback style (sleek neutral zinc / slate)

    return {
      border: "border-l-zinc-800 border-l-2",

      tag: "bg-zinc-800/25 text-zinc-400",

      bg: "bg-zinc-955/5 hover:bg-zinc-955/10 hover:border-zinc-900/10",
    };
  }
};

const getWorkoutLink = (title: string) => {
  const t = (title || "").toLowerCase();

  if (
    t.includes("yoga") ||
    t.includes("stretch") ||
    t.includes("flexibility")
  ) {
    return {
      label: "30-Min Yoga for Flexibility (YouTube)",

      url: "https://www.youtube.com/watch?v=v7AYKzOFHyI",
    };
  } else if (
    t.includes("strength") ||
    t.includes("conditioning") ||
    t.includes("weight") ||
    t.includes("drill")
  ) {
    return {
      label: "20-Min Full Body Strength (YouTube)",

      url: "https://www.youtube.com/watch?v=q20pLhdoEoY",
    };
  } else if (
    t.includes("run") ||
    t.includes("cardio") ||
    t.includes("endurance") ||
    t.includes("tennis")
  ) {
    return {
      label: "30-Min Zone 2 Cardio Workout (YouTube)",

      url: "https://www.youtube.com/watch?v=tgm_QjUiwlk",
    };
  } else {
    return {
      label: "20-Min Complete Ab Workout (YouTube)",

      url: "https://www.youtube.com/watch?v=XYtntRKzzRY",
    };
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  // The Match States

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [isExtracting, setIsExtracting] = useState(false);

  const [metricsData, setMetricsData] = useState<Metric[]>([]);

  const [jobsData, setJobsData] = useState<Role[]>([]);

  // The Rhythm States

  const [rhythmStep, setRhythmStep] = useState<RhythmStep>("auth");

  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  // Auth Form State

  const [emailInput, setEmailInput] = useState("");

  const [passwordInput, setPasswordInput] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);

  // Profile Wizard State

  const [selectedArchetype, setSelectedArchetype] =
    useState<string>("transitioner");

  const [archetypeDetails, setArchetypeDetails] = useState("");

  const [customAnswers, setCustomAnswers] = useState({
    isWorking: "Not working",

    hasCommitments: false,

    commitmentsDetails: "",

    yearsExperience: "0-2 years",

    backBurnerTasks: "",
  });

  const [busyBlocks, setBusyBlocks] = useState<string[]>([]); // Array of "Day-slot" (e.g. "Monday-07:00-09:00")

  const [peakBlocks, setPeakBlocks] = useState<string[]>([]); // Array of "Day-slot" (e.g. "Monday-09:00-11:00")

  const [blockingMode, setBlockingMode] = useState<"unavailable" | "peak">(
    "unavailable",
  );

  const [weeklyEvents, setWeeklyEvents] = useState<CalendarEvent[]>([]);

  const [isGeneratingEvents, setIsGeneratingEvents] = useState(false);

  // Active Edit Event State

  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");

  const [editDesc, setEditDesc] = useState("");

  const [editCategory, setEditCategory] = useState<string>("career");

  // Add Custom Event State

  const [showAddModal, setShowAddModal] = useState(false);

  const [addDay, setAddDay] = useState<
    "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
  >("Monday");

  const [addSlot, setAddSlot] = useState<string>("05:00-07:00");

  const [addTitle, setAddTitle] = useState("");

  const [addDesc, setAddDesc] = useState("");

  const [addCategory, setAddCategory] = useState<string>("career");

  // Google account sync simulation state

  const [syncGoogleCalendar, setSyncGoogleCalendar] = useState(false);

  const [syncGmail, setSyncGmail] = useState(false);

  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);

  // Custom Category Text Inputs

  const [customCategoryEditInput, setCustomCategoryEditInput] = useState("");

  const [customCategoryAddInput, setCustomCategoryAddInput] = useState("");

  // Daily Accountability & Streaks States

  const [simulatedToday, setSimulatedToday] = useState<
    "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
  >("Monday");

  const [streakCount, setStreakCount] = useState<number>(0);

  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);

  const [loggedDays, setLoggedDays] = useState<string[]>([]);

  const getRealDayOfWeek = ():
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday" => {
    const days = [
      "Friday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Friday",
    ];

    const dayIndex = new Date().getDay();

    if (dayIndex === 0 || dayIndex === 6) return "Monday";

    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayIndex] as any;
  };

  // The Pulse View States

  const [newsSectionExpanded, setNewsSectionExpanded] = useState(true);

  const [podcastsSectionExpanded, setPodcastsSectionExpanded] = useState(true);

  const [consensusSectionExpanded, setConsensusSectionExpanded] =
    useState(true);

  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      dailyNewsData.forEach((day, idx) => {
        initial[day.date] = idx === 0;
      });
      return initial;
    },
  );

  const [showNewsArchiveModal, setShowNewsArchiveModal] = useState(false);

  const [expandedXAccount, setExpandedXAccount] = useState<string | null>(
    "Andrej Karpathy",
  );

  const [expandedPodcastId, setExpandedPodcastId] = useState<string | null>(
    "pod-1",
  );

  const [playingPodcastId, setPlayingPodcastId] = useState<string | null>(null);

  const [podcastPlayProgress, setPodcastPlayProgress] = useState<number>(0);

  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const skipNextRef = useRef<() => void>(() => {});

  const [selectedVoiceCategories, setSelectedVoiceCategories] = useState<
    string[]
  >(["AI Pioneers", "Tech and Business Journalists", "News Aggregators"]);

  // Podcast Playlist States

  interface PlaylistItem {
    id: string;

    title: string;

    duration: string;

    podcastName: string;
  }

  const [playlistQueue, setPlaylistQueue] = useState<PlaylistItem[]>([]);

  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(-1);

  const [isQueuePlaying, setIsQueuePlaying] = useState<boolean>(false);

  const [selectedModalPodcast, setSelectedModalPodcast] = useState<any | null>(
    null,
  );

  const toggleQueuePlay = () => {
    if (playlistQueue.length === 0) return;

    if (currentQueueIndex === -1) {
      setCurrentQueueIndex(0);
    }

    setIsQueuePlaying((prev) => !prev);

    setPlayingPodcastId(null);
  };

  const skipQueueNext = () => {
    if (playlistQueue.length === 0) return;

    if (currentQueueIndex < playlistQueue.length - 1) {
      setCurrentQueueIndex((idx) => idx + 1);

      setPodcastPlayProgress(0);
    } else {
      setIsQueuePlaying(false);

      setCurrentQueueIndex(-1);

      setPodcastPlayProgress(0);
    }
  };

  // Keep skipNextRef updated with latest skipQueueNext function reference
  useEffect(() => {
    skipNextRef.current = skipQueueNext;
  });

  // Maps episode IDs to real, fast-loading, public test MP3 files
  const getAudioTrackUrl = (episodeId: string): string => {
    if (episodeId.includes("-1")) return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    if (episodeId.includes("-2")) return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
    if (episodeId.includes("-3")) return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";
    if (episodeId.includes("-4")) return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
    if (episodeId.includes("-5")) return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";
    return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  };

  // Effect 1: Initialize HTML5 Audio and attach time/ended listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audioRef.current = audio;

      const handleTimeUpdate = () => {
        if (audio.duration) {
          setPodcastPlayProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        skipNextRef.current();
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audioRef.current = null;
      };
    }
  }, []);

  // Effect 2: Synchronize Source Changes and Play/Pause Actions
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isQueuePlaying && currentQueueIndex >= 0 && currentQueueIndex < playlistQueue.length) {
      const activeTrack = playlistQueue[currentQueueIndex];
      const targetSrc = getAudioTrackUrl(activeTrack.id);

      if (audio.src !== targetSrc) {
        audio.src = targetSrc;
        audio.load();
      }

      audio.play().catch((err) => {
        console.warn("Audio playback was blocked or interrupted:", err);
      });
    } else {
      audio.pause();
    }
  }, [isQueuePlaying, currentQueueIndex, playlistQueue]);

  // Effect 3: Synchronize Volume and Mute States
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // The Playground States

  const [activePlaygroundDay, setActivePlaygroundDay] = useState<
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  >("Monday");

  const [selectedPlaygroundCategory, setSelectedPlaygroundCategory] = useState<
    | "app-web"
    | "agent-auto"
    | "intel-research"
    | "writing-content"
    | "data-analysis"
    | "design-media"
  >("app-web");

  const [completedPlaygroundLessons, setCompletedPlaygroundLessons] = useState<
    string[]
  >([]);

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean[]>>(
    {},
  );

  const [playgroundStreak, setPlaygroundStreak] = useState<number>(0);

  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(
    null,
  );

  // Load playground states on client mount

  useEffect(() => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const currentDay = dayNames[new Date().getDay()] as any;

    setActivePlaygroundDay(currentDay);

    const savedCompleted = localStorage.getItem("onwards_completed_lessons");

    const savedSteps = localStorage.getItem("onwards_checked_steps");

    const savedPlaygroundStreak = localStorage.getItem(
      "onwards_playground_streak",
    );

    const savedLastCompletedDate = localStorage.getItem(
      "onwards_last_completed_date",
    );

    if (savedCompleted) {
      setCompletedPlaygroundLessons(JSON.parse(savedCompleted));
    }

    if (savedSteps) {
      setCheckedSteps(JSON.parse(savedSteps));
    }

    if (savedPlaygroundStreak) {
      setPlaygroundStreak(parseInt(savedPlaygroundStreak, 10));
    }

    if (savedLastCompletedDate) {
      setLastCompletedDate(savedLastCompletedDate);

      // Streak check: if last completed was before yesterday, reset streak to 0

      const todayStr = new Date().toDateString();

      const yesterday = new Date();

      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayStr = yesterday.toDateString();

      if (
        savedLastCompletedDate !== todayStr &&
        savedLastCompletedDate !== yesterdayStr
      ) {
        setPlaygroundStreak(0);

        localStorage.setItem("onwards_playground_streak", "0");
      }
    }
  }, []);

  const handleToggleStep = (lessonId: string, stepIdx: number) => {
    setCheckedSteps((prev) => {
      const current = prev[lessonId]
        ? [...prev[lessonId]]
        : [false, false, false];

      current[stepIdx] = !current[stepIdx];

      const updated = { ...prev, [lessonId]: current };

      localStorage.setItem("onwards_checked_steps", JSON.stringify(updated));

      return updated;
    });
  };

  const handleUpdateStreak = (
    currentCompleted: string[],
    newlyCompletedId: string,
  ) => {
    const todayStr = new Date().toDateString();

    if (lastCompletedDate === todayStr) {
      return; // Already completed a lesson today, streak is safe
    }

    let newStreak = playgroundStreak;

    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayStr = yesterday.toDateString();

    if (lastCompletedDate === yesterdayStr || lastCompletedDate === null) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    setPlaygroundStreak(newStreak);

    setLastCompletedDate(todayStr);

    localStorage.setItem("onwards_playground_streak", newStreak.toString());

    localStorage.setItem("onwards_last_completed_date", todayStr);
  };

  const handleToggleLessonCompletion = (lessonId: string) => {
    setCompletedPlaygroundLessons((prev) => {
      let updated: string[];

      if (prev.includes(lessonId)) {
        updated = prev.filter((id) => id !== lessonId);
      } else {
        updated = [...prev, lessonId];

        handleUpdateStreak(updated, lessonId);
      }

      localStorage.setItem(
        "onwards_completed_lessons",
        JSON.stringify(updated),
      );

      return updated;
    });
  };

  // Load User Authentication & Profile from localStorage on mount

  useEffect(() => {
    const activeSession = localStorage.getItem("onwards_active_session");

    if (activeSession) {
      setSignedInUser(activeSession);

      setRhythmStep("weekly_schedule");

      // Load their specific schedule if present

      const savedSchedule = localStorage.getItem(
        `onwards_schedule_${activeSession}`,
      );

      const savedProfile = localStorage.getItem(
        `onwards_profile_${activeSession}`,
      );

      if (savedSchedule) {
        setWeeklyEvents(JSON.parse(savedSchedule));
      }

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);

        setSelectedArchetype(profile.archetype);

        setArchetypeDetails(profile.details);

        setBusyBlocks(profile.busyBlocks);

        setPeakBlocks(profile.peakBlocks || []);

        if (profile.customAnswers) {
          setCustomAnswers(profile.customAnswers);
        }
      }

      // Load streak and logged days

      const savedStreak = localStorage.getItem(
        `onwards_streak_${activeSession}`,
      );

      const savedLogged = localStorage.getItem(
        `onwards_logged_days_${activeSession}`,
      );

      if (savedStreak) {
        setStreakCount(parseInt(savedStreak, 10));
      }

      const realDay = getRealDayOfWeek();

      setSimulatedToday(realDay);

      if (savedLogged) {
        const parsedLogged = JSON.parse(savedLogged) as string[];

        setLoggedDays(parsedLogged);

        setHasLoggedToday(parsedLogged.includes(realDay));
      } else {
        setHasLoggedToday(false);
      }
    }
  }, []);

  // User Credentials & Profile Loader

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    setAuthError(null);

    if (!emailInput || !passwordInput) {
      setAuthError("Please complete all inputs.");

      return;
    }

    const email = emailInput.trim().toLowerCase();

    // Seeded accounts check (bypass lookup DB if correct password used)

    const seededAccounts = [
      "transitioner@onwards.com",
      "parent@onwards.com",
      "consultant@onwards.com",
    ];

    const isSeededEmail = seededAccounts.includes(email);

    if (!isSignUp) {
      // Login Flow

      if (isSeededEmail) {
        if (passwordInput !== "password") {
          setAuthError("Incorrect password for seeded account.");

          return;
        }

        setSignedInUser(email);

        localStorage.setItem("onwards_active_session", email);

        if (email === "transitioner@onwards.com") {
          const seededProfile = {
            archetype: "transitioner",

            details:
              "Dedicating full time to a major tech career pivot. Aiming for FIRE and learning Next.js.",

            busyBlocks: [],

            peakBlocks: [
              "Monday-09:00-11:00",

              "Tuesday-09:00-11:00",

              "Wednesday-09:00-11:00",

              "Thursday-09:00-11:00",

              "Friday-09:00-11:00",
            ],

            customAnswers: {
              isWorking: "Not working",

              hasCommitments: false,

              commitmentsDetails: "",

              yearsExperience: "6-10 years",

              backBurnerTasks: "Set up investment trust",
            },
          };

          setSelectedArchetype("transitioner");

          setArchetypeDetails(seededProfile.details);

          setBusyBlocks([]);

          setPeakBlocks(seededProfile.peakBlocks);

          setCustomAnswers(seededProfile.customAnswers);

          localStorage.setItem(
            `onwards_profile_${email}`,
            JSON.stringify(seededProfile),
          );

          setIsGeneratingEvents(true);

          generateSchedule(seededProfile).then((events) => {
            setWeeklyEvents(events);

            localStorage.setItem(
              `onwards_schedule_${email}`,
              JSON.stringify(events),
            );

            setIsGeneratingEvents(false);

            setRhythmStep("weekly_schedule");
          });
        } else if (email === "parent@onwards.com") {
          const seededProfile = {
            archetype: "parent",

            details:
              "Parent balancing household chores and caregiving. Aiming to learn visual AI tools and prompt engineering.",

            busyBlocks: [
              "Monday-07:00-09:00",
              "Monday-09:00-11:00",

              "Tuesday-07:00-09:00",
              "Tuesday-09:00-11:00",

              "Wednesday-07:00-09:00",
              "Wednesday-09:00-11:00",

              "Thursday-07:00-09:00",
              "Thursday-09:00-11:00",

              "Friday-07:00-09:00",
              "Friday-09:00-11:00",
            ],

            peakBlocks: [
              "Monday-19:00-21:00",

              "Tuesday-19:00-21:00",

              "Wednesday-19:00-21:00",

              "Thursday-19:00-21:00",

              "Friday-19:00-21:00",
            ],

            customAnswers: {
              isWorking: "Part-time",

              hasCommitments: true,

              commitmentsDetails: "Caring for toddler and school runs",

              yearsExperience: "10+ years",

              backBurnerTasks: "Fix garage door and replace kitchen lights",
            },
          };

          setSelectedArchetype("parent");

          setArchetypeDetails(seededProfile.details);

          setBusyBlocks(seededProfile.busyBlocks);

          setPeakBlocks(seededProfile.peakBlocks);

          setCustomAnswers(seededProfile.customAnswers);

          localStorage.setItem(
            `onwards_profile_${email}`,
            JSON.stringify(seededProfile),
          );

          setIsGeneratingEvents(true);

          generateSchedule(seededProfile).then((events) => {
            setWeeklyEvents(events);

            localStorage.setItem(
              `onwards_schedule_${email}`,
              JSON.stringify(events),
            );

            setIsGeneratingEvents(false);

            setRhythmStep("weekly_schedule");
          });
        } else if (email === "consultant@onwards.com") {
          const seededProfile = {
            archetype: "consultant",

            details:
              "Independent consultant balancing multiple client streams. Building vector queries and databases.",

            busyBlocks: [
              "Wednesday-09:00-11:00",

              "Wednesday-11:00-13:00",

              "Wednesday-13:00-15:00",

              "Wednesday-15:00-17:00",
            ],

            peakBlocks: [
              "Monday-13:00-15:00",

              "Tuesday-13:00-15:00",

              "Thursday-13:00-15:00",

              "Friday-13:00-15:00",
            ],

            customAnswers: {
              isWorking: "Full-time",

              hasCommitments: false,

              commitmentsDetails: "",

              yearsExperience: "10+ years",

              backBurnerTasks: "Establish estate trust document",
            },
          };

          setSelectedArchetype("consultant");

          setArchetypeDetails(seededProfile.details);

          setBusyBlocks(seededProfile.busyBlocks);

          setPeakBlocks(seededProfile.peakBlocks);

          setCustomAnswers(seededProfile.customAnswers);

          localStorage.setItem(
            `onwards_profile_${email}`,
            JSON.stringify(seededProfile),
          );

          setIsGeneratingEvents(true);

          generateSchedule(seededProfile).then((events) => {
            setWeeklyEvents(events);

            localStorage.setItem(
              `onwards_schedule_${email}`,
              JSON.stringify(events),
            );

            setIsGeneratingEvents(false);

            setRhythmStep("weekly_schedule");
          });
        }

        return;
      }

      // Check registered users

      const users = JSON.parse(localStorage.getItem("onwards_users") || "{}");

      if (users[email]) {
        if (users[email] === passwordInput) {
          setSignedInUser(email);

          localStorage.setItem("onwards_active_session", email);

          // Load profile parameters

          const savedProfile = localStorage.getItem(`onwards_profile_${email}`);

          if (savedProfile) {
            const profile = JSON.parse(savedProfile);

            setSelectedArchetype(profile.archetype);

            setArchetypeDetails(profile.details);

            setBusyBlocks(profile.busyBlocks);

            setPeakBlocks(profile.peakBlocks || []);

            if (profile.customAnswers) setCustomAnswers(profile.customAnswers);
          } else {
            // Reset to defaults if profile is missing

            setSelectedArchetype("transitioner");

            setArchetypeDetails("");

            setBusyBlocks([]);

            setPeakBlocks([]);

            setCustomAnswers({
              isWorking: "Not working",

              hasCommitments: false,

              commitmentsDetails: "",

              yearsExperience: "0-2 years",

              backBurnerTasks: "",
            });
          }

          // Load schedule

          const savedSchedule = localStorage.getItem(
            `onwards_schedule_${email}`,
          );

          if (savedSchedule) {
            setWeeklyEvents(JSON.parse(savedSchedule));

            setRhythmStep("weekly_schedule");
          } else {
            setRhythmStep("archetype");
          }
        } else {
          setAuthError("Incorrect password. Please try again.");
        }
      } else {
        setAuthError("No account found with this email. Please sign up first.");
      }
    } else {
      // Sign Up Flow

      if (isSeededEmail) {
        setAuthError(
          "This email address is reserved for demo seeded accounts. Please sign in instead.",
        );

        return;
      }

      const users = JSON.parse(localStorage.getItem("onwards_users") || "{}");

      if (users[email]) {
        setAuthError(
          "An account with this email already exists. Please sign in instead.",
        );

        return;
      }

      // Save user credentials

      users[email] = passwordInput;

      localStorage.setItem("onwards_users", JSON.stringify(users));

      setSignedInUser(email);

      localStorage.setItem("onwards_active_session", email);

      // Reset profile values for new account

      setSelectedArchetype("transitioner");

      setArchetypeDetails("");

      setBusyBlocks([]);

      setPeakBlocks([]);

      setCustomAnswers({
        isWorking: "Not working",

        hasCommitments: false,

        commitmentsDetails: "",

        yearsExperience: "0-2 years",

        backBurnerTasks: "",
      });

      setWeeklyEvents([]);

      setRhythmStep("archetype");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("onwards_active_session");

    setSignedInUser(null);

    setWeeklyEvents([]);

    setRhythmStep("auth");

    setEmailInput("");

    setPasswordInput("");

    setStreakCount(0);

    setSimulatedToday("Monday");

    setHasLoggedToday(false);

    setLoggedDays([]);
  };

  const handleUploadComplete = async (metrics?: Metric[], roles?: Role[]) => {
    setIsDataLoaded(true);

    setIsExtracting(true);

    // Give a brief cinematic delay before revealing the insights

    setTimeout(() => {
      setMetricsData(metrics || []);

      setJobsData(roles || []);

      setIsExtracting(false);
    }, 1500);
  };

  // Switch tabs in Wizard

  const handleArchetypeSubmit = () => {
    // Populate default answers based on archetype to streamline the flow

    if (selectedArchetype === "transitioner") {
      setCustomAnswers({
        isWorking: "Not working",

        hasCommitments: false,

        commitmentsDetails: "",

        yearsExperience: "3-5 years",

        backBurnerTasks: "",
      });
    } else if (selectedArchetype === "parent") {
      setCustomAnswers({
        isWorking: "Part-time",

        hasCommitments: true,

        commitmentsDetails:
          "Childcare, home management, and side consulting projects",

        yearsExperience: "6-10 years",

        backBurnerTasks: "",
      });
    } else if (selectedArchetype === "student") {
      setCustomAnswers({
        isWorking: "Not working",

        hasCommitments: false,

        commitmentsDetails: "",

        yearsExperience: "0-2 years",

        backBurnerTasks: "",
      });
    } else if (selectedArchetype === "consultant") {
      setCustomAnswers({
        isWorking: "Part-time",

        hasCommitments: true,

        commitmentsDetails:
          "Managing multiple client contracts and admin tasks",

        yearsExperience: "10+ years",

        backBurnerTasks: "",
      });
    } else {
      setCustomAnswers((prev) => ({
        isWorking: prev.isWorking || "Not working",

        hasCommitments: prev.hasCommitments || false,

        commitmentsDetails: prev.commitmentsDetails || "",

        yearsExperience: prev.yearsExperience || "0-2 years",

        backBurnerTasks: prev.backBurnerTasks || "",
      }));
    }

    setRhythmStep("custom_questions");
  };

  const handleCustomQuestionsSubmit = () => {
    if (isGoogleConnected) {
      // Pre-populate some sync slots automatically to show the integration works

      setBusyBlocks((prev) => {
        const slotsToAdd = [
          "Monday-09:00-11:00",
          "Wednesday-15:00-17:00",
          "Friday-11:00-13:00",
        ];

        const unique = new Set([...prev, ...slotsToAdd]);

        return Array.from(unique);
      });
    }

    setRhythmStep("calendar_blocking");
  };

  const toggleBlock = (block: string) => {
    if (blockingMode === "unavailable") {
      setBusyBlocks((prev) => {
        const isPresent = prev.includes(block);

        if (isPresent) {
          return prev.filter((b) => b !== block);
        } else {
          setPeakBlocks((peak) => peak.filter((p) => p !== block));

          return [...prev, block];
        }
      });
    } else {
      setPeakBlocks((prev) => {
        const isPresent = prev.includes(block);

        if (isPresent) {
          return prev.filter((p) => p !== block);
        } else {
          setBusyBlocks((busy) => busy.filter((b) => b !== block));

          return [...prev, block];
        }
      });
    }
  };

  const handleGenerateSchedule = async () => {
    if (!signedInUser) return;

    setIsGeneratingEvents(true);

    const profile: ProfileData = {
      archetype: selectedArchetype,

      details: archetypeDetails,

      busyBlocks: busyBlocks,

      peakBlocks: peakBlocks,

      customAnswers: selectedArchetype === "custom" ? customAnswers : undefined,
    };

    try {
      const generated = await generateSchedule(profile);

      setWeeklyEvents(generated);

      // Persist in localStorage

      localStorage.setItem(
        `onwards_profile_${signedInUser}`,
        JSON.stringify(profile),
      );

      localStorage.setItem(
        `onwards_schedule_${signedInUser}`,
        JSON.stringify(generated),
      );

      // Reset logged days for this new schedule structure

      setLoggedDays([]);

      localStorage.setItem(
        `onwards_logged_days_${signedInUser}`,
        JSON.stringify([]),
      );

      setHasLoggedToday(false);

      setRhythmStep("weekly_schedule");
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingEvents(false);
    }
  };

  // Log Day accountability completion

  const logDayCompletion = () => {
    if (!signedInUser) return;

    // Filter non-empty and non-committed events for the simulated today

    const todayTasks = weeklyEvents.filter(
      (ev) =>
        ev.day === simulatedToday &&
        ev.title !== "Empty Slot" &&
        ev.title !== "Committed Time",
    );

    if (todayTasks.length === 0) {
      alert("No activities scheduled for today to complete!");

      return;
    }

    const allCompleted = todayTasks.every((ev) => ev.completed);

    if (!allCompleted) {
      alert(
        `Please check off all scheduled activities for ${simulatedToday} first to maintain accountability!`,
      );

      return;
    }

    // Add today to logged days

    if (!loggedDays.includes(simulatedToday)) {
      const nextLogged = [...loggedDays, simulatedToday];

      setLoggedDays(nextLogged);

      localStorage.setItem(
        `onwards_logged_days_${signedInUser}`,
        JSON.stringify(nextLogged),
      );

      // Increment streak

      const nextStreak = streakCount + 1;

      setStreakCount(nextStreak);

      localStorage.setItem(
        `onwards_streak_${signedInUser}`,
        nextStreak.toString(),
      );

      setHasLoggedToday(true);
    }
  };

  // Toggle Accountability Checkbox

  const toggleEventCompleted = (eventId: string) => {
    const updated = weeklyEvents.map((ev) =>
      ev.id === eventId ? { ...ev, completed: !ev.completed } : ev,
    );

    setWeeklyEvents(updated);

    if (signedInUser) {
      localStorage.setItem(
        `onwards_schedule_${signedInUser}`,
        JSON.stringify(updated),
      );
    }
  };

  // Edit Event

  const startEditingEvent = (ev: CalendarEvent) => {
    const isCommitted =
      ev.title === "Committed Time" || ev.title.startsWith("Google Calendar");

    if (isCommitted) return; // Block editing of committed slots

    const isPulseTask =
      ev.category.toLowerCase().trim() === "life operations" &&
      (ev.title.toLowerCase().includes("pulse") ||
        ev.title.toLowerCase().includes("newsletter") ||
        ev.title.toLowerCase().includes("tech briefing") ||
        ev.title.toLowerCase().includes("podcast") ||
        ev.description.toLowerCase().includes("tech newsletters") ||
        ev.description.toLowerCase().includes("audio feeds"));

    setEditingEventId(ev.id);

    setEditTitle(
      isPulseTask ? 'Stay up to date: Refer to "The Pulse" tab' : ev.title,
    );

    setEditDesc(
      isPulseTask
        ? "Curated list of tech newsletter articles, trending discussions, and podcasts are available in the Pulse tab."
        : ev.description,
    );

    setEditCategory(ev.category);
  };

  const saveEditedEvent = () => {
    const finalCategory =
      editCategory === "custom"
        ? customCategoryEditInput.trim() || "custom"
        : editCategory;

    const updated = weeklyEvents.map((ev) =>
      ev.id === editingEventId
        ? {
            ...ev,
            title: editTitle,
            description: editDesc,
            category: finalCategory,
          }
        : ev,
    );

    setWeeklyEvents(updated);

    if (signedInUser) {
      localStorage.setItem(
        `onwards_schedule_${signedInUser}`,
        JSON.stringify(updated),
      );
    }

    setEditingEventId(null);
  };

  const deleteEvent = (eventId: string) => {
    // Keep the timeSlot slot structure but reset it to empty/Committed

    const updated = weeklyEvents.map((ev) =>
      ev.id === eventId
        ? {
            ...ev,
            title: "Empty Slot",
            description: "Unscheduled time slot. Click to add an activity.",
            category: "miscellaneous",
            completed: false,
          }
        : ev,
    );

    setWeeklyEvents(updated);

    if (signedInUser) {
      localStorage.setItem(
        `onwards_schedule_${signedInUser}`,
        JSON.stringify(updated),
      );
    }

    setEditingEventId(null);
  };

  // Drag and Drop Swapping Handlers

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData("text/plain", eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent,

    targetDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday",

    targetSlot: string,
  ) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");

    if (!draggedId) return;

    const draggedEvent = weeklyEvents.find((ev) => ev.id === draggedId);

    if (!draggedEvent) return;

    // Do nothing if dropping in same spot

    if (draggedEvent.day === targetDay && draggedEvent.timeSlot === targetSlot)
      return;

    const targetEvent = weeklyEvents.find(
      (ev) => ev.day === targetDay && ev.timeSlot === targetSlot,
    );

    let updated = weeklyEvents.map((ev) => {
      if (ev.id === draggedId) {
        return {
          ...ev,

          day: targetDay,

          timeSlot: targetSlot,
        };
      }

      if (targetEvent && ev.id === targetEvent.id) {
        return {
          ...ev,

          day: draggedEvent.day,

          timeSlot: draggedEvent.timeSlot,
        };
      }

      return ev;
    });

    setWeeklyEvents(updated);

    if (signedInUser) {
      localStorage.setItem(
        `onwards_schedule_${signedInUser}`,
        JSON.stringify(updated),
      );
    }
  };

  // Add Custom Event

  const handleAddCustomEvent = () => {
    if (!addTitle.trim()) return;

    const finalCategory =
      addCategory === "custom"
        ? customCategoryAddInput.trim() || "custom"
        : addCategory;

    const matchedIndex = weeklyEvents.findIndex(
      (ev) => ev.day === addDay && ev.timeSlot === addSlot,
    );

    let updated = [...weeklyEvents];

    const newEvent: CalendarEvent = {
      id: `custom-event-${Date.now()}`,

      day: addDay,

      timeSlot: addSlot,

      category: finalCategory,

      title: addTitle,

      description: addDesc || "No details provided.",

      completed: false,
    };

    if (matchedIndex !== -1) {
      updated[matchedIndex] = newEvent;
    } else {
      updated.push(newEvent);
    }

    setWeeklyEvents(updated);

    if (signedInUser) {
      localStorage.setItem(
        `onwards_schedule_${signedInUser}`,
        JSON.stringify(updated),
      );
    }

    // Reset Form

    setAddTitle("");

    setAddDesc("");

    setAddCategory("career");

    setCustomCategoryAddInput("");

    setShowAddModal(false);
  };

  // Accountability Progress Calculation

  const getProgressStats = () => {
    const total = weeklyEvents.filter((ev) => ev.title !== "Empty Slot").length;

    const completed = weeklyEvents.filter(
      (ev) => ev.title !== "Empty Slot" && ev.completed,
    ).length;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  // Playground Calculations

  const appCompletedCount = completedPlaygroundLessons.filter((id) =>
    id.includes("app-web"),
  ).length;

  const agentCompletedCount = completedPlaygroundLessons.filter((id) =>
    id.includes("agent-auto"),
  ).length;

  const researchCompletedCount = completedPlaygroundLessons.filter((id) =>
    id.includes("intel-research"),
  ).length;

  const writingCompletedCount = completedPlaygroundLessons.filter((id) =>
    id.includes("writing-content"),
  ).length;

  const dataCompletedCount = completedPlaygroundLessons.filter((id) =>
    id.includes("data-analysis"),
  ).length;

  const designCompletedCount = completedPlaygroundLessons.filter((id) =>
    id.includes("design-media"),
  ).length;

  const badges = [
    {
      id: "app-creator",
      label: "App Creator",
      earned: appCompletedCount >= 2,
      desc: "Completed 2+ App & Web Development tasks",
    },

    {
      id: "agent-engineer",
      label: "Agent Engineer",
      earned: agentCompletedCount >= 2,
      desc: "Completed 2+ AI Agents & Automation tasks",
    },

    {
      id: "deep-researcher",
      label: "Deep Researcher",
      earned: researchCompletedCount >= 2,
      desc: "Completed 2+ Intelligence & Research tasks",
    },

    {
      id: "content-publisher",
      label: "Content Publisher",
      earned: writingCompletedCount >= 2,
      desc: "Completed 2+ Writing & Content tasks",
    },

    {
      id: "data-specialist",
      label: "Data Specialist",
      earned: dataCompletedCount >= 2,
      desc: "Completed 2+ Data Analysis tasks",
    },

    {
      id: "creative-designer",
      label: "Creative Designer",
      earned: designCompletedCount >= 2,
      desc: "Completed 2+ Design & Media tasks",
    },
  ];

  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getDayOfWeekString = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return days[new Date().getDay()];
  };

  const todayRealName = getDayOfWeekString();

  const activeLesson = playgroundAssignments.find(
    (a) =>
      a.day === activePlaygroundDay &&
      a.category === selectedPlaygroundCategory,
  );

  const activeLessonId = activeLesson?.id || "";

  const stepsChecked = checkedSteps[activeLessonId] || [false, false, false];

  const categoryMeta = {
    "app-web": {
      colorClass: "text-emerald-400",

      borderClass: "border-emerald-500/20",

      activeBorderClass:
        "border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]",

      bgClass: "bg-emerald-950/5 hover:bg-emerald-950/10",

      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

      glowClass: "from-emerald-500/5 to-teal-500/5",

      btnBgClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },

    "agent-auto": {
      colorClass: "text-purple-400",

      borderClass: "border-purple-500/20",

      activeBorderClass:
        "border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]",

      bgClass: "bg-purple-950/5 hover:bg-purple-950/10",

      badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",

      glowClass: "from-purple-500/5 to-pink-500/5",

      btnBgClass: "bg-purple-600 hover:bg-purple-700 text-white",
    },

    "intel-research": {
      colorClass: "text-sky-400",

      borderClass: "border-sky-500/20",

      activeBorderClass:
        "border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.15)]",

      bgClass: "bg-sky-950/5 hover:bg-sky-950/10",

      badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",

      glowClass: "from-sky-500/5 to-indigo-500/5",

      btnBgClass: "bg-sky-600 hover:bg-sky-700 text-white",
    },

    "writing-content": {
      colorClass: "text-pink-400",

      borderClass: "border-pink-500/20",

      activeBorderClass:
        "border-pink-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]",

      bgClass: "bg-pink-950/5 hover:bg-pink-950/10",

      badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",

      glowClass: "from-pink-500/5 to-rose-500/5",

      btnBgClass: "bg-pink-600 hover:bg-pink-700 text-white",
    },

    "data-analysis": {
      colorClass: "text-amber-400",

      borderClass: "border-amber-500/20",

      activeBorderClass:
        "border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]",

      bgClass: "bg-amber-955/5 hover:bg-amber-955/10",

      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",

      glowClass: "from-amber-500/5 to-orange-500/5",

      btnBgClass: "bg-amber-600 hover:bg-amber-700 text-white",
    },

    "design-media": {
      colorClass: "text-indigo-400",

      borderClass: "border-indigo-500/20",

      activeBorderClass:
        "border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]",

      bgClass: "bg-indigo-950/5 hover:bg-indigo-950/10",

      badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",

      glowClass: "from-indigo-500/5 to-violet-500/5",

      btnBgClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
  };

  const progressStats = getProgressStats();

  return (
    <div className="flex flex-col min-h-screen bg-[#081510] text-[#F4F4F0] font-sans pb-24 overflow-x-hidden">
      {/* Navigation Bar */}

      <header className="w-full pt-8 pb-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 z-20 relative border-b border-emerald-950/20 bg-[#081510]/90 backdrop-blur-md sticky top-0">
        <div
          className="flex items-center gap-3 select-none cursor-pointer group"
          onClick={() => setActiveTab("home")}
        >
          <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-650 to-teal-700 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>

            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">
              Onwards
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 font-extrabold">
                .
              </span>
            </span>

            <div className="px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase">
              Beta
            </div>
          </div>
        </div>

        <nav className="flex items-center flex-wrap justify-center gap-2 sm:gap-6 bg-black/35 p-1.5 rounded-full backdrop-blur-sm shadow-md">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "home"
                ? "bg-[#183b2b]/60 text-white shadow-md"
                : "text-slate-350 hover:text-[#F4F4F0]"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab("match")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "match"
                ? "bg-[#183b2b]/60 text-white shadow-md"
                : "text-slate-350 hover:text-[#F4F4F0]"
            }`}
          >
            The Match
          </button>

          <button
            onClick={() => setActiveTab("rhythm")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "rhythm"
                ? "bg-[#183b2b]/60 text-white shadow-md"
                : "text-slate-350 hover:text-[#F4F4F0]"
            }`}
          >
            The Rhythm
          </button>

          <button
            onClick={() => setActiveTab("pulse")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "pulse"
                ? "bg-[#183b2b]/60 text-white shadow-md"
                : "text-slate-350 hover:text-[#F4F4F0]"
            }`}
          >
            The Pulse
          </button>

          <button
            onClick={() => setActiveTab("playground")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "playground"
                ? "bg-[#183b2b]/60 text-white shadow-md"
                : "text-slate-350 hover:text-[#F4F4F0]"
            }`}
          >
            The Playground
          </button>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start w-full px-4 sm:px-8">
        {/* HOMEPAGE VIEW */}

        {activeTab === "home" && (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-8 md:pt-16 animate-in fade-in duration-500">
            {/* Tagline */}

            <section className="text-center mb-16 max-w-4xl">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 text-white">
                Onwards
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                  .
                </span>
              </h2>

              <p className="text-xl md:text-2xl font-light tracking-tight text-slate-200 mb-6 font-sans">
                Your transition, optimized.
              </p>

              <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                Onwards is your control center for transition navigation. Map
                your career path, synchronize your daily schedules, stay
                informed with consolidated real-time tech news and podcasts, and
                get hands-on experience with the latest AI tools.
              </p>
            </section>

            {/* The Four Pillars Grid */}

            <section className="w-full mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-6">
                {/* 1. The Match */}

                <div
                  onClick={() => setActiveTab("match")}
                  className="group cursor-pointer p-6 rounded-3xl bg-[#0e2018]/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]/40 hover:bg-[#0e2018]/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col relative pt-10"
                >
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
                    The Match
                  </h3>

                  <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                    Upload your resume to instantly extract quantifiable
                    achievements and match with roles that directly align with
                    your background and experience.
                  </p>

                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    get started &rarr;
                  </span>
                </div>

                {/* 2. The Rhythm */}

                <div
                  onClick={() => setActiveTab("rhythm")}
                  className="group cursor-pointer p-6 rounded-3xl bg-[#0e2018]/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]/40 hover:bg-[#0e2018]/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col relative pt-10"
                >
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
                    The Rhythm
                  </h3>

                  <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                    Master your daily transition dynamics. Build customized
                    daily routines that integrate fitness blocks, life
                    management tasks, and project building segments.
                  </p>

                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Own today &rarr;
                  </span>
                </div>

                {/* 3. The Pulse */}

                <div
                  onClick={() => setActiveTab("pulse")}
                  className="group cursor-pointer p-6 rounded-3xl bg-[#0e2018]/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]/40 hover:bg-[#0e2018]/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col relative pt-10"
                >
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
                    The Pulse
                  </h3>

                  <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                    Real-time tech briefings and industry-shaping podcasts
                    consolidated in one workspace. Gather key insights from
                    leading executive outlets and audio broadcasts.
                  </p>

                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    stay updated &rarr;
                  </span>
                </div>

                {/* 4. The Playground */}

                <div
                  onClick={() => setActiveTab("playground")}
                  className="group cursor-pointer p-6 rounded-3xl bg-[#0e2018]/40 hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]/40 hover:bg-[#0e2018]/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col relative pt-10"
                >
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
                    The Playground
                  </h3>

                  <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                    Bite-sized learning hubs designed to build immediate
                    familiarity with the latest AI tools. Get hands-on sandbox
                    experience prompting models and wiring visual AI flows.
                  </p>

                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    let's practice &rarr;
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* THE MATCH VIEW */}

        {activeTab === "match" && (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-8 animate-in fade-in duration-500">
            {/* Header Tagline */}

            <section className="text-center mb-8 max-w-4xl">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                The Match.
              </h2>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto font-light">
                Map your achievements to the global landscape of aligned roles.
              </p>
            </section>

            {/* Central CTA / Upload Zone with Glow */}

            <div className="relative w-full max-w-4xl mx-auto mb-8 z-20">
              <div className="absolute inset-0 bg-emerald-600/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

              <ResumeUpload onUploadComplete={handleUploadComplete} />
            </div>

            {/* Preview Layer */}

            <div className="relative w-full flex-grow mt-4">
              {!isDataLoaded && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-32 bg-black/40 pointer-events-none">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0e2018]/90  backdrop-blur-md shadow-2xl text-slate-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>

                    <span className="font-medium text-sm tracking-wide">
                      Upload your resume to unlock insights
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`w-full transition-all duration-1000 ease-in-out ${
                  !isDataLoaded
                    ? "opacity-40 grayscale-[60%] blur-[3px] pointer-events-none select-none"
                    : "opacity-100 grayscale-0 blur-none pointer-events-auto"
                }`}
              >
                <HeroMetrics metrics={metricsData} isLoading={isExtracting} />

                <JobDiscoveryFeed roles={jobsData} isLoading={isExtracting} />
              </div>
            </div>
          </div>
        )}

        {/* THE RHYTHM VIEW */}

        {activeTab === "rhythm" && (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-8 animate-in fade-in duration-500 select-none">
            {/* 1. AUTH STEP */}

            {rhythmStep === "auth" && (
              <div className="w-full max-w-md bg-[#0e2018]/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl mt-12">
                <div className="text-center mb-8">
                  <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-700 items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-bounce">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tight">
                    The Rhythm Access Portal
                  </h3>

                  <p className="text-sm text-slate-400 mt-2 font-light">
                    Sign in to retrieve your custom weekly rhythm and
                    accountability schedule.
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authError && (
                    <div className="p-3 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      {authError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="e.g. parent@onwards.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#06100c] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#06100c] rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1b4332] hover:bg-[#2d6a4f] border border-[#40916c]/30 text-[#F4F4F0] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
                  >
                    {isSignUp ? "Create Account" : "Access Planner"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-emerald-950/20 text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-xs text-emerald-450 hover:underline"
                  >
                    {isSignUp
                      ? "Already have an account? Sign In"
                      : "First time? Create a New Account"}
                  </button>

                  <div className="mt-4 text-[10px] text-slate-400 font-light leading-relaxed bg-[#06100c]/40 p-3 rounded-xl ">
                    <span className="font-semibold block mb-1 text-slate-400 uppercase tracking-wider">
                      Demo Seed Accounts (Password: "password"):
                    </span>
                    • parent@onwards.com (childcare + side contract)
                    <br />• transitioner@onwards.com (full-time career pivot)
                  </div>
                </div>
              </div>
            )}

            {/* 2. ARCHETYPE STEP */}

            {rhythmStep === "archetype" && (
              <div className="w-full max-w-5xl flex flex-col items-center animate-in fade-in duration-500">
                <section className="text-center mb-10">
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    Select Your Archetype
                  </h3>

                  <p className="text-sm text-slate-400 mt-2 font-light">
                    Tell us your profile so we can provide a customized weekly
                    plan for you.
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full mb-8">
                  {/* Archetype 1: Full-Time Transitioner */}

                  <div
                    onClick={() => setSelectedArchetype("transitioner")}
                    className={`transition-all duration-300 cursor-pointer border rounded-3xl p-5 relative flex flex-col justify-between select-none bg-[#0e2018] min-h-[350px] hover:border-emerald-800 ${
                      selectedArchetype === "transitioner"
                        ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        : "border-neutral-800"
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            01
                          </span>

                          {selectedArchetype === "transitioner" && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-base mt-4 mb-2">
                          Full-Time Transitioner
                        </h4>

                        <p className="text-[11px] text-slate-400 font-light leading-relaxed mb-4">
                          Dedicating 100% of your time to execute a major career
                          pivot without a standard corporate job.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-emerald-950/30">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          Focus Areas:
                        </div>

                        <ul className="text-[10px] text-slate-400 space-y-1 font-light">
                          <li>• Full-scale skill acquisition</li>

                          <li>• Job matching sprints</li>

                          <li>• Community networking</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Archetype 2: Working Parent */}

                  <div
                    onClick={() => setSelectedArchetype("parent")}
                    className={`transition-all duration-300 cursor-pointer border rounded-3xl p-5 relative flex flex-col justify-between select-none bg-[#0e2018] min-h-[350px] hover:border-emerald-800 ${
                      selectedArchetype === "parent"
                        ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        : "border-neutral-800"
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            02
                          </span>

                          {selectedArchetype === "parent" && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-base mt-4 mb-2">
                          Working Parent
                        </h4>

                        <p className="text-[11px] text-slate-400 font-light leading-relaxed mb-4">
                          Transitioning while handling childcare, home
                          management, and professional side projects / gigs.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-emerald-950/30">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          Focus Areas:
                        </div>

                        <ul className="text-[10px] text-slate-400 space-y-1 font-light">
                          <li>• Structured off-peak learning</li>

                          <li>• Family operation blocks</li>

                          <li>• Low-stress benchmarks</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Archetype 3: Early Career / Student */}

                  <div
                    onClick={() => setSelectedArchetype("student")}
                    className={`transition-all duration-300 cursor-pointer border rounded-3xl p-5 relative flex flex-col justify-between select-none bg-[#0e2018] min-h-[350px] hover:border-emerald-800 ${
                      selectedArchetype === "student"
                        ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        : "border-neutral-800"
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            03
                          </span>

                          {selectedArchetype === "student" && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-base mt-4 mb-2">
                          Early Career / Student
                        </h4>

                        <p className="text-[11px] text-slate-400 font-light leading-relaxed mb-4">
                          In learning phase, needing clear curations and
                          checkpoints to launch your technical career path.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-emerald-950/30">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          Focus Areas:
                        </div>

                        <ul className="text-[10px] text-slate-400 space-y-1 font-light">
                          <li>• Foundational Studious study</li>

                          <li>• Hands-on sandboxing</li>

                          <li>• Portfolio-building</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Archetype 4: Independent Consultant */}

                  <div
                    onClick={() => setSelectedArchetype("consultant")}
                    className={`transition-all duration-300 cursor-pointer border rounded-3xl p-5 relative flex flex-col justify-between select-none bg-[#0e2018] min-h-[350px] hover:border-emerald-800 ${
                      selectedArchetype === "consultant"
                        ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        : "border-neutral-800"
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            04
                          </span>

                          {selectedArchetype === "consultant" && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-base mt-4 mb-2">
                          Independent Consultant
                        </h4>

                        <p className="text-[11px] text-slate-400 font-light leading-relaxed mb-4">
                          Operating across multiple client streams; needs to
                          schedule routines to maintain peak professional
                          output.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-emerald-950/30">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          Focus Areas:
                        </div>

                        <ul className="text-[10px] text-slate-400 space-y-1 font-light">
                          <li>• Client delivery blocks</li>

                          <li>• Life operations & billing</li>

                          <li>• Context switch tuning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Archetype 5: Custom Archetype */}

                  <div
                    onClick={() => setSelectedArchetype("custom")}
                    className={`transition-all duration-300 cursor-pointer border rounded-3xl p-5 relative flex flex-col justify-between select-none bg-[#0e2018] min-h-[350px] hover:border-emerald-800 ${
                      selectedArchetype === "custom"
                        ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        : "border-neutral-800"
                    }`}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            05
                          </span>

                          {selectedArchetype === "custom" && (
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-base mt-4 mb-2">
                          Custom Archetype
                        </h4>

                        <p className="text-[11px] text-slate-400 font-light leading-relaxed mb-4">
                          Define your own parameters through a set of short,
                          targeted lifestyle questions.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-emerald-950/30">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          Focus Areas:
                        </div>

                        <ul className="text-[10px] text-slate-400 space-y-1 font-light">
                          <li>• Personal work status variables</li>

                          <li>• Dedicated commitments check</li>

                          <li>• Custom AI schedule calibration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extra Details text area */}

                <div className="w-full bg-[#0e2018]/80 /80 rounded-3xl p-6 mb-8 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-slate-350 mb-1.5 uppercase tracking-wide">
                    Tell us more about your target outcomes:
                  </h4>

                  <p className="text-xs text-slate-400 mb-4 font-light">
                    The more details you provide, the better our schedule
                    recommendations will be. Examples could be: you own a home,
                    aim for FIRE, want to learn a new technical skill (e.g.,
                    Next.js), or want to learn/practice a sport (e.g., tennis).
                  </p>

                  <textarea
                    value={archetypeDetails}
                    onChange={(e) => setArchetypeDetails(e.target.value)}
                    placeholder="e.g. I want to build a Next.js side project, hit my FIRE milestones, own a home, and practice tennis..."
                    className="w-full h-28 p-4 bg-[#06100c] rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleArchetypeSubmit}
                  className="px-8 py-3 bg-[#1b4332] text-white hover:bg-[#2d6a4f] border border-[#40916c]/30 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md self-end"
                >
                  Continue &rarr;
                </button>
              </div>
            )}

            {/* 3. CUSTOM QUESTIONS STEP */}

            {rhythmStep === "custom_questions" && (
              <div className="w-full max-w-xl bg-[#081510]/90 rounded-3xl p-8 backdrop-blur-sm shadow-2xl mt-12 animate-in fade-in duration-500">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  Personalize Profile & Sync Accounts
                </h3>

                <p className="text-sm text-slate-400 mb-8 font-light font-light">
                  Fine-tune your setup weights and connect your external
                  accounts for optimal schedule recommendations.
                </p>

                <div className="space-y-6">
                  {/* Q1 */}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      What is your current work status?
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      {["Not working", "Part-time", "Full-time"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setCustomAnswers({
                              ...customAnswers,
                              isWorking: val,
                            })
                          }
                          className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all ${
                            customAnswers.isWorking === val
                              ? "bg-[#1b4332]/25 border-emerald-500 text-white"
                              : "bg-[#06100c] border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Do you have other critical commitments outside of
                      employment?
                    </label>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setCustomAnswers({
                            ...customAnswers,
                            hasCommitments: true,
                          })
                        }
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                          customAnswers.hasCommitments
                            ? "bg-[#1b4332]/25 border-emerald-500 text-white"
                            : "bg-[#06100c] border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCustomAnswers({
                            ...customAnswers,
                            hasCommitments: false,
                          })
                        }
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                          !customAnswers.hasCommitments
                            ? "bg-[#1b4332]/25 border-emerald-500 text-white"
                            : "bg-[#06100c] border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        No
                      </button>
                    </div>

                    {customAnswers.hasCommitments && (
                      <div className="mt-3 animate-in fade-in duration-300">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Please describe these commitments:
                        </label>

                        <textarea
                          value={customAnswers.commitmentsDetails || ""}
                          onChange={(e) =>
                            setCustomAnswers({
                              ...customAnswers,
                              commitmentsDetails: e.target.value,
                            })
                          }
                          placeholder="e.g. Caring for young children, managing household logistics, elderly care..."
                          className="w-full h-20 p-3 bg-[#06100c] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Q3 */}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      How many years of professional experience do you have?
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                      {[
                        "0-2 years",
                        "3-5 years",
                        "6-10 years",
                        "10+ years",
                      ].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setCustomAnswers({
                              ...customAnswers,
                              yearsExperience: val,
                            })
                          }
                          className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition-all ${
                            customAnswers.yearsExperience === val
                              ? "bg-[#1b4332]/25 border-emerald-500 text-white"
                              : "bg-[#06100c] border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q4 */}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Any back-burner projects you want to address?
                    </label>

                    <p className="text-[10px] text-slate-400 mb-2">
                      e.g. establishing a trust, learning home or car
                      maintenance, completing registrations...
                    </p>

                    <textarea
                      value={customAnswers.backBurnerTasks || ""}
                      onChange={(e) =>
                        setCustomAnswers({
                          ...customAnswers,
                          backBurnerTasks: e.target.value,
                        })
                      }
                      placeholder="e.g. Draft family estate documents, schedule car servicing, repair deck lights..."
                      className="w-full h-20 p-3 bg-[#06100c] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                    />
                  </div>

                  {/* Google Calendar & Gmail Sync Integrations */}

                  <div className="pt-6 border-t border-emerald-950/20">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Sync Personal Accounts (Optional)
                    </label>

                    <p className="text-[10px] text-slate-400 mb-4 font-light leading-relaxed">
                      Connect your external workspace to automatically identify
                      committed slots (work shifts, meetings, doctor visits) and
                      analyze emails for time-bound deliverables.
                    </p>

                    <div className="space-y-3 mb-4">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={syncGoogleCalendar}
                          onChange={(e) =>
                            setSyncGoogleCalendar(e.target.checked)
                          }
                          className="h-4 w-4 rounded border-slate-800 bg-[#06100c] text-emerald-600 focus:ring-0"
                        />

                        <span className="text-xs text-slate-350">
                          Sync Google Calendar events (imports busy/standby
                          blocks)
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={syncGmail}
                          onChange={(e) => setSyncGmail(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-800 bg-[#06100c] text-emerald-600 focus:ring-0"
                        />

                        <span className="text-xs text-slate-300">
                          Analyze Gmail requests (auto-generate follow-up tasks)
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#06100c]/60 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${isGoogleConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-700"}`}
                        />

                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            {isGoogleConnected
                              ? "Connected to Google Workspace"
                              : "Workspace Integration"}
                          </p>

                          <p className="text-[10px] text-slate-400 font-light mt-0.5">
                            {isGoogleConnected
                              ? "Synced as active.user@gmail.com"
                              : "No active connection"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (isGoogleConnected) {
                            setIsGoogleConnected(false);

                            setSyncGoogleCalendar(false);

                            setSyncGmail(false);
                          } else {
                            setIsGoogleConnecting(true);

                            setTimeout(() => {
                              setIsGoogleConnecting(false);

                              setIsGoogleConnected(true);

                              setSyncGoogleCalendar(true);

                              setSyncGmail(true);
                            }, 1000);
                          }
                        }}
                        disabled={isGoogleConnecting}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                          isGoogleConnected
                            ? "bg-rose-955/20 border-rose-500/20 text-rose-450 hover:bg-rose-955/40"
                            : "bg-[#1b4332] hover:bg-[#2d6a4f] text-white border border-[#40916c]/30 shadow"
                        }`}
                      >
                        {isGoogleConnecting
                          ? "Connecting..."
                          : isGoogleConnected
                            ? "Disconnect"
                            : "Connect Google"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-emerald-950/20">
                  <button
                    onClick={() => setRhythmStep("archetype")}
                    className="text-xs text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider"
                  >
                    &larr; Back
                  </button>

                  <button
                    onClick={handleCustomQuestionsSubmit}
                    className="px-6 py-2.5 bg-[#1b4332] text-white hover:bg-[#2d6a4f] border border-[#40916c]/30 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                  >
                    Next Step &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* 4. CALENDAR BLOCKING STEP */}

            {rhythmStep === "calendar_blocking" && (
              <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in duration-500">
                <section className="text-center mb-8">
                  <h3 className="text-3xl font-black text-white tracking-tight">
                    Block out Unavailable Slots
                  </h3>

                  <p className="text-sm text-slate-400 mt-2 font-light">
                    Toggle slots where you are always busy (childcare, existing
                    jobs). Then, select your peak productivity window.
                  </p>
                </section>

                {isGoogleConnected && (
                  <div className="w-full mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📅</span>

                      <div>
                        <p className="text-xs font-bold text-emerald-400">
                          Google Calendar Synced
                        </p>

                        <p className="text-[10px] text-slate-400 font-light mt-0.5">
                          Imported 3 busy meetings from active.user@gmail.com
                          (Monday 9am, Wednesday 3pm, Friday 11am).
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold">
                      Auto-Blocked
                    </span>
                  </div>
                )}

                {/* Mode Selector group */}

                <div className="w-full bg-[#0e2018]/95 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-1">
                      Grid Selection Mode
                    </h4>

                    <p className="text-xs text-slate-400 font-light">
                      Choose a mode, then click time blocks below to paint your
                      calendar availability.
                    </p>
                  </div>

                  <div className="flex gap-3 bg-[#06100c] p-1.5 rounded-2xl  shrink-0">
                    <button
                      type="button"
                      onClick={() => setBlockingMode("unavailable")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        blockingMode === "unavailable"
                          ? "bg-rose-500/10 border border-rose-500/30 text-rose-455 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      Mark Unavailable (Red)
                    </button>

                    <button
                      type="button"
                      onClick={() => setBlockingMode("peak")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        blockingMode === "peak"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      Mark Peak Productivity (Emerald)
                    </button>
                  </div>
                </div>

                {/* 2-Hour Matrix Grid */}

                <div className="w-full bg-[#0e2018]/80 /80 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl mb-8 overflow-x-auto">
                  <div className="min-w-[640px]">
                    <div className="grid grid-cols-6 gap-3">
                      {/* Headers */}

                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest py-2">
                        Time Slot
                      </div>

                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ].map((d) => (
                        <div
                          key={d}
                          className="text-xs font-black text-slate-400 text-center uppercase tracking-widest py-2"
                        >
                          {d.substring(0, 3)}
                        </div>
                      ))}

                      {/* Rows for 2-hour increments */}

                      {[
                        "05:00-07:00",

                        "07:00-09:00",

                        "09:00-11:00",

                        "11:00-13:00",

                        "13:00-15:00",

                        "15:00-17:00",

                        "17:00-19:00",

                        "19:00-21:00",

                        "21:00-23:00",
                      ].map((slot) => (
                        <div key={slot} className="contents">
                          {/* Row Header */}

                          <div className="text-sm font-black text-slate-300 flex items-center pr-2">
                            {slot}
                          </div>

                          {/* Day Columns */}

                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                          ].map((day) => {
                            const id = `${day}-${slot}`;

                            const isBusy = busyBlocks.includes(id);

                            const isPeak = peakBlocks.includes(id);

                            let cellStyle =
                              "bg-[#06100c] border-slate-900 hover:border-slate-800 text-slate-650";

                            let label = "Free";

                            if (isBusy) {
                              cellStyle =
                                "bg-rose-500/10 border-rose-500/40 text-rose-455 font-bold shadow-[inset_0_0_10px_rgba(239,68,68,0.05)]";

                              label = "Busy";
                            } else if (isPeak) {
                              cellStyle =
                                "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]";

                              label = "Peak";
                            }

                            return (
                              <div
                                key={id}
                                onClick={() => toggleBlock(id)}
                                className={`py-4 rounded-xl border text-center cursor-pointer transition-all duration-200 ${cellStyle}`}
                              >
                                <span className="text-[10px] uppercase tracking-wider font-semibold">
                                  {label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between">
                  <button
                    onClick={() =>
                      setRhythmStep(
                        selectedArchetype === "custom"
                          ? "custom_questions"
                          : "archetype",
                      )
                    }
                    className="text-xs text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider"
                  >
                    &larr; Back
                  </button>

                  <button
                    onClick={handleGenerateSchedule}
                    disabled={isGeneratingEvents}
                    className="px-8 py-3 bg-[#1b4332] text-white hover:bg-[#2d6a4f] border border-[#40916c]/30 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {isGeneratingEvents
                      ? "Running AI Planner..."
                      : "Generate AI Weekly Rhythm &rarr;"}
                  </button>
                </div>
              </div>
            )}

            {rhythmStep === "weekly_schedule" && (
              <div className="w-full max-w-6xl flex flex-col gap-6 animate-in fade-in duration-500">
                {/* Header Control Panel */}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0e2018]/40 rounded-3xl p-6 backdrop-blur-sm">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-bold text-white tracking-tight">
                        Your Customized Weekly Calendar
                      </h4>
                    </div>

                    <p className="text-xs md:text-sm text-slate-400 mt-1 font-medium">
                      Feel free to drag/edit tasks below. Remember to click the
                      checkbox when completed!
                    </p>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setRhythmStep("archetype")}
                      className="flex-1 md:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700/50 transition-colors"
                    >
                      Edit Profile
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-rose-955/20 hover:bg-rose-955/40 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {/* Daily Agenda & Completion progress columns */}

                <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
                  {/* Left Column: Outlook Daily Focus Agenda (grouped by hour) */}

                  <div className="flex-grow bg-[#0e2018]/80 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Daily Outlook Agenda
                        </span>

                        <h4 className="text-lg font-bold text-white mt-0.5">
                          {simulatedToday} Focus Tasks
                        </h4>
                      </div>

                      {/* Day Selector override buttons */}

                      <div className="flex items-center gap-1 bg-[#0e2018] p-1 rounded-xl  shrink-0">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                        ].map((d) => (
                          <button
                            key={d}
                            onClick={() => {
                              setSimulatedToday(d as any);

                              setHasLoggedToday(loggedDays.includes(d));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              simulatedToday === d
                                ? "bg-[#1b4332] text-white shadow-md border border-[#40916c]/30"
                                : "text-slate-450 hover:text-slate-350"
                            }`}
                          >
                            {d.substring(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hourly List (Outlook view) */}

                    <div className="space-y-3">
                      {[
                        "05:00-07:00",

                        "07:00-09:00",

                        "09:00-11:00",

                        "11:00-13:00",

                        "13:00-15:00",

                        "15:00-17:00",

                        "17:00-19:00",

                        "19:00-21:00",

                        "21:00-23:00",
                      ].map((slot) => {
                        const ev = weeklyEvents.find(
                          (e) =>
                            e.day === simulatedToday && e.timeSlot === slot,
                        );

                        if (!ev || ev.title === "Empty Slot") {
                          return (
                            <div
                              key={slot}
                              className="flex gap-4 items-center p-3.5 rounded-2xl border border-dashed border-slate-900 bg-[#0e2018]/10"
                            >
                              <span className="text-sm font-bold text-slate-400 min-w-[85px]">
                                {slot}
                              </span>

                              <div className="flex-1 text-sm text-slate-400 italic">
                                Unscheduled Slot
                              </div>

                              <button
                                onClick={() => {
                                  setAddDay(simulatedToday);

                                  setAddSlot(slot);

                                  setShowAddModal(true);
                                }}
                                className="text-xs font-bold text-emerald-450 hover:underline px-3 py-1.5 rounded-lg bg-[#0e2018]  hover:border-slate-800 transition-colors"
                              >
                                + Add Task
                              </button>
                            </div>
                          );
                        }

                        const styles = getCategoryStyles(ev.category);

                        const isCommitted =
                          ev.title === "Committed Time" ||
                          ev.title.startsWith("Google Calendar");

                        if (isCommitted) {
                          return (
                            <div
                              key={slot}
                              className="flex gap-4 items-center p-3 rounded-2xl /60 bg-[#0e2018]/10 opacity-70"
                            >
                              {/* Time Slot header */}

                              <div className="shrink-0 min-w-[90px]">
                                <span className="text-sm font-bold text-slate-400 leading-none">
                                  {slot}
                                </span>
                              </div>

                              {/* Simple Text */}

                              <div className="flex-grow min-w-0">
                                <span className="text-xs md:text-sm font-medium text-slate-400">
                                  Personal Block
                                </span>
                              </div>
                            </div>
                          );
                        }

                        // Override Pulse task title and description for display

                        const isPulseTask =
                          ev.category.toLowerCase().trim() ===
                            "life operations" &&
                          (ev.title.toLowerCase().includes("pulse") ||
                            ev.title.toLowerCase().includes("newsletter") ||
                            ev.title.toLowerCase().includes("tech briefing") ||
                            ev.title.toLowerCase().includes("podcast") ||
                            ev.description
                              .toLowerCase()
                              .includes("tech newsletters") ||
                            ev.description
                              .toLowerCase()
                              .includes("audio feeds"));

                        const displayTitle = isPulseTask
                          ? 'Stay up to date: Refer to "The Pulse" tab'
                          : ev.title;

                        const displayDescription = isPulseTask
                          ? "Curated list of tech newsletter articles, trending discussions, and podcasts are available in the Pulse tab."
                          : ev.description;

                        const isWorkoutTask =
                          ev.category.toLowerCase().trim() ===
                            "health and fitness" ||
                          ev.title.toLowerCase().includes("workout") ||
                          ev.title.toLowerCase().includes("exercise") ||
                          ev.title.toLowerCase().includes("yoga") ||
                          ev.title.toLowerCase().includes("run") ||
                          ev.title.toLowerCase().includes("cardio") ||
                          ev.title.toLowerCase().includes("strength");

                        return (
                          <div
                            key={slot}
                            className={`flex gap-4 items-start p-4 rounded-2xl border transition-all ${
                              ev.completed
                                ? "border-slate-900/40 bg-[#0e2018]/10 opacity-60"
                                : "border-slate-850 bg-[#0e2018]/40 hover:border-slate-800"
                            }`}
                          >
                            {/* Checkbox */}

                            <div className="pt-1">
                              <input
                                type="checkbox"
                                checked={ev.completed}
                                onChange={() => toggleEventCompleted(ev.id)}
                                className="h-5 w-5 rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-0 cursor-pointer"
                              />
                            </div>

                            {/* Time Slot header */}

                            <div className="flex flex-col min-w-[90px] pt-0.5 shrink-0">
                              <span className="text-sm font-bold text-slate-350 leading-none">
                                {slot}
                              </span>

                              <span
                                className={`text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md mt-2 w-fit ${styles.tag} max-w-full truncate text-center`}
                              >
                                {ev.category}
                              </span>
                            </div>

                            {/* Description and edit details */}

                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h5
                                  className={`text-sm md:text-base font-extrabold text-slate-200 leading-snug ${ev.completed ? "line-through text-slate-450" : ""}`}
                                >
                                  {displayTitle}
                                </h5>

                                <button
                                  onClick={() => startEditingEvent(ev)}
                                  className="text-xs text-slate-350 hover:text-slate-200 font-bold uppercase tracking-wider shrink-0"
                                >
                                  Edit
                                </button>
                              </div>

                              <p
                                className={`text-xs md:text-sm text-slate-400 mt-1.5 font-medium leading-relaxed ${ev.completed ? "line-through text-slate-400" : ""}`}
                              >
                                {displayDescription}
                              </p>

                              {isWorkoutTask && (
                                <div className="mt-2.5 flex items-center">
                                  <a
                                    href={getWorkoutLink(ev.title).url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-emerald-450 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 font-semibold"
                                  >
                                    <span>🏋️</span>

                                    <span>
                                      {getWorkoutLink(ev.title).label}
                                    </span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Add Custom Event button */}

                    <button
                      onClick={() => {
                        setAddDay(simulatedToday);

                        setAddSlot("05:00-07:00");

                        setShowAddModal(true);
                      }}
                      className="mt-2 w-full py-3 border border-dashed border-slate-800 hover:border-slate-700 bg-[#06100c]/40 hover:bg-[#06100c] rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      + Add a task or custom event
                    </button>
                  </div>

                  {/* Right Column: Progress & Work Completed Today Box */}

                  <div className="w-full lg:w-80 shrink-0 bg-[#0e2018]/80 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl flex flex-col gap-6">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Performance & Streaks
                      </span>

                      <h4 className="text-lg font-bold text-white mt-0.5">
                        Rhythm Progress
                      </h4>
                    </div>

                    {/* Streak card */}

                    <div className="flex items-center gap-4 bg-[#0e2018] border border-orange-500/20 p-4 rounded-2xl shadow-inner">
                      <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 text-xl font-bold animate-pulse border border-orange-500/20">
                        🔥
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Accountability Streak
                        </p>

                        <p className="text-base font-black text-white">
                          {streakCount} {streakCount === 1 ? "Day" : "Days"}
                        </p>
                      </div>
                    </div>

                    {/* Progress details */}

                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>Today's Completion</span>

                        <span className="text-emerald-400">
                          {
                            weeklyEvents.filter(
                              (ev) =>
                                ev.day === simulatedToday &&
                                ev.title !== "Empty Slot" &&
                                ev.completed,
                            ).length
                          }{" "}
                          /{" "}
                          {
                            weeklyEvents.filter(
                              (ev) =>
                                ev.day === simulatedToday &&
                                ev.title !== "Empty Slot",
                            ).length
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-grow bg-[#0e2018]  rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-500 rounded-full"
                            style={{
                              width: `${
                                weeklyEvents.filter(
                                  (ev) =>
                                    ev.day === simulatedToday &&
                                    ev.title !== "Empty Slot",
                                ).length > 0
                                  ? Math.round(
                                      (weeklyEvents.filter(
                                        (ev) =>
                                          ev.day === simulatedToday &&
                                          ev.title !== "Empty Slot" &&
                                          ev.completed,
                                      ).length /
                                        weeklyEvents.filter(
                                          (ev) =>
                                            ev.day === simulatedToday &&
                                            ev.title !== "Empty Slot",
                                        ).length) *
                                        100,
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>

                        <span className="text-xs font-black text-slate-200 w-8 text-right">
                          {weeklyEvents.filter(
                            (ev) =>
                              ev.day === simulatedToday &&
                              ev.title !== "Empty Slot",
                          ).length > 0
                            ? Math.round(
                                (weeklyEvents.filter(
                                  (ev) =>
                                    ev.day === simulatedToday &&
                                    ev.title !== "Empty Slot" &&
                                    ev.completed,
                                ).length /
                                  weeklyEvents.filter(
                                    (ev) =>
                                      ev.day === simulatedToday &&
                                      ev.title !== "Empty Slot",
                                  ).length) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>

                    {/* Dedicated "Work Completed Today" list box */}

                    <div className="flex-grow flex flex-col gap-3 pt-4 border-t border-slate-900">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Work Completed Today
                      </label>

                      <div className="flex-grow overflow-y-auto max-h-[220px] space-y-2 pr-1">
                        {weeklyEvents.filter(
                          (ev) =>
                            ev.day === simulatedToday &&
                            ev.title !== "Empty Slot" &&
                            ev.completed,
                        ).length === 0 ? (
                          <div className="py-12 text-center text-xs text-slate-400 italic select-none">
                            No tasks completed yet.
                            <br />
                            Check items off in agenda.
                          </div>
                        ) : (
                          weeklyEvents

                            .filter(
                              (ev) =>
                                ev.day === simulatedToday &&
                                ev.title !== "Empty Slot" &&
                                ev.completed,
                            )

                            .map((ev) => (
                              <div
                                key={ev.id}
                                className="p-2.5 rounded-xl bg-emerald-950/10 border border-emerald-500/20 flex gap-2 items-center animate-in fade-in duration-300"
                              >
                                <span className="text-emerald-400 shrink-0 text-xs">
                                  ✓
                                </span>

                                <div className="min-w-0 flex-grow">
                                  <p className="text-[11px] font-bold text-slate-300 truncate">
                                    {ev.title}
                                  </p>

                                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                    {ev.timeSlot}
                                  </p>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Log Completion button */}

                    <div className="pt-4 border-t border-slate-900">
                      {hasLoggedToday ? (
                        <div className="py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4.5 w-4.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>

                          <span>Logged & Verified!</span>
                        </div>
                      ) : (
                        <button
                          onClick={logDayCompletion}
                          className={`w-full py-2.5 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md ${
                            weeklyEvents
                              .filter(
                                (ev) =>
                                  ev.day === simulatedToday &&
                                  ev.title !== "Empty Slot" &&
                                  ev.title !== "Committed Time",
                              )
                              .every((ev) => ev.completed) &&
                            weeklyEvents.filter(
                              (ev) =>
                                ev.day === simulatedToday &&
                                ev.title !== "Empty Slot" &&
                                ev.title !== "Committed Time",
                            ).length > 0
                              ? "bg-[#1b4332] hover:bg-[#2d6a4f] text-white border border-[#40916c]/30 cursor-pointer"
                              : "bg-[#06100c]  text-slate-650 cursor-not-allowed"
                          }`}
                        >
                          {weeklyEvents.filter(
                            (ev) =>
                              ev.day === simulatedToday &&
                              ev.title !== "Empty Slot" &&
                              ev.title !== "Committed Time",
                          ).length === 0
                            ? "Log Day Completed"
                            : weeklyEvents
                                  .filter(
                                    (ev) =>
                                      ev.day === simulatedToday &&
                                      ev.title !== "Empty Slot" &&
                                      ev.title !== "Committed Time",
                                  )
                                  .every((ev) => ev.completed)
                              ? `Log ${simulatedToday} Tasks`
                              : "agenda incomplete"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Schedule Weekly Grid Layout (Outlook style with lines) */}

                <div className="w-full bg-[#0e2018]/80 rounded-3xl p-6 md:p-8 backdrop-blur-sm overflow-x-auto shadow-2xl">
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                      Weekly Outlook Grid
                    </h4>

                    <p className="text-[10px] text-slate-400 font-light mt-0.5">
                      Click any block to expand details and customize
                      parameters. Drag items to swap schedules.
                    </p>
                  </div>

                  <div className="min-w-[800px] border-t border-l border-white/5 rounded-2xl overflow-hidden">
                    {/* Columns headers */}

                    <div className="grid grid-cols-6 items-stretch bg-[#0e2018]/30">
                      <div className="text-sm font-extrabold text-slate-400 uppercase tracking-widest p-4 text-left border-b border-r border-white/5">
                        Time Slot
                      </div>

                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ].map((day) => (
                        <div
                          key={day}
                          className="text-sm font-extrabold text-slate-200 uppercase tracking-wider text-center p-4 border-b border-r border-white/5 flex items-center justify-center"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* 2-Hour Calendar Rows */}

                    {[
                      { name: "Morning 1", slot: "05:00-07:00" },

                      { name: "Morning 2", slot: "07:00-09:00" },

                      { name: "Morning 3", slot: "09:00-11:00" },

                      { name: "Midday 1", slot: "11:00-13:00" },

                      { name: "Midday 2", slot: "13:00-15:00" },

                      { name: "Midday 3", slot: "15:00-17:00" },

                      { name: "Evening 1", slot: "17:00-19:00" },

                      { name: "Evening 2", slot: "19:00-21:00" },

                      { name: "Evening 3", slot: "21:00-23:00" },
                    ].map(({ name, slot }) => {
                      return (
                        <div
                          key={slot}
                          className="grid grid-cols-6 items-stretch"
                        >
                          {/* Row Header */}

                          <div className="text-sm md:text-base font-extrabold text-slate-300 p-4 bg-[#0e2018]/60 flex flex-col justify-center border-b border-r border-white/5">
                            <span>{name}</span>

                            <span className="text-xs md:text-sm font-medium text-slate-400 mt-1">
                              {slot}
                            </span>
                          </div>

                          {/* Days Cells */}

                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                          ].map((day) => {
                            const ev = weeklyEvents.find(
                              (e) => e.day === day && e.timeSlot === slot,
                            );

                            if (!ev || ev.title === "Empty Slot") {
                              return (
                                <div
                                  key={day}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) =>
                                    handleDrop(e, day as any, slot)
                                  }
                                  onClick={() => {
                                    setAddDay(day as any);

                                    setAddSlot(slot);

                                    setShowAddModal(true);
                                  }}
                                  className="border-b border-r border-white/5 min-h-[6.5rem] flex items-center justify-center bg-[#0e2018]/10 text-xs text-slate-400 select-none hover:bg-[#06100c]/20 cursor-pointer transition-colors"
                                >
                                  Open
                                </div>
                              );
                            }

                            const isCommitted =
                              ev.title === "Committed Time" ||
                              ev.title.startsWith("Google Calendar");

                            if (isCommitted) {
                              return (
                                <div
                                  key={day}
                                  className="border-b border-r border-white/5 min-h-[6.5rem] p-3 flex flex-col items-center justify-center bg-[#0e2018]/10 opacity-70 select-none text-center"
                                >
                                  <span className="text-[11px] md:text-xs font-semibold text-slate-405 leading-tight">
                                    Personal Block
                                  </span>
                                </div>
                              );
                            }

                            const isPulseTask =
                              ev.category.toLowerCase().trim() ===
                                "life operations" &&
                              (ev.title.toLowerCase().includes("pulse") ||
                                ev.title.toLowerCase().includes("newsletter") ||
                                ev.title
                                  .toLowerCase()
                                  .includes("tech briefing") ||
                                ev.title.toLowerCase().includes("podcast") ||
                                ev.description
                                  .toLowerCase()
                                  .includes("tech newsletters") ||
                                ev.description
                                  .toLowerCase()
                                  .includes("audio feeds"));

                            const cellTitle = isPulseTask
                              ? "Refer to Pulse"
                              : ev.title;

                            const styles = getCategoryStyles(ev.category);

                            return (
                              <div
                                key={day}
                                draggable
                                onDragStart={(e) => handleDragStart(e, ev.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day as any, slot)}
                                onClick={() => startEditingEvent(ev)}
                                className={`border-b border-r border-white/5 min-h-[6.5rem] p-3 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-[#0e2018]/40 ${styles.bg} ${
                                  ev.completed ? "opacity-45" : ""
                                }`}
                              >
                                <span
                                  className={`text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full text-center leading-none select-none max-w-full truncate ${styles.tag}`}
                                >
                                  {ev.category}
                                </span>

                                <span className="text-[11px] md:text-xs font-semibold text-slate-350 text-center leading-tight max-w-full line-clamp-2 px-1">
                                  {cellTitle.split(/\s+/).slice(0, 3).join(" ")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Inline Editing Drawer / Container */}

                {editingEventId && (
                  <div className="w-full bg-[#081510]/90 rounded-3xl p-6 md:p-8 backdrop-blur-sm animate-in slide-in-from-bottom duration-300 shadow-xl">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-900">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Modify Block Task Details
                      </span>

                      <button
                        onClick={() => setEditingEventId(null)}
                        className="text-xs text-slate-400 hover:text-slate-350"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Category
                        </label>

                        <select
                          value={
                            [
                              "career",
                              "learning",
                              "health and fitness",
                              "life operations",
                              "social / networking",
                              "miscellaneous",
                              "custom",
                            ].includes(editCategory)
                              ? editCategory
                              : "custom"
                          }
                          onChange={(e) => {
                            const val = e.target.value;

                            if (val === "custom") {
                              setEditCategory("custom");

                              setCustomCategoryEditInput("");
                            } else {
                              setEditCategory(val);
                            }
                          }}
                          className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="career">Career</option>

                          <option value="learning">Learning</option>

                          <option value="health and fitness">
                            Health and Fitness
                          </option>

                          <option value="life operations">
                            Life Operations
                          </option>

                          <option value="social / networking">
                            Social / Networking
                          </option>

                          <option value="miscellaneous">Miscellaneous</option>

                          <option value="custom">
                            + Add Custom Category...
                          </option>
                        </select>

                        {editCategory === "custom" && (
                          <input
                            type="text"
                            placeholder="Enter custom category..."
                            value={customCategoryEditInput}
                            onChange={(e) =>
                              setCustomCategoryEditInput(e.target.value)
                            }
                            className="mt-2 w-full px-3 py-2 bg-[#0e2018] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600"
                          />
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Task Title
                        </label>

                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Action Details
                      </label>

                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Workout reference link inside the edit drawer */}

                    {(editCategory.toLowerCase().trim() ===
                      "health and fitness" ||
                      editTitle.toLowerCase().includes("workout") ||
                      editTitle.toLowerCase().includes("exercise") ||
                      editTitle.toLowerCase().includes("yoga") ||
                      editTitle.toLowerCase().includes("run") ||
                      editTitle.toLowerCase().includes("cardio") ||
                      editTitle.toLowerCase().includes("strength")) && (
                      <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🏋️</span>

                          <div>
                            <p className="text-xs font-bold text-emerald-400">
                              Workout Reference Aligned
                            </p>

                            <p className="text-[10px] text-slate-400 font-light mt-0.5">
                              Recommended training resource (20 min to 1 hour):
                            </p>
                          </div>
                        </div>

                        <a
                          href={getWorkoutLink(editTitle).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all"
                        >
                          {getWorkoutLink(editTitle).label.split(" (")[0]}
                        </a>
                      </div>
                    )}

                    {/* Pulse redirection notice inside the edit drawer */}

                    {editCategory.toLowerCase().trim() === "life operations" &&
                      (editTitle.toLowerCase().includes("pulse") ||
                        editTitle.toLowerCase().includes("newsletter") ||
                        editTitle.toLowerCase().includes("podcast") ||
                        editDesc.toLowerCase().includes("newsletter") ||
                        editTitle.toLowerCase().includes("up to date")) && (
                        <div className="mb-6 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">📰</span>

                            <div>
                              <p className="text-xs font-bold text-sky-400">
                                Pulse Integration Notice
                              </p>

                              <p className="text-[10px] text-slate-400 font-light mt-0.5">
                                This block is configured to reference your
                                centralized news feeds.
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTab("pulse");

                              setEditingEventId(null);
                            }}
                            className="px-3 py-1.5 bg-sky-500 text-slate-950 text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all"
                          >
                            Go to The Pulse
                          </button>
                        </div>
                      )}

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => deleteEvent(editingEventId)}
                        className="px-4 py-2 bg-rose-955/20 hover:bg-rose-955/40 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/20 transition-all"
                      >
                        Clear Event Block
                      </button>

                      <button
                        onClick={saveEditedEvent}
                        className="px-6 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] border border-[#40916c]/30 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Save Task Updates
                      </button>
                    </div>
                  </div>
                )}

                {/* Add Custom Event Dialog Form */}

                {showAddModal && (
                  <div className="w-full bg-[#081510]/90 rounded-3xl p-6 md:p-8 backdrop-blur-sm animate-in slide-in-from-bottom duration-300 shadow-xl">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-900">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Add Custom Event Block
                      </span>

                      <button
                        onClick={() => setShowAddModal(false)}
                        className="text-xs text-slate-400 hover:text-slate-350"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Day
                        </label>

                        <select
                          value={addDay}
                          onChange={(e) => setAddDay(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="Monday">Monday</option>

                          <option value="Tuesday">Tuesday</option>

                          <option value="Wednesday">Wednesday</option>

                          <option value="Thursday">Thursday</option>

                          <option value="Friday">Friday</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Time Slot
                        </label>

                        <select
                          value={addSlot}
                          onChange={(e) => setAddSlot(e.target.value as any)}
                          className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="05:00-07:00">05:00-07:00</option>

                          <option value="07:00-09:00">07:00-09:00</option>

                          <option value="09:00-11:00">09:00-11:00</option>

                          <option value="11:00-13:00">11:00-13:00</option>

                          <option value="13:00-15:00">13:00-15:00</option>

                          <option value="15:00-17:00">15:00-17:00</option>

                          <option value="17:00-19:00">17:00-19:00</option>

                          <option value="19:00-21:00">19:00-21:00</option>

                          <option value="21:00-23:00">21:00-23:00</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Category
                        </label>

                        <select
                          value={
                            [
                              "career",
                              "learning",
                              "health and fitness",
                              "life operations",
                              "social / networking",
                              "miscellaneous",
                              "custom",
                            ].includes(addCategory)
                              ? addCategory
                              : "custom"
                          }
                          onChange={(e) => {
                            const val = e.target.value;

                            if (val === "custom") {
                              setAddCategory("custom");

                              setCustomCategoryAddInput("");
                            } else {
                              setAddCategory(val);
                            }
                          }}
                          className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="career">Career</option>

                          <option value="learning">Learning</option>

                          <option value="health and fitness">
                            Health and Fitness
                          </option>

                          <option value="life operations">
                            Life Operations
                          </option>

                          <option value="social / networking">
                            Social / Networking
                          </option>

                          <option value="miscellaneous">Miscellaneous</option>

                          <option value="custom">
                            + Add Custom Category...
                          </option>
                        </select>

                        {addCategory === "custom" && (
                          <input
                            type="text"
                            placeholder="Enter custom category..."
                            value={customCategoryAddInput}
                            onChange={(e) =>
                              setCustomCategoryAddInput(e.target.value)
                            }
                            className="mt-2 w-full px-3 py-2 bg-[#0e2018] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Task Title
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Property Tax Review"
                          value={addTitle}
                          onChange={(e) => setAddTitle(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Action Details
                      </label>

                      <input
                        type="text"
                        placeholder="Brief summary of what you need to explore..."
                        value={addDesc}
                        onChange={(e) => setAddDesc(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#0e2018] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <button
                      onClick={handleAddCustomEvent}
                      className="px-6 py-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] border border-[#40916c]/30 text-white text-xs font-bold rounded-xl transition-all shadow-md self-end"
                    >
                      Schedule Task
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* THE PULSE VIEW */}

        {activeTab === "pulse" && (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-stretch pt-8 animate-in fade-in duration-500 gap-6">
            <section className="text-center mb-6">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                The Pulse.
              </h2>

              <p className="text-slate-300 text-xl font-light max-w-3xl mx-auto leading-relaxed">
                Your consolidated dashboard for real-time news, relevant
                podcasts, and key posts from a curated mix of tech influencers,
                journalists, and news aggregators.
              </p>
            </section>

            {/* Unified Pulse Layout: Grid System */}

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: News Section */}

              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-[#0e2018]/90 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col gap-6">
                  {/* Collapsible Section Header (No Icon Badge) */}

                  <button
                    onClick={() => setNewsSectionExpanded(!newsSectionExpanded)}
                    className="flex justify-between items-center w-full text-left pb-4 border-b border-slate-900/60 group"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                        Daily Global & Tech News
                      </h3>

                      <p className="text-sm text-slate-400 font-light mt-1">
                        Top 10 daily briefings to keep you updated and educated.
                      </p>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${newsSectionExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {newsSectionExpanded && (
                    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      {dailyNewsData.slice(0, 3).map((dayData) => {
                        const isDayExpanded = expandedDays[dayData.date];

                        return (
                          <div
                            key={dayData.date}
                            className="rounded-2xl bg-[#0e2018]/55 overflow-hidden transition-all duration-300 hover:bg-[#0e2018]/75 hover:shadow-md"
                          >
                            <button
                              onClick={() =>
                                setExpandedDays((prev) => ({
                                  ...prev,
                                  [dayData.date]: !prev[dayData.date],
                                }))
                              }
                              className="w-full px-5 py-4 flex items-center justify-between bg-black/20 hover:bg-black/40 transition-colors text-left border-b border-slate-900/40"
                            >
                              <div className="flex items-center gap-3">
                                {/* Removed status indicator dot */}

                                <div>
                                  <span className="text-base font-bold text-slate-200">
                                    {dayData.date}
                                  </span>

                                  {dayData.isToday && (
                                    <span className="ml-3 text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-455 border border-emerald-500/20">
                                      Today's Feed
                                    </span>
                                  )}

                                  {!dayData.isToday && (
                                    <span className="ml-3 text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#0e2018]/80 text-slate-400">
                                      Archived Feed
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-400 font-medium">
                                  {dayData.news.length} Briefings
                                </span>

                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-5 w-5 text-slate-400 transition-transform duration-355 ${isDayExpanded ? "rotate-180" : ""}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </button>

                            {isDayExpanded && (
                              <div className="p-5 flex flex-col gap-5 bg-transparent max-h-[560px] overflow-y-auto pr-2 custom-scrollbar">
                                {dayData.news.map((item) => (
                                  <div
                                    key={item.id}
                                    className="group flex flex-col md:flex-row gap-5 p-5 rounded-2xl bg-[#0e2018]/30 hover:bg-[#0e2018]/60 transition-all duration-300"
                                  >
                                    <div className="flex md:flex-col items-center shrink-0">
                                      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-800/10 to-teal-700/5 text-emerald-455 flex items-center justify-center font-bold text-sm tracking-tight shadow-inner">
                                        {item.id < 10 ? `0${item.id}` : item.id}
                                      </div>
                                    </div>

                                    <div className="flex-grow min-w-0">
                                      <h4 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors leading-snug mb-2">
                                        {item.title}
                                      </h4>

                                      <p className="text-sm text-slate-350 font-normal leading-relaxed mb-3">
                                        {item.details}
                                      </p>

                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400 font-medium">
                                          Source:{" "}
                                          <span className="text-slate-305 font-semibold">
                                            {item.source}
                                          </span>
                                        </span>

                                        <a
                                          href={item.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm font-bold text-emerald-450 hover:text-emerald-400 hover:underline flex items-center gap-0.5 group/link"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          Visit Source
                                          <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">
                                            &rarr;
                                          </span>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Archived Feed Button */}

                      <button
                        onClick={() => setShowNewsArchiveModal(true)}
                        className="mt-2 w-full py-4 border border-dashed border-slate-800 hover:border-slate-700 bg-[#06100c]/20 hover:bg-[#06100c]/50 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 group/archive"
                      >
                        <span>📂 Archived Feed</span>

                        <span className="text-xs text-slate-400 font-normal transition-transform duration-200 group-hover/archive:translate-x-0.5">
                          &rarr;
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Podcasts Section */}

              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-[#0e2018]/90 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col gap-6">
                  {/* Collapsible Section Header (No Icon Badge) */}

                  <button
                    onClick={() =>
                      setPodcastsSectionExpanded(!podcastsSectionExpanded)
                    }
                    className="flex justify-between items-center w-full text-left pb-4 border-b border-slate-900/60 group"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                        Executive Audio Feeds
                      </h3>

                      <p className="text-sm text-slate-400 font-light mt-1">
                        Podcasts summaries and playlist compiler queue.
                      </p>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${podcastsSectionExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {podcastsSectionExpanded && (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Integrated Queue Playlist Player */}

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();

                          try {
                            const dataStr =
                              e.dataTransfer.getData("text/plain");

                            if (dataStr) {
                              const item = JSON.parse(dataStr);

                              setPlaylistQueue((prev) => {
                                if (prev.some((q) => q.id === item.id))
                                  return prev;

                                return [...prev, item];
                              });
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="bg-[#0e2018]/50 rounded-2xl p-5 flex flex-col gap-4"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                            Briefing Playlist Queue
                          </h4>

                          <p className="text-sm text-slate-400 font-light mt-1">
                            Drag episodes here or click + to compile your daily
                            queue.
                          </p>
                        </div>

                        {playlistQueue.length === 0 ? (
                          <div className="py-8 px-4 text-center border border-dashed border-slate-800 rounded-xl text-sm text-slate-500 italic select-none">
                            Queue is empty. Add episodes below.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4">
                               <div className="p-4 bg-black/30 rounded-xl flex flex-col gap-3">
                              {isQueuePlaying &&
                                currentQueueIndex >= 0 &&
                                currentQueueIndex < playlistQueue.length && (
                                  <div className="w-full flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-xs font-black text-emerald-450 uppercase tracking-widest">
                                      <span>Streaming playlist...</span>

                                      <div className="flex items-end gap-0.5 h-2.5 w-4">
                                        <div
                                          className="w-0.5 bg-emerald-500 rounded-full animate-bounce h-full"
                                          style={{ animationDuration: "0.8s" }}
                                        />

                                        <div
                                          className="w-0.5 bg-emerald-450 rounded-full animate-bounce h-1/2"
                                          style={{ animationDuration: "1.2s" }}
                                        />

                                        <div
                                          className="w-0.5 bg-emerald-500 rounded-full animate-bounce h-3/4"
                                          style={{ animationDuration: "0.9s" }}
                                        />
                                      </div>
                                    </div>

                                    <p className="text-base font-bold text-slate-200 truncate leading-tight">
                                      {playlistQueue[currentQueueIndex].title}
                                    </p>

                                    <p className="text-sm text-slate-400 truncate">
                                      {
                                        playlistQueue[currentQueueIndex]
                                          .podcastName
                                      }{" "}
                                      •{" "}
                                      {
                                        playlistQueue[currentQueueIndex]
                                          .duration
                                      }
                                    </p>

                                    {/* Play Progress Bar */}
                                    <div className="w-full bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden">
                                      <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-100"
                                        style={{ width: `${podcastPlayProgress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                              {/* Control Buttons & Volume */}

                              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/60 pt-3 mt-1">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={toggleQueuePlay}
                                    className="h-9 w-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all text-base"
                                  >
                                    {isQueuePlaying ? "⏸" : "▶"}
                                  </button>

                                  <button
                                    onClick={skipQueueNext}
                                    className="text-sm font-bold text-slate-300 hover:text-white"
                                  >
                                    Skip Next &raquo;
                                  </button>
                                </div>

                                {/* Volume slider and Mute button */}
                                <div className="flex items-center gap-2 bg-[#0e2018]/60 px-3 py-1 rounded-xl">
                                  <button
                                    onClick={() => setIsMuted((m) => !m)}
                                    className="text-slate-400 hover:text-white text-base focus:outline-none"
                                    title={isMuted ? "Unmute" : "Mute"}
                                  >
                                    {isMuted || volume === 0 ? "🔇" : volume < 0.4 ? "🔈" : volume < 0.7 ? "🔉" : "🔊"}
                                  </button>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value);
                                      setVolume(val);
                                      if (val > 0) setIsMuted(false);
                                    }}
                                    className="w-16 md:w-20 accent-emerald-500 cursor-pointer h-1 rounded-lg bg-slate-900 appearance-none"
                                  />
                                </div>

                                <span className="text-sm text-slate-400">
                                  {currentQueueIndex + 1} /{" "}
                                  {playlistQueue.length} items
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                              {playlistQueue.map((item, idx) => {
                                const isActive =
                                  isQueuePlaying && currentQueueIndex === idx;

                                return (
                                  <div
                                    key={`${item.id}-${idx}`}
                                    className={`flex justify-between items-center p-3 rounded-xl transition-all ${
                                      isActive
                                        ? "bg-emerald-500/10 text-emerald-455 font-bold"
                                        : "bg-[#0e2018]/45 text-slate-350"
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0 pr-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-500">
                                          {idx + 1 < 10
                                            ? `0${idx + 1}`
                                            : idx + 1}
                                        </span>

                                        <p className="text-sm truncate leading-tight text-slate-200">
                                          {item.title}
                                        </p>
                                      </div>

                                      <p className="text-sm text-slate-400 mt-1 truncate ml-6">
                                        {item.podcastName} • {item.duration}
                                      </p>
                                    </div>

                                    <button
                                      onClick={() => {
                                        setPlaylistQueue((prev) =>
                                          prev.filter(
                                            (_, qIdx) => qIdx !== idx,
                                          ),
                                        );

                                        if (currentQueueIndex === idx) {
                                          setCurrentQueueIndex((prevIdx) =>
                                            prevIdx >= playlistQueue.length - 1
                                              ? prevIdx - 1
                                              : prevIdx,
                                          );
                                        } else if (currentQueueIndex > idx) {
                                          setCurrentQueueIndex(
                                            (prevIdx) => prevIdx - 1,
                                          );
                                        }
                                      }}
                                      className="text-slate-500 hover:text-rose-450 text-sm font-bold p-1 transition-colors"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Podcasts Catalogue Accordion */}

                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest">
                          Podcast Catalogue
                        </label>

                        {podcastsData.map((podcast) => {
                          const isPodExpanded =
                            expandedPodcastId === podcast.id;

                          return (
                            <div
                              key={podcast.id}
                              className="rounded-2xl bg-[#0e2018]/55 overflow-hidden transition-all duration-300 hover:bg-[#0e2018]/75 hover:shadow-md"
                            >
                              <button
                                onClick={() =>
                                  setExpandedPodcastId(
                                    isPodExpanded ? null : podcast.id,
                                  )
                                }
                                className="w-full px-5 py-4 flex items-center justify-between bg-black/10 hover:bg-black/30 transition-colors text-left border-b border-slate-900/20"
                              >
                                <div className="pr-4">
                                  <h4 className="text-base font-bold text-slate-200 leading-snug">
                                    {podcast.title}
                                  </h4>

                                  <p className="text-sm text-slate-400 font-medium mt-1">
                                    Host: {podcast.host}
                                  </p>

                                  <p className="text-sm text-slate-350 font-light mt-1.5 max-w-sm md:max-w-md line-clamp-1">
                                    {podcast.desc}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-sm font-bold text-slate-400 bg-[#0e2018]/80 px-2 py-0.5 rounded-full">
                                    {podcast.episodes.length} Episodes
                                  </span>

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isPodExpanded ? "rotate-180" : ""}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>
                              </button>

                              {isPodExpanded && (
                                <div className="p-5 flex flex-col bg-black/10 animate-in fade-in duration-300">
                                  <p className="text-sm text-slate-300 font-light leading-relaxed mb-4">
                                    {podcast.desc}
                                  </p>

                                  <div className="space-y-2.5">
                                    {podcast.episodes.map((ep) => {
                                      const isQueued = playlistQueue.some(
                                        (q) => q.id === ep.id,
                                      );

                                      return (
                                        <div
                                          key={ep.id}
                                          draggable
                                          onDragStart={(e) => {
                                            e.dataTransfer.setData(
                                              "text/plain",
                                              JSON.stringify({
                                                id: ep.id,

                                                title: ep.title,

                                                duration: ep.duration,

                                                podcastName: podcast.title,
                                              }),
                                            );
                                          }}
                                          className="group/ep flex justify-between items-center p-3 rounded-xl bg-[#0e2018]/50 hover:bg-[#0e2018]/80 cursor-grab active:cursor-grabbing transition-all"
                                        >
                                          <div className="flex-1 min-w-0 pr-2">
                                            <p className="text-sm font-bold text-slate-200 group-hover/ep:text-white transition-colors truncate">
                                              {ep.title}
                                            </p>

                                            <p className="text-sm text-slate-400 mt-1">
                                              {ep.duration}
                                            </p>
                                          </div>

                                          <button
                                            onClick={() => {
                                              setPlaylistQueue((prev) => {
                                                if (
                                                  prev.some(
                                                    (q) => q.id === ep.id,
                                                  )
                                                )
                                                  return prev;

                                                return [
                                                  ...prev,
                                                  {
                                                    id: ep.id,
                                                    title: ep.title,
                                                    duration: ep.duration,
                                                    podcastName: podcast.title,
                                                  },
                                                ];
                                              });
                                            }}
                                            disabled={isQueued}
                                            className={`h-6 w-6 rounded-md flex items-center justify-center transition-all ${
                                              isQueued
                                                ? "bg-emerald-500/10 text-emerald-455"
                                                : "bg-[#0e2018]/90 text-slate-400 hover:text-white hover:bg-emerald-500/20"
                                            }`}
                                          >
                                            {isQueued ? "✓" : "+"}
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row: Key Voices Section (Full Width Grid, No Icon Badge) */}

              <div className="lg:col-span-12 flex flex-col gap-6">
                <div className="bg-[#0e2018]/90 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col gap-6">
                  {/* Section Collapsible Header */}

                  <button
                    onClick={() =>
                      setConsensusSectionExpanded(!consensusSectionExpanded)
                    }
                    className="flex justify-between items-center w-full text-left pb-4 border-b border-slate-900/60 group"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                        Key Voices
                      </h3>

                      <p className="text-sm text-slate-400 font-light mt-1">
                        Real-time industry insights and news updates from tech
                        leaders and news aggregators.
                      </p>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${consensusSectionExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {consensusSectionExpanded && (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      {/* Category Toggle Pills */}

                      <div className="flex flex-wrap gap-2.5">
                        {[
                          "AI Pioneers",

                          "Tech and Business Journalists",

                          "News Aggregators",
                        ].map((cat) => {
                          const isSelected =
                            selectedVoiceCategories.includes(cat);

                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedVoiceCategories((prev) =>
                                    prev.length > 1
                                      ? prev.filter((c) => c !== cat)
                                      : prev,
                                  );
                                } else {
                                  setSelectedVoiceCategories((prev) => [
                                    ...prev,
                                    cat,
                                  ]);
                                }
                              }}
                              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                                isSelected
                                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                                  : "bg-black/25 text-slate-400 /40 hover:text-slate-200 hover:bg-black/45"
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Voices Cards Grid */}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {xFeedData

                          .filter((account) =>
                            selectedVoiceCategories.includes(account.category),
                          )

                          .map((account) => {
                            const initials = account.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("");

                            const hasRealAvatar = account.avatar;

                            return (
                              <div
                                key={account.handle}
                                className="rounded-3xl bg-[#0e2018]/55 p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:bg-[#0e2018]/75 hover:shadow-xl"
                              >
                                <div>
                                  {/* Account Header */}

                                  <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="flex items-center gap-3.5">
                                      {hasRealAvatar ? (
                                        <img
                                          src={account.avatar}
                                          alt={account.name}
                                          className="h-11 w-11 rounded-full object-cover shrink-0 border border-white/[0.05]"
                                        />
                                      ) : (
                                        <div
                                          className={`h-11 w-11 rounded-full bg-gradient-to-br ${account.avatarColor} flex items-center justify-center text-sm font-black text-white shrink-0`}
                                        >
                                          {initials}
                                        </div>
                                      )}

                                      <div className="min-w-0">
                                        <h4 className="text-base font-extrabold text-slate-100 truncate leading-snug">
                                          {account.name}
                                        </h4>

                                        <p className="text-sm text-slate-450 truncate font-medium">
                                          {account.handle}
                                        </p>
                                      </div>
                                    </div>

                                    <span
                                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border shrink-0 ${
                                        account.category === "AI Pioneers"
                                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                          : account.category ===
                                              "Tech and Business Journalists"
                                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                                            : "bg-[#0e2018]/80 text-slate-400 border-slate-900/60"
                                      }`}
                                    >
                                      {account.category ===
                                      "Tech and Business Journalists"
                                        ? "Tech & Business"
                                        : account.category === "AI Pioneers"
                                          ? "AI Pioneer"
                                          : "News"}
                                    </span>
                                  </div>

                                  {/* Account Summary */}

                                  <p className="text-sm text-slate-350 font-light leading-relaxed mb-5 border-b border-slate-900/60 pb-4">
                                    {account.summary}
                                  </p>

                                  {/* Latest Tweets Stack (Show the last two most recent posts) */}

                                  <div className="flex flex-col gap-4">
                                    {account.tweets
                                      .slice(0, 2)
                                      .map((tweet, idx) => (
                                        <div
                                          key={tweet.id}
                                          className="p-4 rounded-2xl bg-black/15 flex flex-col gap-2.5 shadow-inner"
                                        >
                                          <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-450 font-bold tracking-wide">
                                              {idx === 0
                                                ? "Latest Post"
                                                : "Previous Post"}
                                            </span>

                                            <span className="text-slate-500">
                                              {tweet.timestamp}
                                            </span>
                                          </div>

                                          <p className="text-sm text-slate-205 font-light leading-relaxed select-text">
                                            {tweet.text}
                                          </p>

                                          <div className="flex items-center gap-4 text-xs text-slate-450 pt-1 font-medium">
                                            <span>💬 Reply</span>

                                            <span>🔁 {tweet.retweets}</span>

                                            <span>❤️ {tweet.likes}</span>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>

                                {/* Secondary Tweet Toggle button if available */}

                                {account.tweets.length > 2 && (
                                  <button
                                    onClick={() => {
                                      setSelectedModalPodcast({
                                        title: `${account.name} on X`,

                                        host: account.handle,

                                        desc: account.summary,

                                        episodes: account.tweets.map((tw) => ({
                                          id: tw.id,

                                          title: tw.text,

                                          duration: `❤️ ${tw.likes}  •  🔁 ${tw.retweets}  •  ${tw.timestamp}`,
                                        })),
                                      });
                                    }}
                                    className="w-full text-center mt-4 pt-3 border-t border-slate-900/40 text-sm font-bold text-sky-400 hover:text-sky-305 hover:underline transition-colors"
                                  >
                                    View all posts &rarr;
                                  </button>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal for Full Episodes List & X Feed Archives (Reused component) */}

            {selectedModalPodcast && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-[#0e2018] rounded-3xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-6 max-h-[85vh]">
                  <div className="flex justify-between items-start pb-4 border-b border-slate-900/60">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight">
                        {selectedModalPodcast.title}
                      </h4>

                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {selectedModalPodcast.host.startsWith("@")
                          ? "Recent X Feed History"
                          : `Full Episode Catalogue • Host: ${selectedModalPodcast.host}`}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedModalPodcast(null)}
                      className="text-slate-400 hover:text-white font-bold text-sm p-1"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-1 flex-grow custom-scrollbar">
                    {selectedModalPodcast.episodes.map(
                      (ep: any, idx: number) => {
                        const isTweet =
                          selectedModalPodcast.host.startsWith("@");

                        if (isTweet) {
                          return (
                            <div
                              key={ep.id}
                              className="p-4 rounded-2xl bg-[#0e2018]/45 flex flex-col gap-2"
                            >
                              <p className="text-sm text-slate-200 leading-relaxed select-text">
                                {ep.title}
                              </p>

                              <span className="text-sm text-slate-450 font-semibold">
                                {ep.duration}
                              </span>
                            </div>
                          );
                        }

                        const isQueued = playlistQueue.some(
                          (q) => q.id === ep.id,
                        );

                        return (
                          <div
                            key={ep.id}
                            className="flex justify-between items-center p-3.5 rounded-2xl bg-[#0e2018]/45"
                          >
                            <div className="flex-1 min-w-0 pr-3">
                              <span className="text-sm font-bold text-slate-450 mr-2">
                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                              </span>

                              <span className="text-sm font-bold text-slate-200">
                                {ep.title}
                              </span>

                              <p className="text-sm text-slate-450 mt-1 ml-6">
                                {ep.duration}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setPlaylistQueue((prev) => {
                                  if (prev.some((q) => q.id === ep.id))
                                    return prev;

                                  return [
                                    ...prev,
                                    {
                                      id: ep.id,
                                      title: ep.title,
                                      duration: ep.duration,
                                      podcastName: selectedModalPodcast.title,
                                    },
                                  ];
                                });
                              }}
                              disabled={isQueued}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                isQueued
                                  ? "bg-emerald-500/10 text-emerald-455"
                                  : "bg-[#0e2018]/90 text-slate-300 hover:text-white hover:bg-[#1b4332]"
                              }`}
                            >
                              {isQueued ? "Queued" : "+ Queue"}
                            </button>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Archived Feed (10-Day History) */}

            {showNewsArchiveModal && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-[#0e2018] rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-6 max-h-[85vh]">
                  <div className="flex justify-between items-start pb-4 border-b border-slate-900/60">
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight">
                        Archived Feed
                      </h4>

                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Last 10 Days of News briefings
                      </p>
                    </div>

                    <button
                      onClick={() => setShowNewsArchiveModal(false)}
                      className="text-slate-400 hover:text-white font-bold text-sm p-1"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-1 flex-grow custom-scrollbar">
                    {dailyNewsData.map((dayData) => {
                      const isDayExpanded = expandedDays[dayData.date];

                      return (
                        <div
                          key={`archive-${dayData.date}`}
                          className="rounded-2xl bg-[#0e2018]/55 overflow-hidden transition-all duration-300"
                        >
                          <button
                            onClick={() =>
                              setExpandedDays((prev) => ({
                                ...prev,
                                [dayData.date]: !prev[dayData.date],
                              }))
                            }
                            className="w-full px-4 py-3.5 flex items-center justify-between bg-black/25 hover:bg-black/45 transition-colors text-left border-b border-slate-900/20"
                          >
                            <div className="flex items-center gap-3">
                              {/* Removed status indicator dot */}

                              <div>
                                <span className="text-sm font-bold text-slate-200">
                                  {dayData.date}
                                </span>

                                {dayData.isToday && (
                                  <span className="ml-2 text-xs uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-455">
                                    Today's Feed
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-400">
                                {dayData.news.length} Briefings
                              </span>

                              <svg
                                xmlns="http://www.w3.org/2050/svg"
                                className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-355 ${isDayExpanded ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </button>

                          {isDayExpanded && (
                            <div className="p-4 flex flex-col gap-3 bg-[#06100c]/40 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                              {dayData.news.map((item) => (
                                <div
                                  key={`archive-item-${dayData.date}-${item.id}`}
                                  className="group flex flex-col md:flex-row gap-3 p-3.5 rounded-xl bg-[#06100c]/45 hover:bg-[#0e2018]/75 transition-all duration-300"
                                >
                                  <div className="flex md:flex-col items-center shrink-0">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-emerald-800/20 to-teal-700/10 text-emerald-455 flex items-center justify-center font-bold text-xs tracking-tight shadow-inner">
                                      {item.id < 10 ? `0${item.id}` : item.id}
                                    </div>
                                  </div>

                                  <div className="flex-grow min-w-0">
                                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-snug mb-1">
                                      {item.title}
                                    </h4>

                                    <p className="text-xs text-slate-350 font-normal leading-relaxed mb-2">
                                      {item.details}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-slate-400 font-medium">
                                        Source:{" "}
                                        <span className="text-slate-300 font-semibold">
                                          {item.source}
                                        </span>
                                      </span>

                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-emerald-450 hover:text-emerald-400 hover:underline flex items-center gap-0.5 group/link"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Visit Source
                                        <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-0.5">
                                          &rarr;
                                        </span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* THE PLAYGROUND VIEW */}

        {activeTab === "playground" && (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-stretch pt-8 animate-in fade-in duration-500 gap-6">
            {/* Header Dashboard Banner */}

            <section className="relative overflow-hidden rounded-3xl bg-[#0e2018]/90  p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent pointer-events-none" />

              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                  The Playground.
                </h2>

                <p className="text-slate-350 text-base md:text-lg font-light max-w-xl leading-relaxed">
                  Bite-sized, zero-code masterclasses. Spend 15 minutes watching
                  a tutorial, then practice hands-on using free versions of top
                  AI tools.
                </p>
              </div>

              {/* Progress Summary Dashboard */}

              <div className="w-full md:w-auto min-w-[280px] bg-black/40 /80 rounded-2xl p-5 flex flex-col gap-3.5 backdrop-blur-sm shadow-inner">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900/60 pb-2">
                  <span>Practice Progress</span>

                  <span className="text-emerald-450 font-extrabold">
                    {completedPlaygroundLessons.length} / 42 Lessons
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-550">
                      Practice Streak
                    </span>

                    <span className="text-lg font-black text-slate-200">
                      {playgroundStreak} Days
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-550">
                      Badges Earned
                    </span>

                    <span className="text-lg font-black text-slate-200">
                      {earnedBadgesCount} / 6
                    </span>
                  </div>
                </div>

                {/* Badge list snippet */}

                {earnedBadgesCount > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900/60">
                    {badges
                      .filter((b) => b.earned)
                      .map((b) => (
                        <span
                          key={b.id}
                          className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-white/10 text-white/95 tracking-wider"
                          title={b.desc}
                        >
                          {b.label}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </section>

            {/* Weekday Navigation Selector */}

            <div className="w-full overflow-x-auto custom-scrollbar pb-1">
              <div className="flex min-w-max md:w-full md:grid md:grid-cols-7 gap-2">
                {weekdays.map((dayName) => {
                  const isSelected = activePlaygroundDay === dayName;

                  const isToday = todayRealName === dayName;

                  // Count completed on this day

                  const dayLessons = playgroundAssignments.filter(
                    (a) => a.day === dayName,
                  );

                  const completedCount = dayLessons.filter((a) =>
                    completedPlaygroundLessons.includes(a.id),
                  ).length;

                  const fraction = `${completedCount}/6`;

                  return (
                    <button
                      key={dayName}
                      onClick={() => setActivePlaygroundDay(dayName as any)}
                      className={`flex-1 min-w-[110px] px-3 py-3 rounded-2xl border text-center transition-all duration-300 flex flex-col justify-center items-center gap-1 cursor-pointer select-none ${
                        isSelected
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)] font-extrabold"
                          : "bg-black/25 text-slate-400 border-slate-900/40 hover:text-slate-200 hover:bg-black/45"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="text-xs uppercase tracking-wider">
                          {dayName}
                        </span>

                        {isToday && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-300">
                            Today
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] ${completedCount === 6 ? "text-emerald-400 font-extrabold" : "text-slate-500 font-medium"}`}
                      >
                        {fraction} Done
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Matrix Grid: 6 Categories */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playgroundAssignments

                .filter((a) => a.day === activePlaygroundDay)

                .map((lesson) => {
                  const isSelected =
                    selectedPlaygroundCategory === lesson.category;

                  const isCompleted = completedPlaygroundLessons.includes(
                    lesson.id,
                  );

                  const meta = categoryMeta[lesson.category];

                  return (
                    <div
                      key={lesson.id}
                      onClick={() =>
                        setSelectedPlaygroundCategory(lesson.category)
                      }
                      className={`cursor-pointer rounded-3xl p-5 md:p-6 flex flex-col justify-between gap-5 transition-all duration-300 border relative ${
                        isSelected
                          ? `bg-[#0e2018] ${meta.activeBorderClass}`
                          : `bg-[#0e2018]/90 ${meta.borderClass} ${meta.bgClass}`
                      }`}
                    >
                      {/* Background light glow on active card */}

                      {isSelected && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-tr ${meta.glowClass} rounded-3xl -z-10 pointer-events-none`}
                        />
                      )}

                      <div>
                        {/* Card Header Category Badge */}

                        <div className="flex justify-between items-center mb-3">
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${meta.badgeBg}`}
                          >
                            {lesson.categoryLabel}
                          </span>

                          {isCompleted && (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Completed
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-white leading-snug mb-2">
                          {lesson.title}
                        </h3>

                        <p className="text-sm text-slate-400 font-light line-clamp-2 leading-relaxed">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Card Footer Info */}

                      <div className="flex items-center justify-between border-t border-slate-900/60 pt-3.5 text-xs text-slate-500 font-medium">
                        <span>{lesson.creator}</span>

                        <div className="flex items-center gap-2">
                          <span>{lesson.duration}</span>

                          <span>•</span>

                          <span className="text-slate-400">
                            {lesson.toolName}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Focused Lesson Details Workspace */}

            {activeLesson &&
              (() => {
                const meta = categoryMeta[activeLesson.category];

                return (
                  <div
                    className={`w-full bg-[#0e2018]/95 border ${meta.activeBorderClass} rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row gap-6 transition-all duration-500 animate-in slide-in-from-bottom-3`}
                  >
                    {/* Left Column: Embed Player & Info */}

                    <div className="w-full lg:w-3/5 flex flex-col gap-5">
                      <div>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border ${meta.badgeBg}`}
                        >
                          {activeLesson.categoryLabel}
                        </span>

                        <h3 className="text-2xl font-black text-white tracking-tight mt-3 mb-2 leading-tight">
                          {activeLesson.title}
                        </h3>

                        <p className="text-sm text-slate-300 font-light leading-relaxed">
                          {activeLesson.description}
                        </p>
                      </div>

                      {/* Video Player Wrapper */}

                      <div className="w-full aspect-video rounded-2xl bg-black overflow-hidden  shadow-2xl">
                        <iframe
                          src={`https://www.youtube.com/embed/${activeLesson.youtubeId}`}
                          title={activeLesson.title}
                          className="w-full h-full border-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>

                      {/* Video Stats */}

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 font-medium bg-black/20 p-4 rounded-xl /40">
                        <div>
                          Creator:{" "}
                          <span className="text-slate-200 font-semibold">
                            {activeLesson.creator}
                          </span>
                        </div>

                        <div>
                          Duration:{" "}
                          <span className="text-slate-200 font-semibold">
                            {activeLesson.duration}
                          </span>
                        </div>

                        <div>
                          Views:{" "}
                          <span className="text-slate-200 font-semibold">
                            {activeLesson.views}
                          </span>
                        </div>

                        <div>
                          Rating:{" "}
                          <span className="text-slate-200 font-semibold">
                            {activeLesson.rating} / 5
                          </span>
                        </div>

                        <div>
                          Required Level:{" "}
                          <span className="text-slate-200 font-semibold">
                            {activeLesson.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Challenge Checklist & Launch Tool */}

                    <div className="w-full lg:w-2/5 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-slate-900/60 pt-6 lg:pt-0 lg:pl-8">
                      <div className="flex flex-col gap-5">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Step-by-Step Challenge
                          </h4>

                          <p className="text-xs text-slate-500 font-light">
                            Complete the video then check off tasks to build
                            familiarity.
                          </p>
                        </div>

                        {/* Checklist items */}

                        <div className="flex flex-col gap-3">
                          {activeLesson.steps.map((stepText, idx) => {
                            const isChecked = stepsChecked[idx] || false;

                            return (
                              <button
                                key={idx}
                                onClick={() =>
                                  handleToggleStep(activeLessonId, idx)
                                }
                                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 cursor-pointer group ${
                                  isChecked
                                    ? "bg-emerald-950/10 border-emerald-500/30 text-slate-200"
                                    : "bg-black/20 border-slate-900 hover:border-slate-800 text-slate-300"
                                }`}
                              >
                                <div
                                  className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                                    isChecked
                                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                      : "border-slate-700 group-hover:border-slate-500"
                                  }`}
                                >
                                  {isChecked && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>

                                <span
                                  className={`text-xs leading-relaxed font-normal ${isChecked ? "line-through text-slate-500" : ""}`}
                                >
                                  {stepText}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* CTAs and Complete Lesson */}

                      <div className="flex flex-col gap-4 mt-6">
                        {/* Open Free Tool Link */}

                        <a
                          href={activeLesson.toolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-4 text-center rounded-2xl text-xs font-bold tracking-wider transition-all duration-300 border flex items-center justify-center gap-2 ${meta.btnBgClass}`}
                        >
                          <span>Open Free {activeLesson.toolName}</span>

                          <span className="text-sm font-semibold">&rarr;</span>
                        </a>

                        {/* Completion Button */}

                        {(() => {
                          const isCompleted =
                            completedPlaygroundLessons.includes(activeLessonId);

                          return (
                            <button
                              onClick={() =>
                                handleToggleLessonCompletion(activeLessonId)
                              }
                              className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                                isCompleted
                                  ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20 hover:bg-emerald-500/20"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                              }`}
                            >
                              {isCompleted
                                ? "✓ Lesson Completed (Undo)"
                                : "Mark Lesson Completed"}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Badges Achievements Showcase Panel */}

            <section className="bg-[#0e2018]/90 rounded-3xl p-6 md:p-8  backdrop-blur-md shadow-xl flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-100 tracking-tight">
                  Your Mastery Badges
                </h3>

                <p className="text-sm text-slate-400 font-light mt-1">
                  Complete 2 or more lessons in any category to unlock
                  specialization badges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => {
                  const count =
                    badge.id === "app-creator"
                      ? appCompletedCount
                      : badge.id === "agent-engineer"
                        ? agentCompletedCount
                        : badge.id === "deep-researcher"
                          ? researchCompletedCount
                          : badge.id === "content-publisher"
                            ? writingCompletedCount
                            : badge.id === "data-specialist"
                              ? dataCompletedCount
                              : designCompletedCount;

                  return (
                    <div
                      key={badge.id}
                      className={`rounded-2xl p-4 border transition-all duration-300 flex items-center justify-between gap-4 ${
                        badge.earned
                          ? "bg-sky-500/5 border-sky-500/20 text-sky-400"
                          : "bg-black/10 border-slate-900 text-slate-500"
                      }`}
                    >
                      <div className="min-w-0">
                        <h4
                          className={`text-sm font-extrabold ${badge.earned ? "text-slate-100" : "text-slate-550"}`}
                        >
                          {badge.label}
                        </h4>

                        <p
                          className="text-[10px] text-slate-550 truncate leading-relaxed mt-0.5"
                          title={badge.desc}
                        >
                          {badge.desc}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-0.5">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            badge.earned
                              ? "bg-sky-500/15 text-sky-400"
                              : "bg-[#0e2018]/80 text-slate-600"
                          }`}
                        >
                          {badge.earned ? "Unlocked" : "Locked"}
                        </span>

                        <span className="text-[10px] font-bold text-slate-200 mt-0.5">
                          {count} / 7 done
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
