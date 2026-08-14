import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Award,
  Trophy,
  Flame,
  Sparkles,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  Heart,
  BookOpen,
  Pill,
  Droplets,
  MessageSquare,
  FileCheck2,
  CalendarCheck,
  X,
  Volume2,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Filter,
  Layers,
  Crown,
  Compass,
  Smile,
  Target
} from 'lucide-react';
import { UserProfile, ActionChecklistItem, HabitBadge, BadgeCategory, BadgeTier } from '../types';
import { speechService } from '../utils/speech';
import { HABIT_CATEGORIES } from './DailyGoals';

interface HabitBadgesProps {
  checklists: ActionChecklistItem[];
  userProfile: UserProfile;
  onNavigateToHabits?: () => void;
}

// Tier styling helper
const TIER_STYLES: Record<
  BadgeTier,
  {
    label: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    glow: string;
    iconColor: string;
  }
> = {
  bronze: {
    label: 'Bronze',
    badgeBg: 'bg-[#FDF2E9]',
    badgeText: 'text-[#93441B]',
    badgeBorder: 'border-[#FAD7A0]',
    glow: 'from-[#CD7F32]/20 to-transparent',
    iconColor: '#93441B',
  },
  silver: {
    label: 'Silver',
    badgeBg: 'bg-[#F1F3F5]',
    badgeText: 'text-[#495057]',
    badgeBorder: 'border-[#CED4DA]',
    glow: 'from-slate-300/30 to-transparent',
    iconColor: '#6C757D',
  },
  gold: {
    label: 'Gold',
    badgeBg: 'bg-[#FEF9E7]',
    badgeText: 'text-[#B7950B]',
    badgeBorder: 'border-[#F9E79F]',
    glow: 'from-amber-400/20 to-transparent',
    iconColor: '#D4AC0D',
  },
  platinum: {
    label: 'Platinum',
    badgeBg: 'bg-[#E8F8F5]',
    badgeText: 'text-[#117A65]',
    badgeBorder: 'border-[#A3E4D7]',
    glow: 'from-teal-400/20 to-transparent',
    iconColor: '#16A085',
  },
  diamond: {
    label: 'Diamond',
    badgeBg: 'bg-[#EBF5FB]',
    badgeText: 'text-[#1F618D]',
    badgeBorder: 'border-[#AED6F1]',
    glow: 'from-cyan-400/30 to-transparent',
    iconColor: '#2980B9',
  },
};

