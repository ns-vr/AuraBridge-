import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Volume2,
  Heart,
  Pill,
  Droplets,
  MessageSquare,
  FileCheck2,
  CalendarCheck,
  Trophy,
  TrendingUp,
  BookOpen,
  Zap,
  Filter,
  Tag,
  Award,
  PartyPopper,
  X,
  RotateCcw,
  Check,
  Download,
  Copy,
  FileText,
  FileSpreadsheet,
  Share2,
  Bell,
  BellOff,
  BellRing,
  Clock,
  AlarmClock,
  Settings,
  CheckCheck,
  Sliders,
  VolumeX,
  AlertCircle,
  Timer,
  StickyNote,
  NotebookPen,
  NotebookTabs,
  Eye,
  EyeOff,
  Edit3,
  Send,
  History,
  Smile,
  Meh,
  Frown,
  CornerDownLeft,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { ActionChecklistItem, HabitNoteLog, UserProfile } from '../types';
import { speechService } from '../utils/speech';

export type HabitCategory =
  | 'All'
  | 'Health'
  | 'Learning'
  | 'Mindfulness'
  | 'Communication'
  | 'Focus'
  | 'Wellness'
  | 'Daily Habits';

export interface CategoryConfig {
  name: HabitCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
  textClass: string;
  borderClass: string;
  pillBg: string;
  pillBorder: string;
  darkBg: string;
  darkText: string;
  darkBorder: string;
}

export const HABIT_CATEGORIES: Record<string, CategoryConfig> = {
  Health: {
    name: 'Health',
    label: 'Health',
    icon: Pill,
    bgClass: 'bg-[#FDF2E9]',
    textClass: 'text-[#C25E2B]',
    borderClass: 'border-[#FAD7A0]',
    pillBg: 'bg-[#FDF2E9]',
    pillBorder: 'border-[#FAD7A0]',
    darkBg: 'bg-rose-950/40',
    darkText: 'text-rose-300',
    darkBorder: 'border-rose-700',
  },
  Learning: {
    name: 'Learning',
    label: 'Learning',
    icon: BookOpen,
    bgClass: 'bg-[#FEF3C7]',
    textClass: 'text-[#B45309]',
    borderClass: 'border-[#FDE68A]',
    pillBg: 'bg-[#FEF3C7]',
    pillBorder: 'border-[#FDE68A]',
    darkBg: 'bg-amber-950/40',
    darkText: 'text-amber-300',
    darkBorder: 'border-amber-700',
  },
  Mindfulness: {
    name: 'Mindfulness',
    label: 'Mindfulness',
    icon: Heart,
    bgClass: 'bg-[#EAF5EF]',
    textClass: 'text-[#245C3B]',
    borderClass: 'border-[#B2D8C3]',
    pillBg: 'bg-[#EAF5EF]',
    pillBorder: 'border-[#B2D8C3]',
    darkBg: 'bg-emerald-950/40',
    darkText: 'text-emerald-300',
    darkBorder: 'border-emerald-700',
  },
  Communication: {
    name: 'Communication',
    label: 'Communication',
    icon: MessageSquare,
    bgClass: 'bg-[#F3EDF5]',
    textClass: 'text-[#6B4E71]',
    borderClass: 'border-[#E4D7E8]',
    pillBg: 'bg-[#F3EDF5]',
    pillBorder: 'border-[#E4D7E8]',
    darkBg: 'bg-purple-950/40',
    darkText: 'text-purple-300',
    darkBorder: 'border-purple-700',
  },
  Focus: {
    name: 'Focus',
    label: 'Focus',
    icon: FileCheck2,
    bgClass: 'bg-[#EFF3FA]',
    textClass: 'text-[#2C5282]',
    borderClass: 'border-[#C8D6EC]',
    pillBg: 'bg-[#EFF3FA]',
    pillBorder: 'border-[#C8D6EC]',
    darkBg: 'bg-blue-950/40',
    darkText: 'text-blue-300',
    darkBorder: 'border-blue-700',
  },
  Wellness: {
    name: 'Wellness',
    label: 'Wellness',
    icon: Droplets,
    bgClass: 'bg-[#E6F4F6]',
    textClass: 'text-[#1D6A75]',
    borderClass: 'border-[#C2E3E8]',
    pillBg: 'bg-[#E6F4F6]',
    pillBorder: 'border-[#C2E3E8]',
    darkBg: 'bg-cyan-950/40',
    darkText: 'text-cyan-300',
    darkBorder: 'border-cyan-700',
  },
  'Daily Habits': {
    name: 'Daily Habits',
    label: 'Routine',
    icon: CalendarCheck,
    bgClass: 'bg-[#FAF7F2]',
    textClass: 'text-[#6B6355]',
    borderClass: 'border-[#EFE8DC]',
    pillBg: 'bg-[#FAF7F2]',
    pillBorder: 'border-[#EFE8DC]',
    darkBg: 'bg-zinc-900',
    darkText: 'text-zinc-300',
    darkBorder: 'border-zinc-700',
  },
};

export const PRESET_HABITS = [
  { label: 'Take medication on schedule', icon: Pill, tag: 'Health', defaultTime: '08:30' },
  { label: 'Read 1 simplified document summary', icon: BookOpen, tag: 'Learning', defaultTime: '10:00' },
  { label: '10-minute quiet mindfulness & breathing', icon: Heart, tag: 'Mindfulness', defaultTime: '12:30' },
  { label: 'Practice 2 phrases in AAC constructor', icon: MessageSquare, tag: 'Communication', defaultTime: '14:30' },
  { label: 'Check deadlines on pending notices', icon: FileCheck2, tag: 'Focus', defaultTime: '16:30' },
  { label: 'Drink 500ml water and hydrate', icon: Droplets, tag: 'Wellness', defaultTime: '18:00' },
];

export const formatTime12Hour = (time24?: string): string => {
  if (!time24) return '';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
};

// Streak milestone tiers and badges
const STREAK_MILESTONES = [
  { days: 3, title: 'Momentum Spark', badge: '⚡', desc: '3 consecutive days of showing up!' },
  { days: 5, title: 'Consistent Rhythm', badge: '🔥', desc: '5 solid days of building micro-habits!' },
  { days: 7, title: 'Weekly Champion', badge: '🏆', desc: 'One full week of unstoppable progress!' },
  { days: 10, title: 'Double Digits Master', badge: '🌟', desc: '10 days of sustained daily focus!' },
  { days: 14, title: 'Fortnight Habit Hero', badge: '💎', desc: 'Two solid weeks of healthy discipline!' },
  { days: 21, title: 'Habit Formed Legend', badge: '👑', desc: '21 days! Research shows your habits are now ingrained!' },
  { days: 30, title: 'Monthly Triumph', badge: '🚀', desc: 'A full month of daily goal excellence!' },
];

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
  lastCelebratedMilestone?: number;
}

interface DailyGoalsProps {
  checklists: ActionChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onAddChecklist: (item: ActionChecklistItem) => void;
  onUpdateChecklist?: (item: ActionChecklistItem) => void;
  onDeleteChecklist?: (id: string) => void;
  userProfile: UserProfile;
}

