import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Mic,
  Upload,
  Keyboard,
  Sparkles,
  ArrowRight,
  Eye,
  MessageSquare,
  ListTodo,
  Globe,
  CheckCircle2,
  Clock,
  FileText,
  Volume2,
  Plus
} from 'lucide-react';
import { UserProfile, ActionChecklistItem } from '../types';
import { speechService } from '../utils/speech';
import { DailyGoals } from './DailyGoals';
import { HabitBadges } from './HabitBadges';
import { HabitProgressChart } from './HabitProgressChart';

interface DashboardHomeProps {
  userProfile: UserProfile;
  onNavigate: (view: string, params?: any) => void;
  checklists: ActionChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onQuickUnderstandText: (text: string) => void;
  onAddChecklist: (item: ActionChecklistItem) => void;
  onUpdateChecklist?: (item: ActionChecklistItem) => void;
  onDeleteChecklist?: (id: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  userProfile,
  onNavigate,
  checklists,
  onToggleChecklist,
  onQuickUnderstandText,
  onAddChecklist,
  onUpdateChecklist,
  onDeleteChecklist,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleVoiceListen = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      speechService.speak("Voice recognition is active. You can also type or use camera scanning.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListeningVoice(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListeningVoice(false);
      setTypedInput(transcript);
      onQuickUnderstandText(transcript);
    };

    recognition.onerror = () => {
      setIsListeningVoice(false);
    };

    recognition.onend = () => {
      setIsListeningVoice(false);
    };
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim()) {
      onQuickUnderstandText(typedInput);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* 1. GREETING & STATUS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#F5EFE6] via-[#FAF7F2] to-transparent p-6 rounded-3xl border border-[#EFE8DC] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#93441B] bg-[#F5EFE6] border border-[#E8DCCB] px-2.5 py-0.5 rounded-full">
              {userProfile.experienceStyle} mode active
            </span>
            <span className="text-xs text-[#7A7265]">
              Personalized for {userProfile.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-[#2D2D2D] mt-1">
            {getGreeting()}, {userProfile.name} 👋
          </h1>
          <p className="text-sm text-[#6B6355] mt-0.5">
            What would you like help understanding or communicating today?
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('understand')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera</span>
          </button>
          <button
            onClick={() => onNavigate('communicate')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#C25E2B]" />
            <span>Communicate</span>
          </button>
        </div>
      </div>

      {/* 2. CENTRAL MULTIMODAL INPUT HUB */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8DC] shadow-artistic space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] text-[#93441B] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-[#C25E2B]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-[#2D2D2D]">
                Multimodal Input Portal
              </h2>
              <p className="text-xs text-[#7A7265]">
                Choose any natural way to provide information or ask for help
              </p>
            </div>
          </div>
        </div>

        {/* 4 Large Multimodal Entry Points */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Show something (Camera) */}
          <button
            onClick={() => onNavigate('understand')}
            className="p-5 rounded-2xl bg-[#FCFAF7] hover:bg-[#F8F2E8] border-2 border-[#EFE8DC] hover:border-[#D6C2A5] text-left transition-all group flex flex-col justify-between h-36 cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C25E2B] text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-110">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#2D2D2D] flex items-center justify-between font-serif">
                <span>Show something</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C25E2B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-[#7A7265] mt-0.5">Camera vision scanner</p>
            </div>
          </button>

          {/* 2. Tell me (Voice) */}
          <button
            onClick={handleVoiceListen}
            className={`p-5 rounded-2xl border-2 text-left transition-all group flex flex-col justify-between h-36 cursor-pointer shadow-2xs ${
              isListeningVoice
                ? 'bg-rose-50 border-rose-400 animate-pulse'
                : 'bg-[#F7FAF8] hover:bg-[#EDF5F0] border-[#DCEBE2] hover:border-[#B2D8C3]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#3A6B4F] text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-110">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#2D2D2D] flex items-center justify-between font-serif">
                <span>{isListeningVoice ? 'Listening...' : 'Tell me'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3A6B4F] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-[#7A7265] mt-0.5">Voice question or speech</p>
            </div>
          </button>

          {/* 3. Upload (Document) */}
          <button
            onClick={() => onNavigate('understand', { tab: 'upload' })}
            className="p-5 rounded-2xl bg-[#F8F7FA] hover:bg-[#EFEBF4] border-2 border-[#E2DBE9] hover:border-[#C4B7D2] text-left transition-all group flex flex-col justify-between h-36 cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5B487A] text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-110">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#2D2D2D] flex items-center justify-between font-serif">
                <span>Upload notice</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#5B487A] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-[#7A7265] mt-0.5">PDF or photo file drop</p>
            </div>
          </button>

          {/* 4. Type (Text prompt) */}
          <button
            onClick={() => {
              const el = document.getElementById('dashboard-text-input');
              el?.focus();
            }}
            className="p-5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border-2 border-[#EFE8DC] hover:border-[#D6C2A5] text-left transition-all group flex flex-col justify-between h-36 cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3D352B] text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-110">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#2D2D2D] flex items-center justify-between font-serif">
                <span>Type or paste</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3D352B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-[#7A7265] mt-0.5">Paste confusing text</p>
            </div>
          </button>
        </div>

        {/* Quick Text Input Box */}
        <form onSubmit={handleTextSubmit} className="relative pt-2">
          <div className="flex gap-2">
            <input
              id="dashboard-text-input"
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Paste any confusing clause, notice text, or question (e.g. 'What does Annexure B mean?')..."
              className="flex-1 px-4 py-3 rounded-xl border border-[#EFE8DC] bg-[#FAF7F2] focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/50 transition-all text-[#2D2D2D]"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="px-5 py-3 rounded-xl bg-[#2D2D2D] hover:bg-[#1E1E1E] disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Analyze with Aura
            </button>
          </div>
        </form>
      </div>

      {/* 3. FOUR CORE ACTION PANELS WITH LIVE EXAMPLES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black font-serif tracking-tight text-[#2D2D2D]">
            Core Action Capabilities
          </h2>
          <span className="text-xs text-[#7A7265]">
            Click any capability to try with live examples
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Core Panel 1: UNDERSTAND */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE8DC] shadow-artistic flex flex-col justify-between space-y-4 hover:border-[#D6C2A5] transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] text-[#93441B] flex items-center justify-center font-bold">
                    <Eye className="w-4 h-4 text-[#C25E2B]" />
                  </div>
                  <h3 className="font-bold text-base font-serif text-[#2D2D2D]">1. Understand</h3>
                </div>
                <span className="text-[11px] font-semibold text-[#93441B] bg-[#F5EFE6] px-2 py-0.5 rounded-md border border-[#E8DCCB]">
                  Multimodal Vision
                </span>
              </div>
              <p className="text-xs text-[#6B6355] leading-relaxed">
                Point your camera or upload a notice, form, sign, medical prescription, or screen.
                Aura detects what matters, extracts key deadlines, and shows you exactly why.
              </p>

              {/* Live Mini Example */}
              <div className="p-3 bg-[#FCFAF7] rounded-xl border border-[#EFE8DC] text-xs space-y-1 font-mono">
                <div className="text-[#93441B] font-bold">Example: Scholarship Notice</div>
                <div className="text-[#5A5248]">"Deadline: Sept 17 · Missing: Income Cert · $4,500"</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('understand')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#C25E2B] hover:bg-[#A84B1D] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Scan & Understand Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Panel 2: COMMUNICATE */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE8DC] shadow-artistic flex flex-col justify-between space-y-4 hover:border-[#B2D8C3] transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F7F3] text-[#2D5A40] flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4 text-[#3A6B4F]" />
                  </div>
                  <h3 className="font-bold text-base font-serif text-[#2D2D2D]">2. Communicate</h3>
                </div>
                <span className="text-[11px] font-semibold text-[#2D5A40] bg-[#F0F7F3] px-2 py-0.5 rounded-md border border-[#D0E6D9]">
                  Fragment → Sentence
                </span>
              </div>
              <p className="text-xs text-[#6B6355] leading-relaxed">
                Tap short fragment tiles (e.g. <em>water + teacher + please</em>) to synthesize complete,
                polite sentences with instant speech playback and large display cards.
              </p>

              {/* Live Mini Example */}
              <div className="p-3 bg-[#F0F7F3] rounded-xl border border-[#D0E6D9] text-xs space-y-1 font-mono">
                <div className="text-[#2D5A40] font-bold">"water + teacher + please" →</div>
                <div className="text-[#5A5248]">"Excuse me teacher, could I please have some water?"</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('communicate')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#3A6B4F] hover:bg-[#2F5740] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Open Sentence Constructor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Panel 3: ACT */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE8DC] shadow-artistic flex flex-col justify-between space-y-4 hover:border-[#CFE0F0] transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF4F9] text-[#2C4A6F] flex items-center justify-center font-bold">
                    <ListTodo className="w-4 h-4 text-[#2C4A6F]" />
                  </div>
                  <h3 className="font-bold text-base font-serif text-[#2D2D2D]">3. Act & Checklists</h3>
                </div>
                <span className="text-[11px] font-semibold text-[#2C4A6F] bg-[#EFF4F9] px-2 py-0.5 rounded-md border border-[#CFE0F0]">
                  Actionable Tasks
                </span>
              </div>
              <p className="text-xs text-[#6B6355] leading-relaxed">
                Turns parsed forms into structured to-do checklists with priority badges, step-by-step
                guidance, and deadlines so nothing slips through the cracks.
              </p>

              {/* Live Mini Example */}
              <div className="p-3 bg-[#EFF4F9] rounded-xl border border-[#CFE0F0] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#2C4A6F] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2C4A6F]" />
                  <span>3 active tasks due this month</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('actions')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#2C4A6F] hover:bg-[#203752] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>View My Action Checklists</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Panel 4: ADAPTIVE DEMO */}
          <div className="bg-white rounded-2xl p-6 border border-[#EFE8DC] shadow-artistic flex flex-col justify-between space-y-4 hover:border-[#D6C2A5] transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#2D2D2D] flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4 text-[#7A7265]" />
                  </div>
                  <h3 className="font-bold text-base font-serif text-[#2D2D2D]">4. Adaptive Rendering</h3>
                </div>
                <span className="text-[11px] font-semibold text-[#5A5248] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EFE8DC]">
                  4 Presentation Styles
                </span>
              </div>
              <p className="text-xs text-[#6B6355] leading-relaxed">
                Experience how AuraBridge renders the exact same source document in Standard,
                Simple, Visual Steps, and Spoken Voice modes simultaneously.
              </p>

              {/* Live Mini Example */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE8DC] text-xs space-y-1">
                <div className="text-[#2D2D2D] font-bold">Standard · Simple · Visual · Voice</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('adaptive')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#2D2D2D] hover:bg-[#1E1E1E] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Launch Adaptive Comparison</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. DAILY GOALS & MICRO-HABITS TRACKER */}
      <DailyGoals
        checklists={checklists}
        onToggleChecklist={onToggleChecklist}
        onAddChecklist={onAddChecklist}
        onUpdateChecklist={onUpdateChecklist}
        onDeleteChecklist={onDeleteChecklist}
        userProfile={userProfile}
      />

      {/* 5. 7-DAY RECHARTS HABIT COMPLETION ANALYTICS BY CATEGORY */}
      <HabitProgressChart
        checklists={checklists}
        userProfile={userProfile}
      />

      {/* 6. STREAK & HABIT DIVERSITY BADGES REWARDS SYSTEM */}
      <HabitBadges
        checklists={checklists}
        userProfile={userProfile}
        onNavigateToHabits={() => {
          const el = document.getElementById('daily-goals-widget');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 7. PINNED ACTIONS & RECENT ACTIVITY WIDGET */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE8DC] shadow-artistic space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-[#C25E2B]" />
            <h2 className="font-bold text-base sm:text-lg font-serif text-[#2D2D2D]">
              Active Action Checklists
            </h2>
          </div>
          <button
            onClick={() => onNavigate('actions')}
            className="text-xs font-semibold text-[#C25E2B] hover:text-[#93441B] underline flex items-center gap-1 cursor-pointer"
          >
            View All ({checklists.length})
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-[#EFE8DC]">
          {checklists.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF7F2] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleChecklist(item.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
                    item.isCompleted
                      ? 'bg-[#3A6B4F] border-[#3A6B4F] text-white'
                      : 'border-[#B8AF9F] hover:border-[#8C8270] bg-white'
                  }`}
                  aria-label={`Toggle task: ${item.title}`}
                >
                  {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <div>
                  <div
                    className={`text-xs sm:text-sm font-semibold ${
                      item.isCompleted ? 'line-through text-[#A89F91]' : 'text-[#2D2D2D]'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#7A7265] flex items-center gap-2 mt-0.5">
                    <span className="font-medium text-[#93441B]">{item.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#7A7265]">
                      <Clock className="w-3 h-3" />
                      Due {item.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  item.priority === 'high'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-[#FAF7F2] text-[#6B6355] border border-[#EFE8DC]'
                }`}
              >
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