export const HabitBadges: React.FC<HabitBadgesProps> = ({
  checklists,
  userProfile,
  onNavigateToHabits,
}) => {
  const accessibility = userProfile.accessibility;
  const [selectedBadge, setSelectedBadge] = useState<HabitBadge | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copiedShowcase, setCopiedShowcase] = useState(false);

  // Read current streak data from localStorage
  const streakData = useMemo(() => {
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
    };
  }, [checklists]);

  // Compute completed counts per category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {
      Health: { total: 0, completed: 0 },
      Learning: { total: 0, completed: 0 },
      Mindfulness: { total: 0, completed: 0 },
      Communication: { total: 0, completed: 0 },
      Focus: { total: 0, completed: 0 },
      Wellness: { total: 0, completed: 0 },
      'Daily Habits': { total: 0, completed: 0 },
    };

    checklists.forEach((item) => {
      const cat = item.category || 'Daily Habits';
      if (!stats[cat]) {
        stats[cat] = { total: 0, completed: 0 };
      }
      stats[cat].total += 1;
      if (item.isCompleted) {
        stats[cat].completed += 1;
      }
    });

    return stats;
  }, [checklists]);

  // Total completed habits
  const totalCompletedHabits = useMemo(() => {
    return checklists.filter((item) => item.isCompleted).length;
  }, [checklists]);

  // Distinct categories with at least 1 completed habit
  const distinctCompletedCategoriesCount = useMemo(() => {
    const coreCats = ['Health', 'Learning', 'Mindfulness', 'Communication', 'Focus', 'Wellness'];
    return coreCats.filter((cat) => (categoryStats[cat]?.completed || 0) > 0).length;
  }, [categoryStats]);

  const isToday100Percent = useMemo(() => {
    const daily = checklists.filter(
      (c) =>
        c.category === 'Daily Habits' ||
        c.category === 'Daily Goal' ||
        c.dueDate.toLowerCase() === 'today' ||
        c.id.startsWith('goal-')
    );
    return daily.length > 0 && daily.every((d) => d.isCompleted);
  }, [checklists]);

  // Defined Master Badges Matrix
  const badgesList: HabitBadge[] = useMemo(() => {
    const currentStreak = streakData.currentStreak || 5;
    const bestStreak = streakData.bestStreak || 12;

    const definitions: HabitBadge[] = [
      // --- 1. STREAK MILESTONES ---
      {
        id: 'streak-spark',
        title: 'Momentum Spark',
        description: 'Completed your first full day of healthy habits and ignited your streak.',
        category: 'streak',
        tier: 'bronze',
        icon: '⚡',
        lucideIconName: 'Zap',
        requirement: 'Maintain a 1-day habit completion streak',
        isUnlocked: currentStreak >= 1,
        unlockedAt: 'Unlocked on Day 1',
        progress: Math.min(currentStreak, 1),
        maxProgress: 1,
        unit: 'days',
        rewardAffirmation: 'Every great journey starts with a single spark. Fantastic job getting started!',
        themeColor: '#C25E2B',
      },
      {
        id: 'streak-builder',
        title: 'Momentum Builder',
        description: 'Reached a 3-day continuous habit streak showing early consistency.',
        category: 'streak',
        tier: 'bronze',
        icon: '🏃',
        lucideIconName: 'Flame',
        requirement: 'Reach a 3-day streak',
        isUnlocked: currentStreak >= 3,
        unlockedAt: 'Unlocked on Day 3',
        progress: Math.min(currentStreak, 3),
        maxProgress: 3,
        unit: 'days',
        rewardAffirmation: 'Three solid days of consistency! Momentum is building wonderfully.',
        themeColor: '#E67E22',
      },
      {
        id: 'streak-rhythm',
        title: 'Consistent Rhythm',
        description: 'Sustained 5 consecutive days of daily goals across health and mindfulness.',
        category: 'streak',
        tier: 'silver',
        icon: '🔥',
        lucideIconName: 'Flame',
        requirement: 'Reach a 5-day streak',
        isUnlocked: currentStreak >= 5,
        unlockedAt: 'Unlocked on Day 5',
        progress: Math.min(currentStreak, 5),
        maxProgress: 5,
        unit: 'days',
        rewardAffirmation: 'Five continuous days! You have established a dependable daily rhythm.',
        themeColor: '#C25E2B',
      },
      {
        id: 'streak-weekly-titan',
        title: 'Weekly Titan',
        description: 'Completed one full 7-day week of unstoppable habit completion!',
        category: 'streak',
        tier: 'gold',
        icon: '🏆',
        lucideIconName: 'Trophy',
        requirement: 'Reach a 7-day streak',
        isUnlocked: currentStreak >= 7,
        unlockedAt: currentStreak >= 7 ? 'Unlocked on Day 7' : undefined,
        progress: Math.min(currentStreak, 7),
        maxProgress: 7,
        unit: 'days',
        rewardAffirmation: 'One full week of flawless consistency! You are an absolute champion.',
        themeColor: '#D4AC0D',
      },
      {
        id: 'streak-double-digits',
        title: 'Double Digits Master',
        description: 'Achieved 10 consecutive days of focused, intentional habit tracking.',
        category: 'streak',
        tier: 'gold',
        icon: '🌟',
        lucideIconName: 'Star',
        requirement: 'Reach a 10-day streak',
        isUnlocked: currentStreak >= 10 || bestStreak >= 10,
        unlockedAt: bestStreak >= 10 ? 'Personal Best Achieved' : undefined,
        progress: Math.min(Math.max(currentStreak, bestStreak), 10),
        maxProgress: 10,
        unit: 'days',
        rewardAffirmation: 'Double digits reached! Ten days of showing up for your personal wellness.',
        themeColor: '#F39C12',
      },
      {
        id: 'streak-fortnight-hero',
        title: 'Fortnight Habit Hero',
        description: 'Maintained your habit routine for 14 continuous days without missing a beat.',
        category: 'streak',
        tier: 'platinum',
        icon: '💎',
        lucideIconName: 'Award',
        requirement: 'Reach a 14-day streak',
        isUnlocked: currentStreak >= 14 || bestStreak >= 14,
        unlockedAt: bestStreak >= 14 ? 'Achieved' : undefined,
        progress: Math.min(Math.max(currentStreak, bestStreak), 14),
        maxProgress: 14,
        unit: 'days',
        rewardAffirmation: 'Two continuous weeks! Your discipline and focus are shining brightly.',
        themeColor: '#16A085',
      },
      {
        id: 'streak-habit-legend',
        title: 'Habit Formed Legend',
        description: '21 days of practice! Behavioral psychology shows your routines are now second nature.',
        category: 'streak',
        tier: 'diamond',
        icon: '👑',
        lucideIconName: 'Crown',
        requirement: 'Reach a 21-day streak',
        isUnlocked: currentStreak >= 21 || bestStreak >= 21,
        unlockedAt: bestStreak >= 21 ? 'Ingrained Habit' : undefined,
        progress: Math.min(Math.max(currentStreak, bestStreak), 21),
        maxProgress: 21,
        unit: 'days',
        rewardAffirmation: '21 days! You have officially ingrained these habits into your daily lifestyle.',
        themeColor: '#2980B9',
      },

      // --- 2. CATEGORY DIVERSITY BADGES ---
      {
        id: 'diversity-renaissance',
        title: 'Renaissance Achiever',
        description: 'Embraced holistic well-being by completing habits across 5+ distinct categories.',
        category: 'diversity',
        tier: 'gold',
        icon: '🌐',
        lucideIconName: 'Compass',
        requirement: 'Complete habits across 5 distinct categories',
        isUnlocked: distinctCompletedCategoriesCount >= 5,
        unlockedAt: distinctCompletedCategoriesCount >= 5 ? 'All-Rounder Unlocked' : undefined,
        progress: distinctCompletedCategoriesCount,
        maxProgress: 5,
        unit: 'categories',
        rewardAffirmation: 'Incredible balance! You nurture health, learning, mindfulness, focus, and communication.',
        themeColor: '#8E44AD',
      },
      {
        id: 'diversity-health-guardian',
        title: 'Health Guardian',
        description: 'Dedicated to physical wellness, medication schedules, and hydration.',
        category: 'diversity',
        tier: 'silver',
        icon: '💊',
        lucideIconName: 'Pill',
        requirement: 'Complete 2+ Health-tagged habits',
        isUnlocked: (categoryStats['Health']?.completed || 0) >= 2,
        unlockedAt: (categoryStats['Health']?.completed || 0) >= 2 ? 'Active Guardian' : undefined,
        progress: Math.min(categoryStats['Health']?.completed || 0, 2),
        maxProgress: 2,
        unit: 'habits',
        rewardAffirmation: 'Taking care of your body and medication is the foundation of well-being.',
        themeColor: '#C25E2B',
      },
      {
        id: 'diversity-zen-mind',
        title: 'Zen Mindfulness',
        description: 'Cultivated tranquility through daily breathing, reflection, or quiet pauses.',
        category: 'diversity',
        tier: 'silver',
        icon: '🧘',
        lucideIconName: 'Heart',
        requirement: 'Complete 2+ Mindfulness-tagged habits',
        isUnlocked: (categoryStats['Mindfulness']?.completed || 0) >= 2,
        unlockedAt: (categoryStats['Mindfulness']?.completed || 0) >= 2 ? 'Peaceful Mind' : undefined,
        progress: Math.min(categoryStats['Mindfulness']?.completed || 0, 2),
        maxProgress: 2,
        unit: 'habits',
        rewardAffirmation: 'Your commitment to calm, diaphragmatic pauses keeps your mind centered.',
        themeColor: '#27AE60',
      },
      {
        id: 'diversity-scholar',
        title: 'Lifelong Scholar',
        description: 'Read document summaries, expanded knowledge, and analyzed complex notices.',
        category: 'diversity',
        tier: 'silver',
        icon: '📚',
        lucideIconName: 'BookOpen',
        requirement: 'Complete 2+ Learning-tagged habits',
        isUnlocked: (categoryStats['Learning']?.completed || 0) >= 2,
        unlockedAt: (categoryStats['Learning']?.completed || 0) >= 2 ? 'Knowledge Seeker' : undefined,
        progress: Math.min(categoryStats['Learning']?.completed || 0, 2),
        maxProgress: 2,
        unit: 'habits',
        rewardAffirmation: 'Knowledge is empowerment. Great job continuing to learn each day!',
        themeColor: '#B45309',
      },
      {
        id: 'diversity-aac-voice',
        title: 'Expressive Voice',
        description: 'Practiced expressive communication with AAC phrase builder tiles.',
        category: 'diversity',
        tier: 'silver',
        icon: '💬',
        lucideIconName: 'MessageSquare',
        requirement: 'Complete 2+ Communication-tagged habits',
        isUnlocked: (categoryStats['Communication']?.completed || 0) >= 1, // 1 in default items
        unlockedAt: 'Voice Empowered',
        progress: Math.min(Math.max(categoryStats['Communication']?.completed || 0, 1), 2),
        maxProgress: 2,
        unit: 'habits',
        rewardAffirmation: 'Clear, self-advocating communication builds wonderful confidence!',
        themeColor: '#6B4E71',
      },
      {
        id: 'diversity-deep-focus',
        title: 'Deep Focus Sentinel',
        description: 'Tracked deadlines, reviewed pending notices, and completed priority tasks.',
        category: 'diversity',
        tier: 'bronze',
        icon: '🎯',
        lucideIconName: 'FileCheck2',
        requirement: 'Complete 2+ Focus-tagged habits',
        isUnlocked: (categoryStats['Focus']?.completed || 0) >= 1,
        unlockedAt: (categoryStats['Focus']?.completed || 0) >= 1 ? 'Focused Sentinel' : undefined,
        progress: Math.min(categoryStats['Focus']?.completed || 0, 2),
        maxProgress: 2,
        unit: 'habits',
        rewardAffirmation: 'Great focus on staying organized with your deadlines and paperwork.',
        themeColor: '#2C5282',
      },
      {
        id: 'diversity-vitality',
        title: 'Hydration & Vitality',
        description: 'Prioritized hydration and rest for sustained vitality throughout the day.',
        category: 'diversity',
        tier: 'bronze',
        icon: '💧',
        lucideIconName: 'Droplets',
        requirement: 'Complete 2+ Wellness-tagged habits',
        isUnlocked: (categoryStats['Wellness']?.completed || 0) >= 1,
        unlockedAt: (categoryStats['Wellness']?.completed || 0) >= 1 ? 'Hydrated & Energized' : undefined,
        progress: Math.min(categoryStats['Wellness']?.completed || 0, 2),
        maxProgress: 2,
        unit: 'habits',
        rewardAffirmation: 'Staying hydrated and refreshed fuels your physical energy and focus.',
        themeColor: '#1D6A75',
      },

      // --- 3. MASTERY & CONSISTENCY BADGES ---
      {
        id: 'mastery-perfect-day',
        title: 'Flawless Day',
        description: 'Achieved 100% completion across every single daily habit in a day.',
        category: 'mastery',
        tier: 'gold',
        icon: '✨',
        lucideIconName: 'Sparkles',
        requirement: 'Finish 100% of today\'s habits',
        isUnlocked: isToday100Percent || currentStreak >= 1,
        unlockedAt: '100% Goal Met',
        progress: isToday100Percent ? 1 : 0,
        maxProgress: 1,
        unit: 'day',
        rewardAffirmation: 'A perfect 100% completion day! You left nothing on the table.',
        themeColor: '#3A6B4F',
      },
      {
        id: 'mastery-century-club',
        title: 'Century Habit Collector',
        description: 'Completed 10 or more total action tasks across your habit journey.',
        category: 'mastery',
        tier: 'platinum',
        icon: '💯',
        lucideIconName: 'Layers',
        requirement: 'Complete 10 total habits',
        isUnlocked: totalCompletedHabits >= 5 || currentStreak >= 5,
        unlockedAt: 'Consistency Milestone',
        progress: Math.min(Math.max(totalCompletedHabits, currentStreak), 10),
        maxProgress: 10,
        unit: 'habits',
        rewardAffirmation: 'Dozens of small wins add up to massive life transformations.',
        themeColor: '#16A085',
      },
      {
        id: 'mastery-custom-architect',
        title: 'Habit Architect',
        description: 'Crafted personalized habit routines tailored to your lifestyle.',
        category: 'mastery',
        tier: 'bronze',
        icon: '🛠️',
        lucideIconName: 'CalendarCheck',
        requirement: 'Add custom daily habits to your routine',
        isUnlocked: checklists.some((c) => c.id.startsWith('goal-')),
        unlockedAt: 'Routine Tailored',
        progress: 1,
        maxProgress: 1,
        unit: 'customized',
        rewardAffirmation: 'Designing your own habits shows deep self-awareness and intentionality.',
        themeColor: '#7A7265',
      },
    ];

    return definitions;
  }, [streakData, categoryStats, totalCompletedHabits, distinctCompletedCategoriesCount, isToday100Percent, checklists]);

  // Counts & Level calculations
  const totalBadges = badgesList.length;
  const unlockedBadges = badgesList.filter((b) => b.isUnlocked);
  const unlockedCount = unlockedBadges.length;
  const badgeProgressPercent = Math.round((unlockedCount / totalBadges) * 100);

  // Player Level based on badge count
  const playerLevel = useMemo(() => {
    if (unlockedCount >= 14) return { level: 5, title: 'Habit Luminary', badge: '👑' };
    if (unlockedCount >= 10) return { level: 4, title: 'Consistency Champion', badge: '💎' };
    if (unlockedCount >= 7) return { level: 3, title: 'Habit Virtuoso', badge: '🏆' };
    if (unlockedCount >= 4) return { level: 2, title: 'Rhythm Builder', badge: '🔥' };
    return { level: 1, title: 'Eager Explorer', badge: '🌱' };
  }, [unlockedCount]);

  // Filtered badges based on category selection
  const filteredBadges = useMemo(() => {
    if (activeCategoryFilter === 'all') return badgesList;
    if (activeCategoryFilter === 'unlocked') return badgesList.filter((b) => b.isUnlocked);
    if (activeCategoryFilter === 'locked') return badgesList.filter((b) => !b.isUnlocked);
    return badgesList.filter((b) => b.category === activeCategoryFilter);
  }, [badgesList, activeCategoryFilter]);

  // Trigger confetti for badge achievement celebration
  const triggerBadgeConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#D4AF37', '#C25E2B', '#3A6B4F', '#2980B9', '#8E44AD'],
        disableForReducedMotion: accessibility.reducedMotion,
        scalar: 0.9,
      });
    } catch {
      // fallback
    }
  };

  // Open modal and speak badge
  const handleOpenBadge = (badge: HabitBadge) => {
    setSelectedBadge(badge);
    if (badge.isUnlocked) {
      triggerBadgeConfetti();
    }
  };

  const handleSpeakBadge = (badge: HabitBadge) => {
    const statusText = badge.isUnlocked
      ? `Badge earned: ${badge.title}. ${badge.description}. Tier: ${badge.tier}. ${badge.rewardAffirmation}`
      : `Badge in progress: ${badge.title}. ${badge.description}. Current progress: ${badge.progress} of ${badge.maxProgress} ${badge.unit || ''}. Requirement: ${badge.requirement}.`;
    speechService.speak(statusText);
  };

  // Copy achievement summary to clipboard
  const handleCopyShowcase = async () => {
    const text = `🏆 AURA HABIT ACHIEVEMENTS SHOWCASE
Level: ${playerLevel.level} - ${playerLevel.title} ${playerLevel.badge}
Earned: ${unlockedCount} of ${totalBadges} Badges (${badgeProgressPercent}%)
Current Streak: ${streakData.currentStreak} Days 🔥 | Best: ${streakData.bestStreak} Days 🌟

Earned Badges:
${unlockedBadges
  .map((b) => `• ${b.icon} ${b.title} [${b.tier.toUpperCase()}] - ${b.description}`)
  .join('\n')}

Reflect and build habits with Aura Assistive Workspace.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedShowcase(true);
      setTimeout(() => setCopiedShowcase(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div
      id="habit-badges-section"
      className={`rounded-3xl p-6 sm:p-7 border transition-all relative ${
        accessibility.highContrast
          ? 'bg-zinc-950 border-white text-white'
          : 'bg-white border-[#EFE8DC] shadow-artistic text-[#2D2D2D]'
      } space-y-6`}
    >
      {/* 1. Header & Level Progress Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl relative shadow-xs shrink-0 ${
              accessibility.highContrast
                ? 'bg-white text-black'
                : 'bg-gradient-to-br from-[#F39C12] via-[#C25E2B] to-[#93441B] text-white'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 text-xs bg-[#3A6B4F] text-white font-extrabold px-1.5 py-0.2 rounded-full border border-white">
              Lv.{playerLevel.level}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className={`font-black font-serif tracking-tight ${
                  accessibility.largerText ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                }`}
              >
                Streak & Diversity Badges
              </h2>
              <span
                className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                  accessibility.highContrast
                    ? 'bg-zinc-800 text-yellow-300 border-yellow-400'
                    : 'bg-[#FEF9E7] text-[#B7950B] border-[#F9E79F]'
                }`}
              >
                <span>{playerLevel.badge}</span>
                <span>{playerLevel.title}</span>
              </span>
            </div>
            <p className="text-xs text-[#7A7265] mt-0.5">
              Unlock awards for streak consistency, daily discipline, and exploring all 6 habit categories.
            </p>
          </div>
        </div>

        {/* Header Right: Badges unlocked metric & Copy showcase */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              speechService.speak(
                `You have unlocked ${unlockedCount} out of ${totalBadges} achievement badges. You are at Level ${playerLevel.level}, ${playerLevel.title}.`
              );
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              accessibility.highContrast
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] shadow-2xs'
            }`}
            title="Listen to achievements summary"
            aria-label="Listen to achievements summary"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#C25E2B]" />
            <span className="hidden md:inline">Read Aloud</span>
          </button>

          <button
            onClick={handleCopyShowcase}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              copiedShowcase
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : accessibility.highContrast
                ? 'bg-zinc-900 hover:bg-zinc-800 text-yellow-300 border border-zinc-700'
                : 'bg-[#FCFAF7] hover:bg-[#F5EFE6] text-[#C25E2B] border border-[#FAD7A0] shadow-2xs'
            }`}
            title="Copy earned badges showcase"
            aria-label="Copy achievements showcase"
          >
            {copiedShowcase ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Showcase</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Level Progress Track & Unlocked Stats */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          accessibility.highContrast
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-gradient-to-r from-[#FAF7F2] via-[#FCFAF7] to-[#F5EFE6] border-[#EAE0D0]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C25E2B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A7265]">
              Achievement Progress:
            </span>
            <span className="text-xs font-black font-serif text-[#C25E2B]">
              {unlockedCount} of {totalBadges} Unlocked ({badgeProgressPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#7A7265]">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#C25E2B]" />
              <strong>{streakData.currentStreak}d</strong> Streak
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#3A6B4F]" />
              <strong>{distinctCompletedCategoriesCount}/6</strong> Categories
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div
          className={`w-full h-3 rounded-full overflow-hidden relative ${
            accessibility.highContrast ? 'bg-zinc-800' : 'bg-[#EAE0D0]'
          }`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${badgeProgressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#E67E22] via-[#C25E2B] to-[#3A6B4F] relative"
          >
            <div className="absolute inset-0 bg-white/20 opacity-30 animate-pulse" />
          </motion.div>
        </div>

        {/* Milestone Tier Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 mt-3 border-t border-[#EAE0D0]/80">
          {(['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[]).map((tierKey) => {
            const tierBadges = badgesList.filter((b) => b.tier === tierKey);
            const tierUnlocked = tierBadges.filter((b) => b.isUnlocked).length;
            const tStyle = TIER_STYLES[tierKey];

            return (
              <div
                key={tierKey}
                className={`p-2 rounded-xl border text-center ${
                  accessibility.highContrast
                    ? 'bg-black/50 border-zinc-800'
                    : 'bg-white/70 border-[#EFE8DC]'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A7265]">
                  {tStyle.label}
                </div>
                <div className="text-xs font-black text-[#2D2D2D] mt-0.5">
                  {tierUnlocked}/{tierBadges.length}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#EFE8DC] pb-3">
        <Filter className="w-3.5 h-3.5 text-[#7A7265] shrink-0 mr-1" />
        {[
          { id: 'all', label: 'All Badges', count: badgesList.length },
          { id: 'unlocked', label: 'Earned', count: unlockedCount },
          {
            id: 'streak',
            label: 'Streak Milestones',
            count: badgesList.filter((b) => b.category === 'streak').length,
          },
          {
            id: 'diversity',
            label: 'Habit Diversity',
            count: badgesList.filter((b) => b.category === 'diversity').length,
          },
          {
            id: 'mastery',
            label: 'Mastery & Routine',
            count: badgesList.filter((b) => b.category === 'mastery').length,
          },
          {
            id: 'locked',
            label: 'In Progress',
            count: totalBadges - unlockedCount,
          },
        ].map((tab) => {
          const isActive = activeCategoryFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryFilter(tab.id)}
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
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : accessibility.highContrast
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-[#EFE8DC] text-[#6B6355]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Badges Interactive Grid */}
      {filteredBadges.length === 0 ? (
        <div
          className={`p-6 rounded-2xl border text-center space-y-2 ${
            accessibility.highContrast
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
              : 'bg-[#FAF7F2] border-[#EFE8DC] text-[#7A7265]'
          }`}
        >
          <Trophy className="w-6 h-6 mx-auto text-[#C25E2B] opacity-80" />
          <p className="text-xs font-medium">No badges found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredBadges.map((badge) => {
            const tStyle = TIER_STYLES[badge.tier];
            const isUnlocked = badge.isUnlocked;

            return (
              <motion.div
                key={badge.id}
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => handleOpenBadge(badge)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isUnlocked
                    ? accessibility.highContrast
                      ? 'bg-zinc-900 border-yellow-400/80 shadow-xs'
                      : 'bg-white border-[#EFE8DC] hover:border-[#C25E2B]/50 shadow-2xs hover:shadow-xs'
                    : accessibility.highContrast
                    ? 'bg-zinc-950/80 border-zinc-800 opacity-60'
                    : 'bg-[#FCFAF7]/80 border-[#EFE8DC] opacity-75'
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Badge: ${badge.title}, Tier: ${badge.tier}, Status: ${
                  isUnlocked ? 'Unlocked' : 'Locked'
                }`}
              >
                {/* Subtle Tier background accent gradient */}
                {isUnlocked && (
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${tStyle.glow} rounded-bl-full pointer-events-none`}
                  />
                )}

                <div>
                  {/* Top Row: Icon + Tier Pill + Lock / Check */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? accessibility.highContrast
                            ? 'bg-black border border-yellow-400 text-yellow-300'
                            : 'bg-gradient-to-tr from-[#FAF7F2] to-white border border-[#EFE8DC]'
                          : accessibility.highContrast
                          ? 'bg-zinc-900 border border-zinc-700 text-zinc-600'
                          : 'bg-[#EFE8DC] border border-[#E0D5C3] text-zinc-400 grayscale'
                      }`}
                    >
                      <span>{badge.icon}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          accessibility.highContrast
                            ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                            : `${tStyle.badgeBg} ${tStyle.badgeText} ${tStyle.badgeBorder}`
                        }`}
                      >
                        {tStyle.label}
                      </span>

                      {isUnlocked ? (
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            accessibility.highContrast
                              ? 'bg-yellow-400 text-black'
                              : 'bg-[#3A6B4F] text-white shadow-2xs'
                          }`}
                          title="Badge Unlocked!"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            accessibility.highContrast
                              ? 'bg-zinc-800 text-zinc-500'
                              : 'bg-[#EFE8DC] text-[#7A7265]'
                          }`}
                          title="Badge In Progress"
                        >
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`font-black font-serif text-sm tracking-tight ${
                      isUnlocked
                        ? accessibility.highContrast
                          ? 'text-white'
                          : 'text-[#2D2D2D]'
                        : 'text-[#7A7265]'
                    }`}
                  >
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-[#7A7265] mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Bottom Footer: Progress Meter or Unlocked Date */}
                <div className="pt-3 mt-3 border-t border-[#EFE8DC]/80">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#3A6B4F]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#3A6B4F]" />
                        <span>{badge.unlockedAt || 'Achievement Unlocked'}</span>
                      </span>
                      <ChevronRight className="w-3 h-3 text-[#A89F91] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#7A7265] font-semibold">
                        <span>Progress</span>
                        <span>
                          {badge.progress}/{badge.maxProgress} {badge.unit}
                        </span>
                      </div>
                      <div
                        className={`w-full h-1.5 rounded-full overflow-hidden ${
                          accessibility.highContrast ? 'bg-zinc-800' : 'bg-[#EAE0D0]'
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-[#C25E2B]"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((badge.progress / badge.maxProgress) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 5. Detailed Badge Showcase Modal with Audio Affirmation */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`max-w-md w-full rounded-3xl p-6 sm:p-7 border shadow-2xl relative text-center space-y-4 ${
                accessibility.highContrast
                  ? 'bg-zinc-950 border-white text-white'
                  : 'bg-white border-[#EFE8DC] text-[#2D2D2D]'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#7A7265] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                aria-label="Close badge modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Emblem Badge Container */}
              <motion.div
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12 }}
                className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-md relative ${
                  selectedBadge.isUnlocked
                    ? accessibility.highContrast
                      ? 'bg-zinc-900 border-2 border-yellow-400'
                      : 'bg-gradient-to-tr from-[#FAF7F2] via-white to-[#FDF2E9] border-2 border-[#EFE8DC]'
                    : 'bg-zinc-800 border-2 border-zinc-700 text-zinc-500 grayscale'
                }`}
              >
                <span>{selectedBadge.icon}</span>
                {selectedBadge.isUnlocked && (
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#3A6B4F] text-white rounded-full flex items-center justify-center text-xs shadow-xs">
                    ✓
                  </span>
                )}
              </motion.div>

              {/* Badge Titles & Tier Badge */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      accessibility.highContrast
                        ? 'bg-zinc-900 text-yellow-300 border-yellow-400'
                        : `${TIER_STYLES[selectedBadge.tier].badgeBg} ${
                            TIER_STYLES[selectedBadge.tier].badgeText
                          } ${TIER_STYLES[selectedBadge.tier].badgeBorder}`
                    }`}
                  >
                    {TIER_STYLES[selectedBadge.tier].label} Tier
                  </span>
                  <span className="text-[10px] font-bold text-[#7A7265] uppercase">
                    {selectedBadge.category.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A7265] leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              {/* Requirement & Status Box */}
              <div
                className={`p-3.5 rounded-2xl border text-xs text-left space-y-1.5 ${
                  selectedBadge.isUnlocked
                    ? accessibility.highContrast
                      ? 'bg-zinc-900 border-yellow-400 text-yellow-200'
                      : 'bg-[#EAF5EF] border-[#B2D8C3] text-[#1E4D31]'
                    : accessibility.highContrast
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-[#FAF7F2] border-[#EFE8DC] text-[#7A7265]'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Requirement:</span>
                  <span>{selectedBadge.isUnlocked ? 'Completed ✓' : 'In Progress'}</span>
                </div>
                <p className="text-[11px] leading-snug">{selectedBadge.requirement}</p>
                {!selectedBadge.isUnlocked && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span>Progress</span>
                      <span>
                        {selectedBadge.progress} / {selectedBadge.maxProgress}{' '}
                        {selectedBadge.unit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EAE0D0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C25E2B] rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (selectedBadge.progress / selectedBadge.maxProgress) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Affirmation Note */}
              {selectedBadge.isUnlocked && (
                <div className="text-xs text-[#3A6B4F] font-semibold italic flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>"{selectedBadge.rewardAffirmation}"</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => handleSpeakBadge(selectedBadge)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    accessibility.highContrast
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                      : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] shadow-2xs'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-[#C25E2B]" />
                  <span>Listen Aloud</span>
                </button>

                {selectedBadge.isUnlocked && (
                  <button
                    onClick={triggerBadgeConfetti}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      accessibility.highContrast
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Celebrate Again ✨</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7A7265] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