export const DailyGoals: React.FC<DailyGoalsProps> = ({
  checklists,
  onToggleChecklist,
  onAddChecklist,
  onUpdateChecklist,
  onDeleteChecklist,
  userProfile,
}) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('Health');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  
  // Celebration modal state
  const [celebrationModal, setCelebrationModal] = useState<{
    isOpen: boolean;
    streak: number;
    title: string;
    desc: string;
    badge: string;
  } | null>(null);

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'text' | 'csv'>('text');
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize streak from local storage
  const [streakData, setStreakData] = useState<StreakData>(() => {
    try {
      const saved = localStorage.getItem('aura_habit_streak_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      currentStreak: 5,
      bestStreak: 12,
      lastCompletedDate: null,
      lastCelebratedMilestone: 0,
    };
  });

  // Browser Notification & Scheduling state
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [scheduleModalItem, setScheduleModalItem] = useState<ActionChecklistItem | null>(null);
  const [scheduleModalTime, setScheduleModalTime] = useState<string>('09:00');
  const [scheduleModalEnabled, setScheduleModalEnabled] = useState<boolean>(true);

  const [newGoalReminderTime, setNewGoalReminderTime] = useState<string>('09:00');
  const [newGoalReminderEnabled, setNewGoalReminderEnabled] = useState<boolean>(true);

  const [activeReminderPrompt, setActiveReminderPrompt] = useState<ActionChecklistItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const lastNotifiedRef = useRef<Set<string>>(new Set());

  // Habit Notes & Quick Logs State
  const [showAllNotes, setShowAllNotes] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aura_show_habit_notes');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [expandedNoteIds, setExpandedNoteIds] = useState<Set<string>>(new Set());
  const [editingNoteItemId, setEditingNoteItemId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState<string>('');
  const [quickLogInputs, setQuickLogInputs] = useState<Record<string, string>>({});
  const [quickLogMoods, setQuickLogMoods] = useState<
    Record<string, 'great' | 'good' | 'neutral' | 'challenging'>
  >({});
  const [newGoalNotes, setNewGoalNotes] = useState<string>('');
  const [showNotesFeedModal, setShowNotesFeedModal] = useState<boolean>(false);
  const [notesFeedSearch, setNotesFeedSearch] = useState<string>('');
  const [promptQuickLogText, setPromptQuickLogText] = useState<string>('');

  // Toggle show/hide all habit notes across the dashboard
  const toggleShowAllNotes = () => {
    setShowAllNotes((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('aura_show_habit_notes', JSON.stringify(next));
      } catch {
        // ignore
      }
      showToast(
        next
          ? 'Showing habit notes & past quick logs on dashboard'
          : 'Hiding habit notes & past quick logs on dashboard'
      );
      return next;
    });
  };

  // Toggle notes expansion for a single habit item
  const toggleItemNotes = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedNoteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Start editing base note for a habit
  const handleStartEditNote = (item: ActionChecklistItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingNoteItemId(item.id);
    setEditingNoteValue(item.notes || '');
  };

  // Save base note for a habit
  const handleSaveNote = (itemId: string) => {
    const item = dailyGoals.find((g) => g.id === itemId);
    if (!item) return;
    const updated: ActionChecklistItem = {
      ...item,
      notes: editingNoteValue.trim() || undefined,
    };
    if (onUpdateChecklist) {
      onUpdateChecklist(updated);
    }
    setEditingNoteItemId(null);
    showToast(`Updated note for "${item.title.slice(0, 22)}..."`);
  };

  // Add a quick log entry with timestamp and optional mood
  const handleAddQuickLog = (
    itemId: string,
    customText?: string,
    customMood?: 'great' | 'good' | 'neutral' | 'challenging'
  ) => {
    const item = dailyGoals.find((g) => g.id === itemId);
    if (!item) return;

    const logText = customText !== undefined ? customText : quickLogInputs[itemId] || '';
    if (!logText.trim()) return;

    const mood = customMood || quickLogMoods[itemId] || 'good';
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newLog: HabitNoteLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: logText.trim(),
      timestamp: formattedTimestamp,
      mood: mood,
    };

    const updatedHistory = [newLog, ...(item.notesHistory || [])];
    const updated: ActionChecklistItem = {
      ...item,
      notes: item.notes || logText.trim(),
      notesHistory: updatedHistory,
    };

    if (onUpdateChecklist) {
      onUpdateChecklist(updated);
    }

    setQuickLogInputs((prev) => ({ ...prev, [itemId]: '' }));
    showToast(`📝 Saved quick log for "${item.title.slice(0, 22)}..."`);
  };

  // Delete a specific past log entry
  const handleDeleteLogEntry = (itemId: string, logId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const item = dailyGoals.find((g) => g.id === itemId);
    if (!item || !item.notesHistory) return;

    const updatedHistory = item.notesHistory.filter((l) => l.id !== logId);
    const updated: ActionChecklistItem = {
      ...item,
      notesHistory: updatedHistory,
    };

    if (onUpdateChecklist) {
      onUpdateChecklist(updated);
    }
    showToast(`Removed log entry`);
  };

  // Show a temporary toast notification banner
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Synthesize a pleasant harmonic chime via Web Audio API
  const playHabitChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Ignore if autoplay restricted
    }
  };

  // Request browser-native notification permission
  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Browser notifications are not supported in this browser environment.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        showToast('🎉 Native notifications enabled! Scheduled habit prompts will alert you.');
        playHabitChime();
        try {
          new Notification('Aura Habit Reminders Active 🔔', {
            body: "You'll receive native browser prompts when it's time for your scheduled habits!",
            icon: '/favicon.ico',
          });
        } catch {
          // ignore
        }
      } else if (permission === 'denied') {
        showToast('Browser notifications blocked. In-app audio & visual alerts remain active.');
      }
    } catch (e) {
      console.warn('Error requesting notification permission', e);
    }
  };

  // Send a habit notification (both native browser notification & in-app interactive prompt)
  const sendHabitNotification = (habit: ActionChecklistItem, isTest = false) => {
    playHabitChime();

    if (userProfile.accessibility.voiceGuidance || isTest) {
      speechService.speak(
        `Reminder: It's time for your habit: ${habit.title}. Keep your streak going!`
      );
    }

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        const timeLabel = habit.reminderTime ? formatTime12Hour(habit.reminderTime) : 'now';
        const notification = new Notification(`Aura Habit Prompt: ${habit.title}`, {
          body: isTest
            ? `[Test Alert] Scheduled for ${timeLabel}. Category: ${habit.category}. Keep your ${streakData.currentStreak}-day streak going!`
            : `Time to complete your ${habit.category} habit (${timeLabel})! Keep your ${streakData.currentStreak}-day streak going 🔥`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `aura-habit-${habit.id}`,
        });

        notification.onclick = () => {
          window.focus();
          setActiveReminderPrompt(habit);
          notification.close();
        };
      } catch (err) {
        console.warn('Native notification error', err);
      }
    }

    setActiveReminderPrompt(habit);
  };

  const accessibility = userProfile.accessibility;
  const prevCompletedRef = useRef<boolean>(false);

  // Trigger subtle, tasteful confetti burst
  const triggerConfetti = (intense: boolean = false) => {
    try {
      const colors = ['#C25E2B', '#E67E22', '#3A6B4F', '#D4AF37', '#93441B', '#FAD7A0'];
      
      confetti({
        particleCount: intense ? 60 : 35,
        spread: 60,
        origin: { y: 0.65, x: 0.35 },
        colors,
        disableForReducedMotion: true,
        scalar: 0.85,
        ticks: 200,
        gravity: 0.9,
      });

      setTimeout(() => {
        confetti({
          particleCount: intense ? 60 : 35,
          spread: 70,
          origin: { y: 0.65, x: 0.65 },
          colors,
          disableForReducedMotion: true,
          scalar: 0.85,
          ticks: 200,
          gravity: 0.9,
        });
      }, 150);
    } catch {
      // Graceful fallback if canvas is unsupported
    }
  };

  // Filter daily goals/habits from the centralized checklist state
  const dailyGoals = checklists.filter(
    (item) =>
      item.category === 'Daily Habits' ||
      item.category === 'Daily Goal' ||
      item.dueDate.toLowerCase() === 'today' ||
      item.id.startsWith('goal-') ||
      Boolean(HABIT_CATEGORIES[item.category])
  );

  // Apply active category filter
  const filteredGoals =
    activeCategoryFilter === 'All'
      ? dailyGoals
      : dailyGoals.filter((g) => {
          if (activeCategoryFilter === 'Daily Habits') {
            return g.category === 'Daily Habits' || g.category === 'Daily Goal';
          }
          return g.category.toLowerCase() === activeCategoryFilter.toLowerCase();
        });

  const completedCount = dailyGoals.filter((g) => g.isCompleted).length;
  const totalCount = dailyGoals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Track habit completions and milestone streak triggers
  useEffect(() => {
    if (isAllCompleted && !prevCompletedRef.current) {
      // User just finished all daily goals!
      triggerConfetti(false);

      setStreakData((prev) => {
        const todayStr = new Date().toISOString().slice(0, 10);
        if (prev.lastCompletedDate !== todayStr) {
          const updatedStreak = prev.currentStreak + 1;
          const updatedBest = Math.max(prev.bestStreak, updatedStreak);

          // Check if updatedStreak hits a milestone
          const milestone = STREAK_MILESTONES.find((m) => m.days === updatedStreak);
          if (milestone) {
            triggerConfetti(true);
            setCelebrationModal({
              isOpen: true,
              streak: updatedStreak,
              title: milestone.title,
              desc: milestone.desc,
              badge: milestone.badge,
            });
          }

          const updated: StreakData = {
            ...prev,
            currentStreak: updatedStreak,
            bestStreak: updatedBest,
            lastCompletedDate: todayStr,
          };
          localStorage.setItem('aura_habit_streak_data', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
    prevCompletedRef.current = isAllCompleted;
  }, [isAllCompleted]);

  // Manually celebrate a milestone on click
  const handleTriggerMilestoneCelebration = (days: number) => {
    const milestone = STREAK_MILESTONES.find((m) => m.days === days) || {
      days,
      title: `${days}-Day Habit Streak`,
      badge: '🔥',
      desc: `Incredible milestone of ${days} consecutive days completed!`,
    };

    triggerConfetti(true);
    setCelebrationModal({
      isOpen: true,
      streak: days,
      title: milestone.title,
      desc: milestone.desc,
      badge: milestone.badge,
    });
  };

  // Active Timer Checker: Checks every 10 seconds for habits whose reminderTime matches current time
  useEffect(() => {
    const checkScheduledHabits = () => {
      const now = new Date();
      const currentHH = String(now.getHours()).padStart(2, '0');
      const currentMM = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${currentHH}:${currentMM}`;
      const todayDateStr = now.toISOString().slice(0, 10);

      dailyGoals.forEach((goal) => {
        if (
          !goal.isCompleted &&
          goal.reminderEnabled !== false &&
          goal.reminderTime &&
          goal.reminderTime === currentHHMM
        ) {
          const notificationKey = `${goal.id}-${todayDateStr}-${currentHHMM}`;
          if (!lastNotifiedRef.current.has(notificationKey)) {
            lastNotifiedRef.current.add(notificationKey);
            sendHabitNotification(goal, false);
          }
        }
      });
    };

    checkScheduledHabits();
    const interval = setInterval(checkScheduledHabits, 10000);
    return () => clearInterval(interval);
  }, [dailyGoals, streakData.currentStreak, userProfile.accessibility.voiceGuidance]);

  // Open Schedule Modal for a specific habit
  const handleOpenScheduleModal = (item: ActionChecklistItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setScheduleModalItem(item);
    setScheduleModalTime(item.reminderTime || '09:00');
    setScheduleModalEnabled(item.reminderEnabled !== false);
  };

  // Save Schedule Modal
  const handleSaveScheduleModal = () => {
    if (!scheduleModalItem) return;
    const updated: ActionChecklistItem = {
      ...scheduleModalItem,
      reminderTime: scheduleModalTime,
      reminderEnabled: scheduleModalEnabled,
    };
    if (onUpdateChecklist) {
      onUpdateChecklist(updated);
    }
    showToast(
      `Scheduled "${updated.title.slice(0, 24)}..." for ${formatTime12Hour(scheduleModalTime)} (${
        scheduleModalEnabled ? 'Reminders On' : 'Reminders Muted'
      })`
    );
    setScheduleModalItem(null);
  };

  // Clear Schedule from Modal
  const handleClearScheduleModal = () => {
    if (!scheduleModalItem) return;
    const updated: ActionChecklistItem = {
      ...scheduleModalItem,
      reminderTime: undefined,
      reminderEnabled: false,
    };
    if (onUpdateChecklist) {
      onUpdateChecklist(updated);
    }
    showToast(`Removed scheduled reminder for "${updated.title.slice(0, 24)}..."`);
    setScheduleModalItem(null);
  };

  // Snooze active reminder by X minutes
  const handleSnoozePrompt = (minutes: number = 5) => {
    if (!activeReminderPrompt) return;
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const newHH = String(now.getHours()).padStart(2, '0');
    const newMM = String(now.getMinutes()).padStart(2, '0');
    const snoozedHHMM = `${newHH}:${newMM}`;

    const updated: ActionChecklistItem = {
      ...activeReminderPrompt,
      reminderTime: snoozedHHMM,
      reminderEnabled: true,
    };

    if (onUpdateChecklist) {
      onUpdateChecklist(updated);
    }

    showToast(`⏱️ Snoozed reminder for 5 minutes (until ${formatTime12Hour(snoozedHHMM)})`);
    setActiveReminderPrompt(null);
  };

  // Complete habit directly from prompt with optional log note
  const handleCompletePromptHabit = () => {
    if (!activeReminderPrompt) return;
    onToggleChecklist(activeReminderPrompt.id);
    
    // If user typed a quick log in the prompt modal, save it
    if (promptQuickLogText.trim()) {
      const now = new Date();
      const formattedTimestamp = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const newLog: HabitNoteLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: promptQuickLogText.trim(),
        timestamp: formattedTimestamp,
        mood: 'great',
      };

      const updatedHistory = [newLog, ...(activeReminderPrompt.notesHistory || [])];
      const updated: ActionChecklistItem = {
        ...activeReminderPrompt,
        isCompleted: true,
        notes: activeReminderPrompt.notes || promptQuickLogText.trim(),
        notesHistory: updatedHistory,
      };

      if (onUpdateChecklist) {
        onUpdateChecklist(updated);
      }
      setPromptQuickLogText('');
    }

    triggerConfetti(false);
    showToast(`✓ Marked "${activeReminderPrompt.title.slice(0, 25)}..." as completed! Streak kept alive 🔥`);
    setActiveReminderPrompt(null);
  };

  const handleAddGoal = (
    title: string,
    category: string = 'Health',
    reminderTime?: string,
    reminderEnabled: boolean = true,
    initialNote?: string
  ) => {
    if (!title.trim()) return;

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newGoal: ActionChecklistItem = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category: category,
      dueDate: 'Today',
      isCompleted: false,
      sourceDocName: 'Daily Habits Routine',
      priority: 'medium',
      reminderTime: reminderTime || undefined,
      reminderEnabled: Boolean(reminderTime && reminderEnabled),
      notes: initialNote?.trim() || undefined,
      notesHistory: initialNote?.trim()
        ? [
            {
              id: `log-${Date.now()}`,
              text: initialNote.trim(),
              timestamp: formattedTimestamp,
              mood: 'good',
            },
          ]
        : undefined,
    };

    onAddChecklist(newGoal);
    setNewGoalTitle('');
    setNewGoalNotes('');
    setIsAddingCustom(false);
    if (reminderTime && reminderEnabled) {
      showToast(`Added habit with reminder scheduled for ${formatTime12Hour(reminderTime)}`);
    } else {
      showToast(`Added habit "${title.slice(0, 24)}"`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddGoal(
      newGoalTitle,
      selectedTag,
      newGoalReminderTime,
      newGoalReminderEnabled,
      newGoalNotes
    );
  };

  const handleSpeakGoals = () => {
    if (dailyGoals.length === 0) {
      speechService.speak(
        `You have an active ${streakData.currentStreak} day streak. Tap a categorized suggestion to add your first habit today.`
      );
      return;
    }

    const pending = dailyGoals.filter((g) => !g.isCompleted);
    const completed = dailyGoals.filter((g) => g.isCompleted);

    let text = `You are on a ${streakData.currentStreak}-day streak! You have completed ${completed.length} of ${totalCount} habits today (${progressPercent}%). `;
    if (pending.length > 0) {
      text += `Remaining habits: ${pending.map((p) => `${p.title} in ${p.category}`).join(', ')}.`;
    } else {
      text += 'All your categorized habits are completed! Fantastic consistency today!';
    }

    speechService.speak(text);
  };

  const weekdays = [
    { day: 'Mon', key: 'mon', completed: true },
    { day: 'Tue', key: 'tue', completed: true },
    { day: 'Wed', key: 'wed', completed: true },
    { day: 'Thu', key: 'thu', completed: true },
    { day: 'Fri', key: 'fri', completed: true },
    { day: 'Sat', key: 'sat', isToday: true, completed: isAllCompleted },
    { day: 'Sun', key: 'sun', completed: false },
  ];

  const getCategoryConfig = (catName: string): CategoryConfig => {
    return (
      HABIT_CATEGORIES[catName] || {
        name: 'Daily Habits',
        label: catName,
        icon: CalendarCheck,
        bgClass: 'bg-[#FAF7F2]',
        textClass: 'text-[#6B6355]',
        borderClass: 'border-[#EFE8DC]',
        pillBg: 'bg-[#FAF7F2]',
        pillBorder: 'border-[#EFE8DC]',
        darkBg: 'bg-zinc-900',
        darkText: 'text-zinc-300',
        darkBorder: 'border-zinc-700',
      }
    );
  };

  const availableCategories: HabitCategory[] = [
    'All',
    'Health',
    'Learning',
    'Mindfulness',
    'Communication',
    'Focus',
    'Wellness',
  ];

  // Check current milestone details
  const currentMilestone = [...STREAK_MILESTONES]
    .reverse()
    .find((m) => streakData.currentStreak >= m.days);

  // 1. Generate formatted Weekly Summary Text for Reflection & Journaling
  const generateWeeklySummaryText = (): string => {
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const categoryStats: Record<string, { total: number; completed: number }> = {};
    dailyGoals.forEach((goal) => {
      const cat = goal.category || 'General';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, completed: 0 };
      }
      categoryStats[cat].total += 1;
      if (goal.isCompleted) {
        categoryStats[cat].completed += 1;
      }
    });

    const categoryBreakdownLines = Object.entries(categoryStats).map(([cat, stats]) => {
      const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      return `  • ${cat}: ${stats.completed}/${stats.total} (${pct}%)`;
    });

    const habitsListLines = dailyGoals.map((g) => {
      const mark = g.isCompleted ? '[✓] COMPLETED' : '[ ] PENDING  ';
      return `  ${mark} - ${g.title} [Category: ${g.category}]${
        g.sourceDocName && g.sourceDocName !== 'Daily Habits Routine'
          ? ` (Source: ${g.sourceDocName})`
          : ''
      }`;
    });

    const weekDaysSummaryLines = weekdays.map((w) => {
      const statusText = w.completed
        ? '✓ Completed'
        : w.isToday
        ? `${completedCount}/${totalCount} Completed (Today)`
        : 'Pending / Upcoming';
      return `  • ${w.day}: ${statusText}`;
    });

    return `===============================================================
🌿 AURA HABIT REFLECTION & WEEKLY COMPLETION SUMMARY
===============================================================
Date: ${dateFormatted}
Current Streak: ${streakData.currentStreak} Consecutive Days 🔥
Personal Best: ${streakData.bestStreak} Days 🏆
Today's Habit Progress: ${completedCount} of ${totalCount} (${progressPercent}%)

---------------------------------------------------------------
📅 7-DAY WEEKLY CONSISTENCY OVERVIEW:
---------------------------------------------------------------
${weekDaysSummaryLines.join('\n')}

---------------------------------------------------------------
🏷️ CATEGORY BREAKDOWN:
---------------------------------------------------------------
${categoryBreakdownLines.length > 0 ? categoryBreakdownLines.join('\n') : '  No categorized habits yet.'}

---------------------------------------------------------------
📋 TODAY'S HABITS & ACTION ITEMS:
---------------------------------------------------------------
${habitsListLines.length > 0 ? habitsListLines.join('\n') : '  No daily habits active for today.'}

---------------------------------------------------------------
💡 MINDFUL REFLECTION & INSIGHTS:
---------------------------------------------------------------
${
  isAllCompleted
    ? '✨ Full completion achieved! All daily micro-habits finished across health, learning, mindfulness, and focus. Outstanding discipline.'
    : progressPercent >= 50
    ? `📈 Strong progress today with ${progressPercent}% completed. You are on track to sustain your ${streakData.currentStreak}-day streak!`
    : '🌱 Every small action matters. Take a gentle breath and tackle one small habit to nurture your daily momentum.'
}

===============================================================
Exported from Aura Assistive Workspace • ${new Date().toISOString().slice(0, 10)}
===============================================================`;
  };

  // 2. Generate structured CSV format for spreadsheet analysis
  const generateWeeklySummaryCSV = (): string => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const headers = [
      'Date',
      'Habit_ID',
      'Habit_Title',
      'Category',
      'Status',
      'Is_Completed',
      'Due_Date',
      'Current_Streak_Days',
      'Best_Streak_Days',
      'Source_Document',
    ];

    const rows = dailyGoals.map((g) => {
      const escapeCSV = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      return [
        escapeCSV(todayStr),
        escapeCSV(g.id),
        escapeCSV(g.title),
        escapeCSV(g.category),
        escapeCSV(g.isCompleted ? 'Completed' : 'Pending'),
        g.isCompleted ? 'TRUE' : 'FALSE',
        escapeCSV(g.dueDate || 'Today'),
        streakData.currentStreak,
        streakData.bestStreak,
        escapeCSV(g.sourceDocName || 'Daily Habits Routine'),
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  // Copy to clipboard handler
  const handleCopyExport = async () => {
    const content =
      exportFormat === 'text' ? generateWeeklySummaryText() : generateWeeklySummaryCSV();
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      // Fallback for clipboard if needed
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  // Download file handler
  const handleDownloadExport = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const isCSV = exportFormat === 'csv';
    const content = isCSV ? generateWeeklySummaryCSV() : generateWeeklySummaryText();
    const mimeType = isCSV ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const fileName = isCSV
      ? `aura-habit-completion-${todayStr}.csv`
      : `aura-habit-reflection-summary-${todayStr}.txt`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="daily-goals-widget"
      className={`rounded-3xl p-6 sm:p-7 border transition-all relative ${
        accessibility.highContrast
          ? 'bg-zinc-950 border-white text-white'
          : 'bg-white border-[#EFE8DC] shadow-artistic text-[#2D2D2D]'
      } space-y-6`}
    >
      {/* 1. Header & Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold relative cursor-pointer ${
              accessibility.highContrast
                ? 'bg-white text-black'
                : 'bg-gradient-to-br from-[#C25E2B] to-[#E67E22] text-white shadow-xs'
            }`}
            onClick={() => handleTriggerMilestoneCelebration(streakData.currentStreak)}
            title="Click to celebrate current streak!"
          >
            <Target className="w-5 h-5" />
            {isAllCompleted && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#3A6B4F] border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                ✓
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-black font-serif tracking-tight ${
                  accessibility.largerText ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                }`}
              >
                Daily Goals & Categorized Habits
              </h2>
              <button
                onClick={() => handleTriggerMilestoneCelebration(streakData.currentStreak)}
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer ${
                  accessibility.highContrast
                    ? 'bg-zinc-800 text-yellow-300 border border-yellow-400'
                    : 'bg-[#FDF2E9] text-[#C25E2B] border border-[#FAD7A0]'
                }`}
                title="Tap to celebrate streak milestone!"
              >
                <Flame className="w-3 h-3 text-[#C25E2B] animate-pulse" />
                <span>{streakData.currentStreak} Day Streak</span>
                <Sparkles className="w-2.5 h-2.5 text-[#C25E2B]" />
              </button>
            </div>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Organize small daily habits across Health, Learning, Mindfulness, and Focus.
            </p>
          </div>
        </div>

        {/* Read aloud, Export, Celebrate Milestone & New Habit buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              accessibility.highContrast
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] shadow-2xs'
            }`}
            title="Export habit completion data as Summary Text or CSV"
            aria-label="Export weekly habit completion data"
          >
            <Download className="w-3.5 h-3.5 text-[#C25E2B]" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => handleTriggerMilestoneCelebration(streakData.currentStreak)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              accessibility.highContrast
                ? 'bg-zinc-900 hover:bg-zinc-800 text-yellow-300 border border-zinc-700'
                : 'bg-[#FCFAF7] hover:bg-[#F5EFE6] text-[#C25E2B] border border-[#FAD7A0] shadow-2xs'
            }`}
            title="Celebrate streak milestone with confetti"
            aria-label="Celebrate streak milestone"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Celebrate</span>
          </button>

          <button
            onClick={handleSpeakGoals}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              accessibility.highContrast
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] shadow-2xs'
            }`}
            title="Listen to today's habit status"
            aria-label="Listen to today's streak and goals status"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#C25E2B]" />
            <span className="hidden sm:inline">Read Aloud</span>
          </button>

          <button
            onClick={() => setIsAddingCustom(!isAddingCustom)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              accessibility.highContrast
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingCustom ? 'Cancel' : 'New Habit'}</span>
          </button>
        </div>
      </div>

      {/* 1.5. Native Habit Reminders & Notification Status Bar */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
          accessibility.highContrast
            ? 'bg-zinc-900 border-zinc-700'
            : notificationPermission === 'granted'
            ? 'bg-[#EAF5EF] border-[#B2D8C3]'
            : notificationPermission === 'denied'
            ? 'bg-[#FDF2E9] border-[#FAD7A0]'
            : 'bg-[#FAF7F2] border-[#EFE8DC]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              notificationPermission === 'granted'
                ? 'bg-[#3A6B4F] text-white'
                : notificationPermission === 'denied'
                ? 'bg-[#C25E2B] text-white'
                : 'bg-[#C25E2B]/15 text-[#C25E2B]'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <BellRing className="w-4 h-4 animate-pulse" />
            ) : notificationPermission === 'denied' ? (
              <BellOff className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">
                {notificationPermission === 'granted'
                  ? 'Native Habit Notifications Active'
                  : notificationPermission === 'denied'
                  ? 'Browser Notifications Blocked (In-App Prompts Active)'
                  : 'Time-Based Habit Reminders'}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  notificationPermission === 'granted'
                    ? 'bg-[#3A6B4F]/20 text-[#245C3B]'
                    : notificationPermission === 'denied'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#EAE0D0] text-[#7A7265]'
                }`}
              >
                {notificationPermission === 'granted'
                  ? 'Enabled'
                  : notificationPermission === 'denied'
                  ? 'In-App Only'
                  : 'Ready'}
              </span>
            </div>
            <p className="text-[11px] text-[#7A7265] mt-0.5">
              {notificationPermission === 'granted'
                ? 'You will receive native browser prompts and audio chimes at your scheduled habit times.'
                : notificationPermission === 'denied'
                ? 'Browser notifications are restricted in settings. In-app audio alerts and prompts will notify you.'
                : 'Set specific times for habits and receive browser-native prompts to complete them.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {notificationPermission !== 'granted' ? (
            <button
              type="button"
              onClick={requestNotificationPermission}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                accessibility.highContrast
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Browser Prompts</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const sampleHabit = dailyGoals[0] || {
                  id: 'test-sample',
                  title: 'Hydrate and review daily goals',
                  category: 'Wellness',
                  dueDate: 'Today',
                  isCompleted: false,
                  sourceDocName: 'Daily Habits Routine',
                  priority: 'medium',
                  reminderTime: '12:00',
                  reminderEnabled: true,
                };
                sendHabitNotification(sampleHabit, true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                accessibility.highContrast
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                  : 'bg-white hover:bg-[#F5EFE6] text-[#245C3B] border border-[#B2D8C3] shadow-2xs'
              }`}
              title="Test browser notification and in-app prompt"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3A6B4F]" />
              <span>Send Test Prompt</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Streak Counter & Weekly Consistency Tracker */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          accessibility.highContrast
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-gradient-to-r from-[#FAF7F2] via-[#FCFAF7] to-[#F5EFE6] border-[#EAE0D0]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Streak Flame Metric */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => handleTriggerMilestoneCelebration(streakData.currentStreak)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-transform hover:scale-105 ${
                accessibility.highContrast
                  ? 'bg-black border border-yellow-400 text-yellow-300'
                  : 'bg-gradient-to-br from-[#E67E22] to-[#C25E2B] text-white'
              }`}
              title="Click to celebrate streak milestone!"
            >
              <Flame className="w-6 h-6 animate-bounce" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-black font-serif ${
                    accessibility.highContrast ? 'text-yellow-300' : 'text-[#2D2D2D]'
                  }`}
                >
                  {streakData.currentStreak}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A7265]">
                  Day Streak
                </span>
                {currentMilestone && (
                  <span
                    onClick={() => handleTriggerMilestoneCelebration(currentMilestone.days)}
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
                      accessibility.highContrast
                        ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-400'
                        : 'bg-[#EAF5EF] text-[#245C3B] border border-[#B2D8C3]'
                    }`}
                    title={`Milestone unlocked: ${currentMilestone.title}`}
                  >
                    <span>{currentMilestone.badge}</span>
                    <span>{currentMilestone.title}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#7A7265] mt-0.5">
                <Trophy className="w-3.5 h-3.5 text-[#C25E2B]" />
                <span>Personal Best: <strong>{streakData.bestStreak} days</strong></span>
                <span>·</span>
                <button
                  onClick={() => triggerConfetti(false)}
                  className="text-[#3A6B4F] font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>Consistent momentum</span>
                  <Sparkles className="w-3 h-3 text-[#3A6B4F]" />
                </button>
              </div>
            </div>
          </div>

          {/* 7-Day Consistency Weekday Grid */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {weekdays.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span
                  className={`text-[10px] font-bold ${
                    item.isToday ? 'text-[#C25E2B] underline decoration-2' : 'text-[#7A7265]'
                  }`}
                >
                  {item.day}
                </span>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${
                    item.completed
                      ? accessibility.highContrast
                        ? 'bg-yellow-400 text-black font-bold'
                        : 'bg-[#3A6B4F] text-white shadow-2xs font-bold'
                      : item.isToday
                      ? accessibility.highContrast
                        ? 'border-2 border-dashed border-yellow-400 bg-zinc-950 text-yellow-400 font-bold'
                        : 'border-2 border-dashed border-[#C25E2B] bg-[#FFF8F0] text-[#C25E2B] font-bold'
                      : accessibility.highContrast
                      ? 'bg-zinc-800 text-zinc-600'
                      : 'bg-[#EFE8DC] text-[#A89F91]'
                  }`}
                  title={`${item.day}: ${
                    item.completed
                      ? 'Habits Completed'
                      : item.isToday
                      ? 'Today (In Progress)'
                      : 'Upcoming'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : item.isToday ? (
                    <span className="text-[10px] font-black">{completedCount}/{totalCount}</span>
                  ) : (
                    <span className="text-[10px] font-medium">·</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Quick Row */}
        <div className="pt-3 mt-3 border-t border-[#EAE0D0] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-[#7A7265] flex items-center gap-1">
            <Award className="w-3 h-3 text-[#C25E2B]" />
            <span>Streak Milestones:</span>
          </span>
          {STREAK_MILESTONES.map((m) => {
            const isAchieved = streakData.currentStreak >= m.days;
            return (
              <button
                key={m.days}
                onClick={() => isAchieved && handleTriggerMilestoneCelebration(m.days)}
                disabled={!isAchieved}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border ${
                  isAchieved
                    ? accessibility.highContrast
                      ? 'bg-yellow-950/60 border-yellow-400 text-yellow-300 hover:bg-yellow-900 cursor-pointer'
                      : 'bg-[#EAF5EF] border-[#B2D8C3] text-[#245C3B] hover:bg-[#D8EDE0] cursor-pointer shadow-2xs'
                    : 'opacity-40 bg-[#FAF7F2] border-[#EFE8DC] text-[#A89F91] cursor-default'
                }`}
                title={m.desc}
              >
                <span>{m.badge}</span>
                <span>{m.days}d</span>
                {isAchieved && <Check className="w-2.5 h-2.5 text-[#3A6B4F]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Visual Progress Bar with Milestones */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
          accessibility.highContrast
            ? 'bg-zinc-900 border-zinc-800'
            : 'bg-[#FAF7F2] border-[#EFE8DC]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C25E2B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7265]">
              Today's Completion Progress
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm sm:text-base font-black font-serif ${
                progressPercent === 100
                  ? 'text-[#3A6B4F]'
                  : accessibility.highContrast
                  ? 'text-yellow-300'
                  : 'text-[#C25E2B]'
              }`}
            >
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Dynamic Progress Track */}
        <div className="relative pt-2 pb-1">
          <div
            className={`w-full h-3.5 rounded-full overflow-hidden relative ${
              accessibility.highContrast ? 'bg-zinc-800' : 'bg-[#EAE0D0]'
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full transition-all relative ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-[#3A6B4F] to-[#4E8D67]'
                  : 'bg-gradient-to-r from-[#E67E22] via-[#C25E2B] to-[#3A6B4F]'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-40 animate-pulse" />
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-[#7A7265] mt-2 px-1">
            <span className={progressPercent >= 0 ? 'text-[#2D2D2D] font-bold' : ''}>Start (0%)</span>
            <span className={progressPercent >= 50 ? 'text-[#C25E2B] font-bold' : ''}>Halfway (50%)</span>
            <span className={progressPercent >= 75 ? 'text-[#C25E2B] font-bold' : ''}>Strong (75%)</span>
            <span className={progressPercent === 100 ? 'text-[#3A6B4F] font-bold flex items-center gap-0.5' : ''}>
              {progressPercent === 100 && '🎉 '}Goal Met (100%)
            </span>
          </div>
        </div>

        {/* Celebration / Motivational Prompt */}
        {isAllCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
              accessibility.highContrast
                ? 'bg-zinc-950 border-yellow-400 text-yellow-300'
                : 'bg-[#EAF5EF] border-[#B2D8C3] text-[#1E4D31]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3A6B4F] shrink-0" />
              <span>
                🎉 <strong>Sensational work!</strong> You accomplished all daily habits across every category today. Your streak is active!
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => triggerConfetti(true)}
                className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-[#1E4D31] font-bold text-[11px] shadow-2xs cursor-pointer border border-[#B2D8C3] flex items-center gap-1"
                title="Celebrate again!"
              >
                <span>Confetti</span>
                <span>✨</span>
              </button>
              <button
                onClick={() =>
                  speechService.speak(
                    'Congratulations! You completed all your daily habits today and kept your streak alive!'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-[#1E4D31] font-bold text-[11px] shadow-2xs cursor-pointer border border-[#B2D8C3]"
              >
                Hear Cheer 🔊
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between text-xs text-[#7A7265]">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#C25E2B]" />
              <span>
                {totalCount - completedCount === 1
                  ? 'Only 1 habit remaining to complete today\'s streak!'
                  : `${totalCount - completedCount} habits remaining to complete today's streak`}
              </span>
            </div>
            <span className="text-[11px] text-[#C25E2B] font-semibold">
              {progressPercent < 50 ? 'Every small action counts' : 'Almost there!'}
            </span>
          </div>
        )}
      </div>

      {/* 4. Categorized Custom Habit Creator Drawer */}
      <AnimatePresence>
        {isAddingCustom && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCustomSubmit}
            className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
              accessibility.highContrast
                ? 'bg-zinc-900 border-yellow-400'
                : 'bg-[#FCFAF7] border-[#E8DCCB] shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#93441B] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C25E2B]" />
                <span>Create New Categorized Habit</span>
              </div>
              <span className="text-[11px] text-[#7A7265]">Select category color tag below</span>
            </div>

            <div className="space-y-3">
              {/* Habit Title Input */}
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="What small habit would you like to build? (e.g. 'Read 5 minutes of notes', 'Drink water')..."
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/50 ${
                  accessibility.highContrast
                    ? 'bg-black border-zinc-700 text-white'
                    : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
                }`}
                autoFocus
                required
              />

              {/* Visual Category Selector Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#7A7265] block">
                  Assign Category & Color Tag:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {(
                    [
                      'Health',
                      'Learning',
                      'Mindfulness',
                      'Communication',
                      'Focus',
                      'Wellness',
                    ] as const
                  ).map((catKey) => {
                    const cfg = HABIT_CATEGORIES[catKey];
                    const Icon = cfg.icon;
                    const isSelected = selectedTag === catKey;

                    return (
                      <button
                        key={catKey}
                        type="button"
                        onClick={() => setSelectedTag(catKey)}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          isSelected
                            ? accessibility.highContrast
                              ? 'bg-white text-black border-white ring-2 ring-yellow-400'
                              : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ring-2 ring-[#C25E2B]/40 shadow-xs`
                            : accessibility.highContrast
                            ? 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-600'
                            : 'bg-white text-[#7A7265] border-[#EFE8DC] hover:border-[#D6C2A5]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Habit Schedule & Reminder Time Selector */}
              <div className="p-3.5 rounded-xl border bg-white/70 border-[#EFE8DC] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#7A7265] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C25E2B]" />
                    <span>Set Daily Reminder Time:</span>
                  </span>
                  {newGoalReminderTime ? (
                    <span className="text-[11px] font-extrabold text-[#C25E2B]">
                      ⏰ {formatTime12Hour(newGoalReminderTime)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#A89F91]">No time (Anytime)</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="time"
                    value={newGoalReminderTime}
                    onChange={(e) => setNewGoalReminderTime(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/40 ${
                      accessibility.highContrast
                        ? 'bg-black border-zinc-700 text-white'
                        : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
                    }`}
                  />

                  {/* Quick Time Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { label: '🌅 08:00', time: '08:00' },
                      { label: '☀️ 12:30', time: '12:30' },
                      { label: '☕ 15:30', time: '15:30' },
                      { label: '🌙 20:00', time: '20:00' },
                    ].map((preset) => (
                      <button
                        key={preset.time}
                        type="button"
                        onClick={() => setNewGoalReminderTime(preset.time)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          newGoalReminderTime === preset.time
                            ? 'bg-[#C25E2B] text-white border-[#C25E2B] font-bold'
                            : 'bg-white text-[#7A7265] border-[#EFE8DC] hover:border-[#D6C2A5]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                    {newGoalReminderTime && (
                      <button
                        type="button"
                        onClick={() => setNewGoalReminderTime('')}
                        className="px-2 py-1 rounded-lg text-[10px] text-[#A89F91] hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {newGoalReminderTime && (
                  <label className="flex items-center gap-2 pt-1 cursor-pointer text-xs font-medium text-[#7A7265]">
                    <input
                      type="checkbox"
                      checked={newGoalReminderEnabled}
                      onChange={(e) => setNewGoalReminderEnabled(e.target.checked)}
                      className="rounded text-[#C25E2B] focus:ring-[#C25E2B]"
                    />
                    <span>
                      Trigger browser-native notification and chime prompt at{' '}
                      <strong>{formatTime12Hour(newGoalReminderTime)}</strong>
                    </span>
                  </label>
                )}
              </div>

              {/* Habit Notes & Quick Log Initial Field */}
              <div className="p-3.5 rounded-xl border bg-white/70 border-[#EFE8DC] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#7A7265] flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-[#C25E2B]" />
                    <span>Habit Notes & Quick Logs (Optional):</span>
                  </label>
                  <span className="text-[10px] text-[#A89F91]">
                    Context, dosage, links, or instructions
                  </span>
                </div>
                <textarea
                  value={newGoalNotes}
                  onChange={(e) => setNewGoalNotes(e.target.value)}
                  placeholder="e.g., 'Drink 1 full glass before coffee' or 'Upload verification form before bursar 5 PM deadline'..."
                  rows={2}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/40 resize-none ${
                    accessibility.highContrast
                      ? 'bg-black border-zinc-700 text-white'
                      : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
                  }`}
                />
              </div>

              {/* Submit & Cancel */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#7A7265] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    accessibility.highContrast
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs'
                  }`}
                >
                  Save to {selectedTag}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 5. Preset Categorized Quick-Add Pills */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7265]">
            Quick-Add Categorized Habits:
          </span>
          <span className="text-[11px] text-[#A89F91]">Tap to add instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESET_HABITS.map((preset, idx) => {
            const cfg = getCategoryConfig(preset.tag);
            const Icon = preset.icon;
            const alreadyExists = dailyGoals.some(
              (g) => g.title.toLowerCase() === preset.label.toLowerCase()
            );

            return (
              <button
                key={idx}
                onClick={() =>
                  !alreadyExists &&
                  handleAddGoal(preset.label, preset.tag, preset.defaultTime, true)
                }
                disabled={alreadyExists}
                className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  alreadyExists
                    ? 'opacity-40 bg-[#FAF7F2] border-[#EFE8DC] text-[#A89F91] cursor-not-allowed'
                    : accessibility.highContrast
                    ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-[#FCFAF7] hover:bg-[#F5EFE6] border-[#EFE8DC] hover:border-[#D6C2A5] text-[#2D2D2D] shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      accessibility.highContrast
                        ? `${cfg.darkBg} ${cfg.darkText}`
                        : `${cfg.bgClass} ${cfg.textClass}`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate text-left">
                    <div className="truncate">{preset.label}</div>
                    {preset.defaultTime && (
                      <div className="text-[10px] text-[#A89F91] font-mono">
                        ⏰ {formatTime12Hour(preset.defaultTime)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                      accessibility.highContrast
                        ? `${cfg.darkBg} ${cfg.darkText} ${cfg.darkBorder}`
                        : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`
                    }`}
                  >
                    {preset.tag}
                  </span>
                  {alreadyExists ? (
                    <span className="text-[10px] text-[#3A6B4F] font-bold">✓</span>
                  ) : (
                    <span className="text-[10px] text-[#C25E2B] font-bold">+</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Category Filter Tabs, Notes Toggle & Interactive Checklist */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-[#EFE8DC] pb-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#7A7265] shrink-0 mr-1" />
            {availableCategories.map((cat) => {
              const isActive = activeCategoryFilter === cat;
              const count =
                cat === 'All'
                  ? dailyGoals.length
                  : dailyGoals.filter((g) => g.category.toLowerCase() === cat.toLowerCase()).length;

              const cfg = cat !== 'All' ? HABIT_CATEGORIES[cat] : null;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? accessibility.highContrast
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-[#C25E2B] text-white border-[#C25E2B] shadow-xs'
                      : accessibility.highContrast
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                      : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A7265] border-[#EFE8DC]'
                  }`}
                >
                  {cfg && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-white' : cfg.textClass.replace('text-', 'bg-')
                      }`}
                    />
                  )}
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : accessibility.highContrast
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-[#EFE8DC] text-[#6B6355]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Toolbar: Show/Hide Past Notes Toggle & Notes Feed Button */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto flex-wrap">
            {/* Show / Hide Past Habit Notes Toggle */}
            <button
              type="button"
              onClick={toggleShowAllNotes}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                showAllNotes
                  ? accessibility.highContrast
                    ? 'bg-yellow-400 text-black border-yellow-400 font-extrabold'
                    : 'bg-[#FFF8F0] text-[#C25E2B] border-[#FAD7A0] hover:bg-[#FDF2E9]'
                  : accessibility.highContrast
                  ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  : 'bg-[#FAF7F2] text-[#7A7265] border-[#EFE8DC] hover:border-[#D6C2A5]'
              }`}
              title={
                showAllNotes
                  ? 'Click to hide past habit notes & quick logs across dashboard'
                  : 'Click to show past habit notes & quick logs across dashboard'
              }
              aria-label={showAllNotes ? 'Hide habit notes' : 'Show habit notes'}
            >
              {showAllNotes ? (
                <Eye className="w-3.5 h-3.5 text-[#C25E2B]" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#7A7265]" />
              )}
              <span>{showAllNotes ? 'Hide Habit Notes' : 'Show Habit Notes'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  showAllNotes
                    ? 'bg-[#C25E2B] text-white'
                    : accessibility.highContrast
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-[#EFE8DC] text-[#7A7265]'
                }`}
              >
                {dailyGoals.reduce((acc, g) => acc + (g.notesHistory?.length || (g.notes ? 1 : 0)), 0)}
              </span>
            </button>

            {/* Notes & Reflections Feed Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowNotesFeedModal(true)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                accessibility.highContrast
                  ? 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                  : 'bg-white text-[#7A7265] border-[#EFE8DC] hover:border-[#C25E2B] hover:text-[#C25E2B]'
              }`}
              title="View all past habit logs and reflections feed"
            >
              <NotebookTabs className="w-3.5 h-3.5 text-[#C25E2B]" />
              <span className="hidden sm:inline">Notes Feed</span>
            </button>
          </div>
        </div>

        {/* Interactive Goals Checklist */}
        {filteredGoals.length === 0 ? (
          <div
            className={`p-6 rounded-2xl border text-center space-y-2 ${
              accessibility.highContrast
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                : 'bg-[#FAF7F2] border-[#EFE8DC] text-[#7A7265]'
            }`}
          >
            <Sparkles className="w-6 h-6 mx-auto text-[#C25E2B] opacity-80" />
            <p className="text-xs font-medium">
              {activeCategoryFilter === 'All'
                ? 'No daily habits added yet for today. Tap any quick suggestion above or create your own to start your streak!'
                : `No habits found under "${activeCategoryFilter}". Tap a quick recommendation above or add a new one!`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGoals.map((goal) => {
              const cfg = getCategoryConfig(goal.category);
              const Icon = cfg.icon;
              const isNotesExpanded = showAllNotes || expandedNoteIds.has(goal.id);
              const hasNotesOrLogs = Boolean(
                goal.notes || (goal.notesHistory && goal.notesHistory.length > 0)
              );
              const logCount = goal.notesHistory?.length || (goal.notes ? 1 : 0);
              const currentInput = quickLogInputs[goal.id] || '';
              const currentMood = quickLogMoods[goal.id] || 'good';

              return (
                <div
                  key={goal.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    goal.isCompleted
                      ? accessibility.highContrast
                        ? 'bg-zinc-900/60 border-zinc-800 opacity-75'
                        : 'bg-[#F9F6F0] border-[#EFE8DC] opacity-85'
                      : accessibility.highContrast
                      ? 'bg-zinc-900 border-zinc-700'
                      : 'bg-white border-[#EFE8DC] hover:border-[#D6C2A5] shadow-2xs'
                  }`}
                >
                  {/* Card Header Row */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                    {/* Checkbox and Title */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => onToggleChecklist(goal.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          goal.isCompleted
                            ? 'bg-[#3A6B4F] border-[#3A6B4F] text-white shadow-2xs'
                            : accessibility.highContrast
                            ? 'border-zinc-500 hover:border-white bg-black'
                            : 'border-[#B8AF9F] hover:border-[#C25E2B] bg-white'
                        }`}
                        aria-label={`Toggle habit: ${goal.title}`}
                        aria-checked={goal.isCompleted}
                        role="checkbox"
                      >
                        {goal.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-transparent hover:text-[#C25E2B]/40" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              goal.isCompleted
                                ? 'line-through text-[#A89F91]'
                                : accessibility.highContrast
                                ? 'text-white'
                                : 'text-[#2D2D2D]'
                            } ${accessibility.largerText ? 'text-base sm:text-lg' : ''}`}
                          >
                            {goal.title}
                          </span>

                          {/* Color-Coded Category Tag Badge */}
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${
                              accessibility.highContrast
                                ? `${cfg.darkBg} ${cfg.darkText} ${cfg.darkBorder}`
                                : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`
                            }`}
                          >
                            <Icon className="w-2.5 h-2.5" />
                            <span>{cfg.label}</span>
                          </span>

                          {/* Scheduled Reminder Time Pill */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenScheduleModal(goal, e)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              goal.reminderTime
                                ? goal.reminderEnabled !== false
                                  ? accessibility.highContrast
                                    ? 'bg-yellow-950/60 border-yellow-400 text-yellow-300'
                                    : 'bg-[#FFF8F0] border-[#FAD7A0] text-[#C25E2B] hover:bg-[#FDF2E9]'
                                  : accessibility.highContrast
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                                  : 'bg-[#FAF7F2] border-[#EFE8DC] text-[#A89F91] hover:bg-[#F5EFE6]'
                                : accessibility.highContrast
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                                : 'bg-white border-[#EFE8DC] text-[#7A7265] hover:border-[#C25E2B] hover:text-[#C25E2B]'
                            }`}
                            title={
                              goal.reminderTime
                                ? `Scheduled for ${formatTime12Hour(goal.reminderTime)} (${
                                    goal.reminderEnabled !== false ? 'Notifications Active' : 'Muted'
                                  }). Click to change.`
                                : 'Click to schedule a daily reminder time for this habit'
                            }
                          >
                            {goal.reminderTime ? (
                              <>
                                {goal.reminderEnabled !== false ? (
                                  <BellRing className="w-2.5 h-2.5 text-[#C25E2B]" />
                                ) : (
                                  <BellOff className="w-2.5 h-2.5 text-[#A89F91]" />
                                )}
                                <span>{formatTime12Hour(goal.reminderTime)}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-2.5 h-2.5 text-[#A89F91]" />
                                <span>+ Time</span>
                              </>
                            )}
                          </button>

                          {/* Habit Notes Indicator / Toggle Pill */}
                          <button
                            type="button"
                            onClick={(e) => toggleItemNotes(goal.id, e)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                              hasNotesOrLogs
                                ? isNotesExpanded
                                  ? accessibility.highContrast
                                    ? 'bg-yellow-950/80 border-yellow-400 text-yellow-300'
                                    : 'bg-[#FAF3EA] border-[#E8D0BA] text-[#93441B]'
                                  : accessibility.highContrast
                                  ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                  : 'bg-[#FCFAF7] border-[#EAE0D0] text-[#7A7265] hover:text-[#93441B]'
                                : isNotesExpanded
                                ? 'bg-[#FAF3EA] border-[#E8D0BA] text-[#93441B]'
                                : accessibility.highContrast
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                                : 'bg-white border-[#EFE8DC] text-[#A89F91] hover:text-[#C25E2B]'
                            }`}
                            title={
                              isNotesExpanded
                                ? 'Collapse notes & logs for this habit'
                                : 'Expand notes & quick logs for this habit'
                            }
                          >
                            <StickyNote className="w-2.5 h-2.5" />
                            <span>
                              {hasNotesOrLogs ? `${logCount} Note${logCount > 1 ? 's' : ''}` : '+ Note'}
                            </span>
                            {isNotesExpanded ? (
                              <ChevronUp className="w-2.5 h-2.5 opacity-60" />
                            ) : (
                              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#7A7265]">
                          <span className="text-[#3A6B4F] font-medium">Today</span>
                          {goal.reminderTime && (
                            <>
                              <span>·</span>
                              <span className="text-[#C25E2B] font-mono text-[10px]">
                                ⏰ {formatTime12Hour(goal.reminderTime)}
                              </span>
                            </>
                          )}
                          {goal.sourceDocName && goal.sourceDocName !== 'Daily Habits Routine' && (
                            <>
                              <span>·</span>
                              <span className="truncate max-w-[160px]">{goal.sourceDocName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Actions: Quick Note Button, Test Notification, Schedule & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => toggleItemNotes(goal.id, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isNotesExpanded
                            ? 'bg-[#FAF3EA] text-[#C25E2B]'
                            : 'text-[#7A7265] hover:text-[#C25E2B]'
                        } ${accessibility.highContrast ? 'hover:bg-zinc-800' : 'hover:bg-[#FAF7F2]'}`}
                        title="Toggle habit notes and quick logs"
                        aria-label={`Toggle notes for ${goal.title}`}
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendHabitNotification(goal, true);
                        }}
                        className={`p-1.5 rounded-lg text-[#7A7265] hover:text-[#C25E2B] transition-colors cursor-pointer ${
                          accessibility.highContrast ? 'hover:bg-zinc-800' : 'hover:bg-[#FAF7F2]'
                        }`}
                        title="Test reminder prompt and chime for this habit"
                        aria-label={`Test prompt for ${goal.title}`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleOpenScheduleModal(goal, e)}
                        className={`p-1.5 rounded-lg text-[#7A7265] hover:text-[#C25E2B] transition-colors cursor-pointer ${
                          accessibility.highContrast ? 'hover:bg-zinc-800' : 'hover:bg-[#FAF7F2]'
                        }`}
                        title="Set reminder time schedule"
                        aria-label={`Set schedule for ${goal.title}`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>

                      {onDeleteChecklist && (
                        <button
                          onClick={() => onDeleteChecklist(goal.id)}
                          className={`p-1.5 rounded-lg text-[#A89F91] hover:text-rose-600 transition-colors cursor-pointer shrink-0 ${
                            accessibility.highContrast ? 'hover:bg-zinc-800' : 'hover:bg-[#FAF7F2]'
                          }`}
                          title="Remove goal"
                          aria-label={`Remove goal ${goal.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Habit Notes & Quick Logs Section */}
                  <AnimatePresence>
                    {isNotesExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`border-t p-3.5 sm:p-4 space-y-3.5 ${
                          accessibility.highContrast
                            ? 'bg-zinc-950/90 border-zinc-800'
                            : 'bg-[#FAF7F2]/80 border-[#EFE8DC]'
                        }`}
                      >
                        {/* 1. Habit Base Context Note */}
                        <div
                          className={`p-3 rounded-xl border space-y-1.5 ${
                            accessibility.highContrast
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                              : 'bg-white border-[#EAE0D0] text-[#2D2D2D]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#93441B] uppercase tracking-wider">
                              <StickyNote className="w-3 h-3 text-[#C25E2B]" />
                              <span>Habit Context & Instructions</span>
                            </div>
                            {editingNoteItemId !== goal.id && (
                              <button
                                type="button"
                                onClick={(e) => handleStartEditNote(goal, e)}
                                className="text-[11px] text-[#C25E2B] hover:text-[#93441B] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{goal.notes ? 'Edit Note' : '+ Add Note'}</span>
                              </button>
                            )}
                          </div>

                          {editingNoteItemId === goal.id ? (
                            <div className="space-y-2 pt-1">
                              <textarea
                                value={editingNoteValue}
                                onChange={(e) => setEditingNoteValue(e.target.value)}
                                placeholder="Add dosage details, study links, routine instructions, or reminders..."
                                rows={2}
                                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/40 resize-none ${
                                  accessibility.highContrast
                                    ? 'bg-black border-zinc-700 text-white'
                                    : 'bg-[#FAF7F2] border-[#EFE8DC] text-[#2D2D2D]'
                                }`}
                                autoFocus
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteItemId(null)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#7A7265] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveNote(goal.id)}
                                  className="px-3.5 py-1 rounded-lg text-xs font-bold bg-[#C25E2B] text-white hover:bg-[#A84B1D] transition-all cursor-pointer shadow-2xs"
                                >
                                  Save Note
                                </button>
                              </div>
                            </div>
                          ) : goal.notes ? (
                            <p className="text-xs text-[#524B40] leading-relaxed whitespace-pre-wrap">
                              {goal.notes}
                            </p>
                          ) : (
                            <p className="text-xs text-[#A89F91] italic">
                              No background context note added yet. Tap "Add Note" to add dosages, instructions, or goals.
                            </p>
                          )}
                        </div>

                        {/* 2. Quick Log Entry Composer */}
                        <div
                          className={`p-3 rounded-xl border space-y-2.5 ${
                            accessibility.highContrast
                              ? 'bg-zinc-900 border-zinc-800'
                              : 'bg-[#FCFAF7] border-[#EAE0D0]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#7A7265] flex items-center gap-1.5">
                              <NotebookPen className="w-3 h-3 text-[#C25E2B]" />
                              <span>Store Quick Habit Log:</span>
                            </span>
                            <span className="text-[10px] text-[#A89F91]">
                              Log reflections, metrics, or completion details
                            </span>
                          </div>

                          {/* Quick Suggested Reflection Chips */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { label: '🎯 Done on time', mood: 'great' as const },
                              { label: '✨ Felt calm & focused', mood: 'great' as const },
                              { label: '💧 Feeling energized', mood: 'good' as const },
                              { label: '💊 Taken with meal', mood: 'good' as const },
                              { label: '📖 Completed target', mood: 'great' as const },
                              { label: '⚠️ Needed extra reminder', mood: 'challenging' as const },
                            ].map((chip) => (
                              <button
                                key={chip.label}
                                type="button"
                                onClick={() => handleAddQuickLog(goal.id, chip.label, chip.mood)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                                  accessibility.highContrast
                                    ? 'bg-black text-zinc-300 border-zinc-800 hover:border-zinc-600'
                                    : 'bg-white text-[#7A7265] border-[#EFE8DC] hover:border-[#C25E2B] hover:text-[#C25E2B]'
                                }`}
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>

                          {/* Custom Quick Log Input & Mood Buttons */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            {/* Mood selector buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                              {(
                                [
                                  { mood: 'great' as const, icon: '🌟', label: 'Great' },
                                  { mood: 'good' as const, icon: '👍', label: 'Good' },
                                  { mood: 'neutral' as const, icon: '⚖️', label: 'Neutral' },
                                  { mood: 'challenging' as const, icon: '⚠️', label: 'Tough' },
                                ] as const
                              ).map((m) => (
                                <button
                                  key={m.mood}
                                  type="button"
                                  onClick={() =>
                                    setQuickLogMoods((prev) => ({ ...prev, [goal.id]: m.mood }))
                                  }
                                  className={`p-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                                    currentMood === m.mood
                                      ? 'bg-[#C25E2B]/15 border-[#C25E2B] scale-105'
                                      : 'bg-white border-[#EFE8DC] hover:border-[#D6C2A5]'
                                  }`}
                                  title={`Mood: ${m.label}`}
                                >
                                  <span>{m.icon}</span>
                                </button>
                              ))}
                            </div>

                            {/* Input Field */}
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <input
                                type="text"
                                value={currentInput}
                                onChange={(e) =>
                                  setQuickLogInputs((prev) => ({
                                    ...prev,
                                    [goal.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddQuickLog(goal.id);
                                  }
                                }}
                                placeholder="Type a reflection or log entry (e.g. 'Completed 15 mins with focus')..."
                                className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/40 ${
                                  accessibility.highContrast
                                    ? 'bg-black border-zinc-700 text-white'
                                    : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
                                }`}
                              />

                              <button
                                type="button"
                                onClick={() => handleAddQuickLog(goal.id)}
                                disabled={!currentInput.trim()}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                                  currentInput.trim()
                                    ? 'bg-[#C25E2B] text-white hover:bg-[#A84B1D] shadow-2xs'
                                    : 'opacity-40 bg-[#EFE8DC] text-[#A89F91] cursor-not-allowed'
                                }`}
                              >
                                <Send className="w-3 h-3" />
                                <span className="hidden sm:inline">Log</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 3. Past Habit Notes & Logs History Timeline */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7265] flex items-center gap-1">
                              <History className="w-3 h-3 text-[#C25E2B]" />
                              <span>Past Habit Notes & Logs Timeline</span>
                            </span>
                            <span className="text-[10px] text-[#A89F91]">
                              {goal.notesHistory?.length || 0} recorded
                            </span>
                          </div>

                          {goal.notesHistory && goal.notesHistory.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {goal.notesHistory.map((log) => {
                                const moodEmoji =
                                  log.mood === 'great'
                                    ? '🌟'
                                    : log.mood === 'good'
                                    ? '👍'
                                    : log.mood === 'challenging'
                                    ? '⚠️'
                                    : '⚖️';

                                return (
                                  <div
                                    key={log.id}
                                    className={`p-2.5 rounded-xl border flex items-start justify-between gap-2.5 transition-all ${
                                      accessibility.highContrast
                                        ? 'bg-zinc-900 border-zinc-800'
                                        : 'bg-white border-[#EFE8DC]'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2 flex-1 min-w-0">
                                      <span className="text-sm shrink-0" title={log.mood || 'log'}>
                                        {moodEmoji}
                                      </span>
                                      <div className="space-y-0.5 min-w-0 flex-1">
                                        <p className="text-xs text-[#2D2D2D] font-medium leading-relaxed break-words">
                                          {log.text}
                                        </p>
                                        <span className="text-[10px] font-mono text-[#A89F91] block">
                                          {log.timestamp}
                                        </span>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteLogEntry(goal.id, log.id, e)}
                                      className="p-1 rounded-md text-[#A89F91] hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                                      title="Delete this log entry"
                                      aria-label="Delete log entry"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              className={`p-3 rounded-xl border border-dashed text-center text-xs text-[#A89F91] ${
                                accessibility.highContrast ? 'border-zinc-800' : 'border-[#EAE0D0]'
                              }`}
                            >
                              No past quick logs stored for this habit yet. Use the quick logger above to record your reflections!
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Milestone Achievement Modal with Confetti & Animation */}
      <AnimatePresence>
        {celebrationModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`max-w-md w-full rounded-3xl p-6 sm:p-7 border shadow-2xl relative text-center space-y-4 ${
                accessibility.highContrast
                  ? 'bg-zinc-950 border-yellow-400 text-white'
                  : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setCelebrationModal(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#7A7265] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                aria-label="Close celebration modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Animated Milestone Emblem */}
              <motion.div
                initial={{ rotate: -15, scale: 0.5 }}
                animate={{ rotate: [0, -8, 8, 0], scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md ${
                  accessibility.highContrast
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gradient-to-tr from-[#C25E2B] to-[#F39C12] text-white'
                }`}
              >
                <span>{celebrationModal.badge}</span>
              </motion.div>

              {/* Title & Streak Number */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#FDF2E9] text-[#C25E2B] border border-[#FAD7A0] mb-2">
                  <Flame className="w-3.5 h-3.5 text-[#C25E2B]" />
                  <span>{celebrationModal.streak}-Day Milestone Unlocked</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-serif">
                  {celebrationModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A7265] mt-1">
                  {celebrationModal.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => {
                    triggerConfetti(true);
                    speechService.speak(`Congratulations on reaching your ${celebrationModal.streak} day streak milestone: ${celebrationModal.title}!`);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    accessibility.highContrast
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-300 border border-yellow-400'
                      : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#C25E2B] border border-[#EFE8DC] shadow-2xs'
                  }`}
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Replay Confetti & Cheer</span>
                </button>

                <button
                  onClick={() => setCelebrationModal(null)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    accessibility.highContrast
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs'
                  }`}
                >
                  Keep Momentum Going!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Export Habit Reflection & Weekly Data Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              className={`max-w-2xl w-full max-h-[90vh] flex flex-col rounded-3xl p-6 sm:p-7 border shadow-2xl relative ${
                accessibility.highContrast
                  ? 'bg-zinc-950 border-white text-white'
                  : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EFE8DC]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      accessibility.highContrast
                        ? 'bg-white text-black'
                        : 'bg-gradient-to-br from-[#C25E2B] to-[#E67E22] text-white'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={`font-black font-serif tracking-tight ${
                        accessibility.largerText ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                      }`}
                    >
                      Export Habit Reflection & Weekly Data
                    </h3>
                    <p className="text-xs text-[#7A7265] mt-0.5">
                      Export your consistency records to reflect on progress, journal, or analyze in spreadsheets.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className={`p-2 rounded-xl text-[#7A7265] transition-colors cursor-pointer ${
                    accessibility.highContrast ? 'hover:bg-zinc-800' : 'hover:bg-[#FAF7F2]'
                  }`}
                  aria-label="Close export modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Format Switcher Tabs */}
              <div className="py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE8DC]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setExportFormat('text')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                      exportFormat === 'text'
                        ? accessibility.highContrast
                          ? 'bg-white text-black border-white shadow-xs'
                          : 'bg-[#C25E2B] text-white border-[#C25E2B] shadow-xs'
                        : accessibility.highContrast
                        ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        : 'bg-[#FAF7F2] text-[#7A7265] border-[#EFE8DC] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Summary Text (Reflection)</span>
                  </button>

                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                      exportFormat === 'csv'
                        ? accessibility.highContrast
                          ? 'bg-white text-black border-white shadow-xs'
                          : 'bg-[#C25E2B] text-white border-[#C25E2B] shadow-xs'
                        : accessibility.highContrast
                        ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        : 'bg-[#FAF7F2] text-[#7A7265] border-[#EFE8DC] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Spreadsheet Data (CSV)</span>
                  </button>
                </div>

                <div className="text-[11px] font-semibold text-[#7A7265] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#C25E2B]" />
                  <span>{streakData.currentStreak}-Day Streak Active</span>
                </div>
              </div>

              {/* Category Breakdown Badges preview */}
              <div className="py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold text-[#7A7265] uppercase shrink-0">
                  Categories:
                </span>
                {availableCategories
                  .filter((c) => c !== 'All')
                  .map((cat) => {
                    const cfg = HABIT_CATEGORIES[cat];
                    const catGoals = dailyGoals.filter(
                      (g) => g.category.toLowerCase() === cat.toLowerCase()
                    );
                    if (catGoals.length === 0) return null;
                    const catCompleted = catGoals.filter((g) => g.isCompleted).length;
                    const catPct = Math.round((catCompleted / catGoals.length) * 100);

                    return (
                      <span
                        key={cat}
                        className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-lg border shrink-0 ${
                          accessibility.highContrast
                            ? `${cfg.darkBg} ${cfg.darkText} ${cfg.darkBorder}`
                            : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`
                        }`}
                      >
                        <span>{cfg.label}</span>
                        <span>{catCompleted}/{catGoals.length} ({catPct}%)</span>
                      </span>
                    );
                  })}
              </div>

              {/* Monospace Output Preview Container */}
              <div className="my-2 flex-1 min-h-[220px] max-h-[300px] overflow-hidden flex flex-col rounded-2xl border border-zinc-700 bg-zinc-950 text-zinc-200">
                <div className="px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>
                    {exportFormat === 'text'
                      ? 'aura-habit-reflection-summary.txt'
                      : 'aura-habit-completion.csv'}
                  </span>
                  <span>{exportFormat === 'text' ? 'Plaintext / Markdown' : 'Comma Separated Values'}</span>
                </div>
                <pre className="p-4 flex-1 overflow-auto text-[11px] sm:text-xs font-mono whitespace-pre text-zinc-200 selection:bg-[#C25E2B]/40">
                  {exportFormat === 'text'
                    ? generateWeeklySummaryText()
                    : generateWeeklySummaryCSV()}
                </pre>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-[#EFE8DC] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const textToRead =
                      exportFormat === 'text'
                        ? generateWeeklySummaryText()
                        : `CSV exported with ${dailyGoals.length} records across your ${streakData.currentStreak} day streak.`;
                    speechService.speak(textToRead);
                  }}
                  className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    accessibility.highContrast
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                      : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC]'
                  }`}
                  title="Listen to reflection aloud"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#C25E2B]" />
                  <span>Listen Aloud</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleCopyExport}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      copySuccess
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : accessibility.highContrast
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700'
                        : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border-[#EFE8DC] shadow-2xs'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C25E2B]" />
                        <span>Copy {exportFormat === 'text' ? 'Summary' : 'CSV'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadExport}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      accessibility.highContrast
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .{exportFormat === 'text' ? 'txt' : 'csv'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. Habit Schedule & Reminder Settings Modal */}
      <AnimatePresence>
        {scheduleModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              className={`max-w-md w-full rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-5 relative ${
                accessibility.highContrast
                  ? 'bg-zinc-950 border-white text-white'
                  : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EFE8DC]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      accessibility.highContrast
                        ? 'bg-white text-black'
                        : 'bg-gradient-to-br from-[#C25E2B] to-[#E67E22] text-white'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black font-serif text-lg">Schedule Habit Reminder</h3>
                    <p className="text-xs text-[#7A7265] mt-0.5 line-clamp-1">
                      {scheduleModalItem.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setScheduleModalItem(null)}
                  className={`p-2 rounded-xl text-[#7A7265] transition-colors cursor-pointer ${
                    accessibility.highContrast ? 'hover:bg-zinc-800' : 'hover:bg-[#FAF7F2]'
                  }`}
                  aria-label="Close schedule modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#7A7265] block">
                    Daily Alert Time:
                  </label>
                  <span className="text-xs font-extrabold text-[#C25E2B] font-mono">
                    ⏰ {formatTime12Hour(scheduleModalTime)}
                  </span>
                </div>

                <input
                  type="time"
                  value={scheduleModalTime}
                  onChange={(e) => setScheduleModalTime(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/40 ${
                    accessibility.highContrast
                      ? 'bg-black border-zinc-700 text-white'
                      : 'bg-[#FAF7F2] border-[#EFE8DC] text-[#2D2D2D]'
                  }`}
                />

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#7A7265] block">Quick Presets:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '🌅 08:00 AM', time: '08:00' },
                      { label: '☀️ 12:30 PM', time: '12:30' },
                      { label: '☕ 03:30 PM', time: '15:30' },
                      { label: '🏃 06:00 PM', time: '18:00' },
                      { label: '🌙 08:30 PM', time: '20:30' },
                      { label: '🛌 10:00 PM', time: '22:00' },
                    ].map((p) => (
                      <button
                        key={p.time}
                        type="button"
                        onClick={() => setScheduleModalTime(p.time)}
                        className={`p-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer text-center ${
                          scheduleModalTime === p.time
                            ? 'bg-[#C25E2B] text-white border-[#C25E2B] font-bold'
                            : accessibility.highContrast
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                            : 'bg-white border-[#EFE8DC] text-[#7A7265] hover:border-[#D6C2A5]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reminder Enabled Toggle */}
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#EFE8DC] bg-[#FAF7F2]/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleModalEnabled}
                    onChange={(e) => setScheduleModalEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C25E2B] focus:ring-[#C25E2B]"
                  />
                  <div className="text-xs">
                    <span className="font-bold block">Browser-Native & Audio Prompts</span>
                    <span className="text-[11px] text-[#7A7265]">
                      Receive browser notification and chime when time arrives
                    </span>
                  </div>
                </label>

                {/* Test Alert Button */}
                <button
                  type="button"
                  onClick={() => {
                    const temp = {
                      ...scheduleModalItem,
                      reminderTime: scheduleModalTime,
                      reminderEnabled: scheduleModalEnabled,
                    };
                    sendHabitNotification(temp, true);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    accessibility.highContrast
                      ? 'bg-zinc-900 text-yellow-300 border-zinc-800 hover:bg-zinc-800'
                      : 'bg-white text-[#245C3B] border-[#B2D8C3] hover:bg-[#EAF5EF]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Test Prompt & Audio Chime Now</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EFE8DC]">
                {scheduleModalItem.reminderTime ? (
                  <button
                    type="button"
                    onClick={handleClearScheduleModal}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Remove Schedule
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleModalItem(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#7A7265] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveScheduleModal}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      accessibility.highContrast
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs'
                    }`}
                  >
                    Save Reminder
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 10. In-App Interactive Active Reminder Prompt Modal */}
      <AnimatePresence>
        {activeReminderPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className={`max-w-md w-full rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-4 relative ${
                accessibility.highContrast
                  ? 'bg-zinc-950 border-yellow-400 text-white ring-2 ring-yellow-400'
                  : 'bg-white border-[#C25E2B] shadow-2xl text-[#2D2D2D] ring-2 ring-[#C25E2B]/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C25E2B] to-[#E67E22] text-white flex items-center justify-center shrink-0 shadow-md animate-bounce">
                    <BellRing className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#C25E2B] border border-[#FAD7A0]">
                      <Clock className="w-3 h-3" />
                      <span>Habit Reminder Prompt</span>
                    </div>
                    <h3 className="font-black font-serif text-lg sm:text-xl mt-1">
                      Time for your habit!
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveReminderPrompt(null)}
                  className="p-1.5 rounded-xl text-[#7A7265] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label="Dismiss prompt"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Habit Card Highlight */}
              <div className="p-4 rounded-2xl border border-[#EAE0D0] bg-[#FAF7F2] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#C25E2B]/15 text-[#C25E2B]">
                    {activeReminderPrompt.category}
                  </span>
                  {activeReminderPrompt.reminderTime && (
                    <span className="text-xs font-mono font-bold text-[#7A7265]">
                      ⏰ {formatTime12Hour(activeReminderPrompt.reminderTime)}
                    </span>
                  )}
                </div>
                <p className="text-base sm:text-lg font-bold text-[#2D2D2D]">
                  {activeReminderPrompt.title}
                </p>
                {activeReminderPrompt.notes && (
                  <p className="text-xs text-[#524B40] bg-white p-2 rounded-lg border border-[#EAE0D0] italic">
                    Note: {activeReminderPrompt.notes}
                  </p>
                )}
                <p className="text-xs text-[#7A7265]">
                  Streak Momentum: <strong>{streakData.currentStreak} days active</strong>. Keep your
                  streak alive!
                </p>
              </div>

              {/* Quick Completion Note / Reflection Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#7A7265] flex items-center gap-1">
                  <StickyNote className="w-3 h-3 text-[#C25E2B]" />
                  <span>Jot Quick Completion Note (Optional):</span>
                </label>
                <input
                  type="text"
                  value={promptQuickLogText}
                  onChange={(e) => setPromptQuickLogText(e.target.value)}
                  placeholder="e.g. 'Took meds with breakfast', 'Completed 15 min session'..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/40 ${
                    accessibility.highContrast
                      ? 'bg-black border-zinc-700 text-white'
                      : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCompletePromptHabit}
                  className={`w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    accessibility.highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-[#3A6B4F] hover:bg-[#2B523C] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed & Celebrate (+1 Streak) 🔥</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSnoozePrompt(5)}
                    className="py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#EFE8DC] bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A7265]"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#C25E2B]" />
                    <span>Snooze (5m)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      speechService.speak(
                        `Reminder: It's time for your habit: ${activeReminderPrompt.title}. You're on a ${streakData.currentStreak} day streak!`
                      );
                    }}
                    className="py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#EFE8DC] bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#7A7265]"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#C25E2B]" />
                    <span>Read Aloud</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. Notes Feed & Past Reflections Modal */}
      <AnimatePresence>
        {showNotesFeedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              className={`max-w-2xl w-full max-h-[85vh] rounded-3xl p-5 sm:p-6 border shadow-2xl flex flex-col space-y-4 relative ${
                accessibility.highContrast
                  ? 'bg-zinc-950 border-white text-white'
                  : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#EFE8DC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C25E2B] to-[#E67E22] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <NotebookTabs className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black font-serif text-lg">Habit Notes & Reflections Feed</h3>
                    <p className="text-xs text-[#7A7265]">
                      All past quick logs, dosages, and notes across your habits
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowNotesFeedModal(false)}
                  className="p-2 rounded-xl text-[#7A7265] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label="Close notes feed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Stats Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7265]" />
                  <input
                    type="text"
                    value={notesFeedSearch}
                    onChange={(e) => setNotesFeedSearch(e.target.value)}
                    placeholder="Search notes, habits, or reflection logs..."
                    className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/40 ${
                      accessibility.highContrast
                        ? 'bg-black border-zinc-700 text-white'
                        : 'bg-[#FAF7F2] border-[#EFE8DC] text-[#2D2D2D]'
                    }`}
                  />
                  {notesFeedSearch && (
                    <button
                      onClick={() => setNotesFeedSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-[#2D2D2D]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs text-[#7A7265]">
                  <span>
                    Total:{' '}
                    <strong className="text-[#C25E2B]">
                      {dailyGoals.reduce(
                        (acc, g) => acc + (g.notesHistory?.length || (g.notes ? 1 : 0)),
                        0
                      )}{' '}
                      entries
                    </strong>
                  </span>
                </div>
              </div>

              {/* Feed Content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 max-h-[50vh]">
                {(() => {
                  // Collect all logs and notes into a unified list
                  const allEntries: Array<{
                    habitId: string;
                    habitTitle: string;
                    habitCategory: string;
                    type: 'context_note' | 'quick_log';
                    logId: string;
                    text: string;
                    timestamp?: string;
                    mood?: string;
                  }> = [];

                  dailyGoals.forEach((goal) => {
                    if (goal.notes) {
                      allEntries.push({
                        habitId: goal.id,
                        habitTitle: goal.title,
                        habitCategory: goal.category,
                        type: 'context_note',
                        logId: `note-${goal.id}`,
                        text: goal.notes,
                        timestamp: 'Active Context Note',
                      });
                    }

                    if (goal.notesHistory && goal.notesHistory.length > 0) {
                      goal.notesHistory.forEach((log) => {
                        allEntries.push({
                          habitId: goal.id,
                          habitTitle: goal.title,
                          habitCategory: goal.category,
                          type: 'quick_log',
                          logId: log.id,
                          text: log.text,
                          timestamp: log.timestamp,
                          mood: log.mood,
                        });
                      });
                    }
                  });

                  const filtered = allEntries.filter((item) => {
                    if (!notesFeedSearch.trim()) return true;
                    const q = notesFeedSearch.toLowerCase();
                    return (
                      item.habitTitle.toLowerCase().includes(q) ||
                      item.habitCategory.toLowerCase().includes(q) ||
                      item.text.toLowerCase().includes(q) ||
                      (item.timestamp && item.timestamp.toLowerCase().includes(q))
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-8 text-center text-xs text-[#7A7265] space-y-2">
                        <NotebookPen className="w-6 h-6 mx-auto text-[#C25E2B] opacity-60" />
                        <p>
                          {notesFeedSearch
                            ? `No notes or quick logs matched "${notesFeedSearch}"`
                            : 'No habit notes or logs stored yet. Use the note buttons or quick log inputs on your habit cards to save reflections!'}
                        </p>
                      </div>
                    );
                  }

                  return filtered.map((entry) => {
                    const cfg = getCategoryConfig(entry.habitCategory);
                    const Icon = cfg.icon;
                    const moodEmoji =
                      entry.mood === 'great'
                        ? '🌟'
                        : entry.mood === 'good'
                        ? '👍'
                        : entry.mood === 'challenging'
                        ? '⚠️'
                        : entry.mood === 'neutral'
                        ? '⚖️'
                        : null;

                    return (
                      <div
                        key={`${entry.habitId}-${entry.logId}`}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          accessibility.highContrast
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                            : 'bg-[#FCFAF7] border-[#EAE0D0] text-[#2D2D2D]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#EFE8DC]/80">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                accessibility.highContrast
                                  ? `${cfg.darkBg} ${cfg.darkText} ${cfg.darkBorder}`
                                  : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`
                              }`}
                            >
                              <Icon className="w-2.5 h-2.5" />
                              <span>{cfg.label}</span>
                            </span>
                            <span className="text-xs font-bold text-[#2D2D2D]">
                              {entry.habitTitle}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-[#A89F91] font-mono">
                            {moodEmoji && <span>{moodEmoji}</span>}
                            <span>{entry.timestamp}</span>
                          </div>
                        </div>

                        <div className="pt-2 text-xs text-[#524B40] leading-relaxed break-words flex items-start justify-between gap-2">
                          <p className="flex-1">{entry.text}</p>
                          {entry.type === 'quick_log' && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteLogEntry(entry.habitId, entry.logId, e)}
                              className="p-1 text-[#A89F91] hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                              title="Delete log"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-[#EFE8DC] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const text = dailyGoals
                      .map((g) => {
                        const logs = (g.notesHistory || [])
                          .map((l) => `  - [${l.timestamp}] (${l.mood || 'log'}): ${l.text}`)
                          .join('\n');
                        return `• ${g.title} (${g.category})\n  Note: ${g.notes || 'None'}\n${logs}`;
                      })
                      .join('\n\n');
                    navigator.clipboard.writeText(text);
                    showToast('Copied all habit notes & logs to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#EFE8DC] bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C25E2B]" />
                  <span>Copy All Notes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowNotesFeedModal(false)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#C25E2B] text-white hover:bg-[#A84B1D] transition-all cursor-pointer shadow-2xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 12. Floating Toast Confirmation Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl border shadow-xl flex items-center gap-3 ${
              accessibility.highContrast
                ? 'bg-zinc-950 border-white text-white'
                : 'bg-white border-[#EFE8DC] shadow-artistic text-[#2D2D2D]'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#C25E2B]/15 text-[#C25E2B] flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium flex-1">{toastMessage}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-[#A89F91] hover:text-[#2D2D2D] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
