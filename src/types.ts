export type ExperienceStyle = 'quick' | 'detailed' | 'voice' | 'visual' | 'adaptive';
export type ExplanationStyle = 'simple' | 'quick' | 'detailed' | 'adaptive';
export type CommunicationTone = 'Friendly' | 'Polite' | 'Formal' | 'Urgent' | 'Simple';

export interface UserAccessibilityPreferences {
  largerText: boolean;
  highContrast: boolean;
  voiceGuidance: boolean;
  reducedMotion: boolean;
  simplifiedLanguage: boolean;
  preferNotToSay?: boolean;
}

export interface UserProfile {
  name: string;
  experienceStyle: ExperienceStyle;
  communicationModes: string[];
  explanationStyle: ExplanationStyle;
  accessibility: UserAccessibilityPreferences;
  languages: string[];
  personalizationEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface EssentialFact {
  id: string;
  label: string;
  value: string;
  sourceExcerpt: string;
  locationCitation: string;
  confidence?: number;
  highlightCoordinates?: { x: number; y: number; width: number; height: number }; // percentage based
}

export interface UnderstandResult {
  id: string;
  classification: string;
  title: string;
  oneLineSummary: string;
  essentialFacts: EssentialFact[];
  whatToDoNext: string[];
  simplifiedExplanation: string;
  confidenceScore: number;
  explainabilityNote: string;
  rawText?: string;
  timestamp: string;
  liveAi?: boolean;
  sampleType?: string;
}

export interface ExplainabilityTarget {
  claimLabel: string;
  claimValue: string;
  sourceExcerpt: string;
  locationCitation: string;
  confidenceScore: number;
  rationale: string;
  documentTitle: string;
  sampleType?: string;
}

export interface VisualStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  status: 'Completed' | 'Action Needed' | 'Pending' | 'Important';
}

export interface AdaptiveData {
  sourceTitle: string;
  standard: string;
  simple: string;
  visualSteps: VisualStep[];
  voiceScript: string;
  keyMetrics: { label: string; value: string }[];
}

export interface HabitNoteLog {
  id: string;
  text: string;
  timestamp: string; // e.g. "Aug 14, 2026, 09:15 AM"
  mood?: 'great' | 'good' | 'neutral' | 'challenging';
}

export interface ActionChecklistItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  isCompleted: boolean;
  sourceDocName: string;
  notes?: string;
  notesHistory?: HabitNoteLog[];
  priority: 'high' | 'medium' | 'low';
  reminderTime?: string; // e.g., "08:30" (24-hour HH:MM format)
  reminderEnabled?: boolean;
}

export type BadgeCategory = 'streak' | 'diversity' | 'mastery' | 'milestone';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface HabitBadge {
  id: string;
  title: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  icon: string; // emoji or identifier
  lucideIconName?: string;
  requirement: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  unit?: string;
  rewardAffirmation: string;
  themeColor: string;
}

export interface CommunicationFragment {
  id: string;
  text: string;
  category: 'who' | 'action' | 'what' | 'manner' | 'places';
  icon?: string;
}

export interface SentenceVariation {
  tone: string;
  sentence: string;
}

export interface CommunicationSynthesis {
  composedSentence: string;
  phoneticPronunciation?: string;
  variations: SentenceVariation[];
  followUpSuggestions: string[];
  explainIntent: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex',
  experienceStyle: 'adaptive',
  communicationModes: ['Voice', 'Tapping', 'Camera'],
  explanationStyle: 'adaptive',
  accessibility: {
    largerText: false,
    highContrast: false,
    voiceGuidance: false,
    reducedMotion: false,
    simplifiedLanguage: false,
  },
  languages: ['English', 'Spanish'],
  personalizationEnabled: true,
  onboardingCompleted: false,
};

export const DEFAULT_CHECKLIST_ITEMS: ActionChecklistItem[] = [
  {
    id: 'goal-1',
    title: 'Review today\'s notices and appointment slips with Aura',
    category: 'Daily Habits',
    dueDate: 'Today',
    isCompleted: false,
    sourceDocName: 'Daily Habits Routine',
    priority: 'medium',
    reminderTime: '09:00',
    reminderEnabled: true,
    notes: 'Reviewed clinic instructions and highlighted doctor follow-up items.',
    notesHistory: [
      {
        id: 'log-1',
        text: 'Checked clinic notices; doctor suggested drinking more fluids.',
        timestamp: 'Aug 14, 2026, 09:15 AM',
        mood: 'great',
      },
      {
        id: 'log-2',
        text: 'Listened to voice summary of insurance explanation of benefits.',
        timestamp: 'Aug 13, 2026, 09:40 AM',
        mood: 'good',
      },
    ],
  },
  {
    id: 'goal-2',
    title: 'Practice 2 quick phrases in AAC sentence constructor',
    category: 'Daily Habits',
    dueDate: 'Today',
    isCompleted: true,
    sourceDocName: 'Daily Habits Routine',
    priority: 'low',
    reminderTime: '14:30',
    reminderEnabled: true,
    notes: 'Practiced "I need a quiet break" and "Please repeat instructions".',
    notesHistory: [
      {
        id: 'log-3',
        text: 'Mastered emergency phrases and saved to quick-access board.',
        timestamp: 'Aug 14, 2026, 02:45 PM',
        mood: 'great',
      },
    ],
  },
  {
    id: 'act-1',
    title: 'Submit Parent 2025 Tax Returns & Income Verification Certificate',
    category: 'State Honors Scholarship',
    dueDate: 'Sept 17, 2026',
    isCompleted: false,
    sourceDocName: 'State Honors Scholarship Verification',
    priority: 'high',
    notes: 'Upload directly to university bursar portal before 11:59 PM EST',
    notesHistory: [
      {
        id: 'log-4',
        text: 'Scanned 1040 schedule documents; awaiting parent e-signature.',
        timestamp: 'Aug 12, 2026, 04:20 PM',
        mood: 'good',
      },
    ],
  },
  {
    id: 'act-2',
    title: 'Maintain minimum 3.20 cumulative GPA across Fall semester',
    category: 'State Honors Scholarship',
    dueDate: 'Dec 15, 2026',
    isCompleted: false,
    sourceDocName: 'State Honors Scholarship Verification',
    priority: 'medium',
    notes: 'Study group scheduled Tuesdays & Thursdays in library.',
  },
  {
    id: 'act-3',
    title: 'Pick up Amoxicillin prescription from pharmacy (take with food)',
    category: 'Valley Medical Discharge',
    dueDate: 'Today',
    isCompleted: false,
    sourceDocName: 'Valley Medical Clinic Discharge',
    priority: 'high',
    reminderTime: '11:00',
    reminderEnabled: true,
    notes: 'Confirm prescription copay and request easy-open bottle cap.',
    notesHistory: [
      {
        id: 'log-5',
        text: 'Called pharmacy ahead of time; prescription is filled and ready at counter.',
        timestamp: 'Aug 14, 2026, 10:10 AM',
        mood: 'great',
      },
    ],
  },
  {
    id: 'act-4',
    title: 'Pay past due balance ($142.50) to prevent power shutoff',
    category: 'Metro Electric Notice',
    dueDate: 'Oct 04, 2026',
    isCompleted: false,
    sourceDocName: 'Metro Electric Final Notice',
    priority: 'high',
    notes: 'Applied for utility low-income discount program code on bill.',
  },
];

