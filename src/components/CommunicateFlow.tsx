import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Volume2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  ArrowRight,
  BookOpen,
  HeartPulse,
  ShoppingCart,
  Home,
  Building,
  Compass,
  Radio
} from 'lucide-react';
import { CommunicationTone, UserProfile, CommunicationSynthesis } from '../types';
import { COMMUNICATION_CONTEXTS, FRAGMENT_TILES_BY_CONTEXT } from '../data/samples';
import { speechService } from '../utils/speech';

interface CommunicateFlowProps {
  userProfile: UserProfile;
}

export const CommunicateFlow: React.FC<CommunicateFlowProps> = ({ userProfile }) => {
  const [selectedContext, setSelectedContext] = useState<string>('Classroom');
  const [activeFragments, setActiveFragments] = useState<string[]>(['Teacher', 'Water', 'Please']);
  const [selectedTone, setSelectedTone] = useState<CommunicationTone>('Polite');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisResult, setSynthesisResult] = useState<CommunicationSynthesis>({
    composedSentence: 'Excuse me teacher, could I please have permission to get some water?',
    phoneticPronunciation: 'Excuse me teacher, could I please have permission to get some water?',
    variations: [
      { tone: 'Concise', sentence: 'Water please, teacher.' },
      { tone: 'Urgent', sentence: 'Excuse me teacher, I urgently need some water, please.' },
      { tone: 'Friendly', sentence: 'Hi teacher! Could I please grab a quick drink of water?' },
    ],
    followUpSuggestions: [
      'Thank you for understanding.',
      'I will be right back in two minutes.',
      'Could you repeat the assignment when I return?'
    ],
    explainIntent: "Constructed from fragments 'Teacher + Water + Please' in a polite classroom tone."
  });

  const [customWordInput, setCustomWordInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLargeDisplayMode, setIsLargeDisplayMode] = useState<boolean>(false);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<boolean>(false);
  const [recentPhrases, setRecentPhrases] = useState<string[]>([
    'Excuse me teacher, could I please have permission to get some water?',
    'Hello doctor, I am experiencing side effects from my new medicine.',
    'Could you please show me where this item is located?'
  ]);

  // Subscribe to speech state
  useEffect(() => {
    return speechService.subscribe((speaking) => {
      setIsAudioSpeaking(speaking);
    });
  }, []);

  // When fragments or tone changes, synthesize sentence
  const handleSynthesize = async (fragments: string[] = activeFragments, tone: CommunicationTone = selectedTone) => {
    if (fragments.length === 0) {
      setSynthesisResult({
        composedSentence: 'Please tap word tiles above to express what you want to say.',
        variations: [],
        followUpSuggestions: [],
        explainIntent: 'No fragments selected yet.'
      });
      return;
    }

    setIsSynthesizing(true);
    try {
      const response = await fetch('/api/communicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fragments,
          context: selectedContext,
          tone,
          language: userProfile.languages[0] || 'English',
        }),
      });

      const json = await response.json();
      if (json && json.data) {
        setSynthesisResult(json.data);
        if (!recentPhrases.includes(json.data.composedSentence)) {
          setRecentPhrases((prev) => [json.data.composedSentence, ...prev.slice(0, 4)]);
        }
      }
    } catch (err) {
      console.warn('API communicate error, local fallback active', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const addFragment = (text: string) => {
    if (!activeFragments.includes(text)) {
      const updated = [...activeFragments, text];
      setActiveFragments(updated);
      handleSynthesize(updated, selectedTone);
    }
  };

  const removeFragment = (text: string) => {
    const updated = activeFragments.filter((f) => f !== text);
    setActiveFragments(updated);
    handleSynthesize(updated, selectedTone);
  };

  const clearAllFragments = () => {
    setActiveFragments([]);
    handleSynthesize([], selectedTone);
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWordInput.trim()) {
      addFragment(customWordInput.trim());
      setCustomWordInput('');
    }
  };

  const handleSpeak = (textToSpeak: string = synthesisResult.composedSentence) => {
    speechService.speak(textToSpeak);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableTiles = FRAGMENT_TILES_BY_CONTEXT[selectedContext] || FRAGMENT_TILES_BY_CONTEXT.Everyday;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F7F3] text-[#2D5A40] border border-[#D0E6D9]">
            <MessageSquare className="w-3.5 h-3.5 text-[#3A6B4F]" />
            <span>Fragment-to-Sentence Augmentative AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2D2D2D] tracking-tight mt-1">
            Communicate: What are you trying to say?
          </h1>
          <p className="text-sm text-[#6B6355]">
            Tap key words or ideas. AuraBridge constructs a complete, natural, and respectful sentence ready to speak aloud.
          </p>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DC]">
          <span className="text-[11px] font-bold text-[#7A7265] px-2">Tone:</span>
          {(['Polite', 'Friendly', 'Formal', 'Urgent', 'Simple'] as CommunicationTone[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTone(t);
                handleSynthesize(activeFragments, t);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTone === t
                  ? 'bg-[#3A6B4F] text-white shadow-xs'
                  : 'text-[#5A5248] hover:bg-[#F5EFE6]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context Selector & Fragment Tiles Board (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Context Selector Bar */}
          <div className="bg-white p-4 rounded-3xl border border-[#EFE8DC] shadow-artistic space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7A7265] uppercase tracking-wider">
                1. Select Current Environment / Context:
              </span>
              <span className="text-[11px] text-[#2D5A40] font-semibold">
                Adapts tiles to your setting
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMUNICATION_CONTEXTS.map((ctx) => (
                <button
                  key={ctx.id}
                  onClick={() => setSelectedContext(ctx.id)}
                  className={`p-3 rounded-xl text-left border-2 text-xs font-bold transition-all cursor-pointer ${
                    selectedContext === ctx.id
                      ? 'border-[#3A6B4F] bg-[#F0F7F3] text-[#2D5A40] shadow-xs'
                      : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-[#FAF7F2] text-[#2D2D2D]'
                  }`}
                >
                  <div className="truncate">{ctx.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Tapped Fragments Workbench */}
          <div className="bg-gradient-to-br from-[#F0F7F3] to-[#FAF7F2] p-5 rounded-3xl border-2 border-[#D0E6D9] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#2D5A40]">
                2. Tapped Word Fragments ({activeFragments.length}):
              </span>
              {activeFragments.length > 0 && (
                <button
                  onClick={clearAllFragments}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>

            {/* Fragment Pills Bar */}
            <div className="min-h-[50px] p-3 bg-white rounded-2xl border border-[#D0E6D9] flex flex-wrap items-center gap-2">
              {activeFragments.length === 0 ? (
                <span className="text-xs text-[#A89F91] italic">
                  No fragments selected. Tap tiles below or type a word to start.
                </span>
              ) : (
                activeFragments.map((frag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3A6B4F] text-white text-xs font-bold shadow-2xs group"
                  >
                    <span>{frag}</span>
                    <button
                      onClick={() => removeFragment(frag)}
                      className="hover:text-rose-200 transition-colors cursor-pointer"
                      aria-label={`Remove ${frag}`}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Word Input */}
            <form onSubmit={handleAddCustomWord} className="flex gap-2 pt-1">
              <input
                type="text"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                placeholder="Type custom word (e.g. 'Advil', 'Room 204', 'Bus #12')..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#EFE8DC] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#3A6B4F]/50 text-[#2D2D2D]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#3A6B4F] hover:bg-[#2D5A40] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>
          </div>

          {/* Fragment Tiles Board */}
          <div className="bg-white p-5 rounded-3xl border border-[#EFE8DC] shadow-artistic space-y-3">
            <span className="text-xs font-bold text-[#7A7265] uppercase tracking-wider block">
              3. Available Quick Tiles ({selectedContext}):
            </span>
            <div className="flex flex-wrap gap-2">
              {availableTiles.map((tile) => {
                const isTapped = activeFragments.includes(tile.text);
                return (
                  <button
                    key={tile.id}
                    onClick={() => (isTapped ? removeFragment(tile.text) : addFragment(tile.text))}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer ${
                      isTapped
                        ? 'border-[#3A6B4F] bg-[#F0F7F3] text-[#2D5A40] font-bold ring-2 ring-[#B2D8C3]'
                        : 'border-[#EFE8DC] hover:border-[#B2D8C3] bg-[#FAF7F2] hover:bg-[#F0F7F3] text-[#2D2D2D]'
                    }`}
                  >
                    {tile.text} {isTapped && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Composed Sentence Preview & Speech Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border-2 border-[#D0E6D9] shadow-artistic p-6 space-y-6 text-[#2D2D2D]">
            <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3A6B4F]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2D5A40]">
                  AI Synthesized Sentence
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#5A5248] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EFE8DC]">
                Tone: {selectedTone}
              </span>
            </div>

            {/* Composed Sentence Large Bubble */}
            <div className="p-5 bg-gradient-to-br from-[#F0F7F3] to-[#FCFAF7] rounded-2xl border border-[#D0E6D9] space-y-3 relative">
              <p className="text-lg sm:text-xl font-extrabold text-[#2D2D2D] leading-relaxed font-serif">
                "{synthesisResult.composedSentence}"
              </p>

              {synthesisResult.explainIntent && (
                <p className="text-xs text-[#7A7265] italic">
                  💡 {synthesisResult.explainIntent}
                </p>
              )}
            </div>

            {/* Primary Action Controls: Speak / Large Display / Copy */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Speak Button */}
              <button
                onClick={() => handleSpeak()}
                className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isAudioSpeaking
                    ? 'bg-[#C25E2B] text-white animate-pulse'
                    : 'bg-[#3A6B4F] hover:bg-[#2D5A40] text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isAudioSpeaking ? 'Speaking...' : 'Speak Aloud'}</span>
              </button>

              {/* Large Display Mode */}
              <button
                onClick={() => setIsLargeDisplayMode(true)}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-[#2D2D2D] hover:bg-[#1E1E1E] text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Show in full-screen large high contrast text"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Large View</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(synthesisResult.composedSentence)}
                className="py-3 px-4 rounded-xl font-semibold text-xs bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Alternative Variations */}
            {synthesisResult.variations && synthesisResult.variations.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#EFE8DC]">
                <span className="text-[11px] font-bold text-[#7A7265] uppercase tracking-wider block">
                  Alternative Phrasings:
                </span>
                <div className="space-y-1.5">
                  {synthesisResult.variations.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSynthesisResult((prev) => ({ ...prev, composedSentence: v.sentence }));
                        handleSpeak(v.sentence);
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0F7F3] border border-[#EFE8DC] text-left text-xs transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium text-[#2D2D2D]">"{v.sentence}"</span>
                      <span className="text-[10px] font-bold uppercase text-[#7A7265] bg-[#EFE8DC] px-1.5 py-0.5 rounded-sm">
                        {v.tone}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Follow-up Suggestions */}
            {synthesisResult.followUpSuggestions && synthesisResult.followUpSuggestions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#EFE8DC]">
                <span className="text-[11px] font-bold text-[#7A7265] uppercase tracking-wider block">
                  Quick Follow-ups:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {synthesisResult.followUpSuggestions.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => handleSpeak(f)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-[#3A6B4F]" />
                      <span>{f}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Composed Phrases */}
          <div className="bg-white p-4 rounded-3xl border border-[#EFE8DC] shadow-artistic space-y-2">
            <span className="text-xs font-bold text-[#7A7265] uppercase tracking-wider block">
              Recent Spoken Phrases:
            </span>
            <div className="space-y-1.5">
              {recentPhrases.map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSynthesisResult((prev) => ({ ...prev, composedSentence: phrase }));
                    handleSpeak(phrase);
                  }}
                  className="w-full text-left text-xs p-2 rounded-lg hover:bg-[#FAF7F2] text-[#5A5248] truncate flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#A89F91] shrink-0" />
                  <span className="truncate">"{phrase}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FULL SCREEN LARGE DISPLAY MODAL (For showing phone screen to cashier / doctor / teacher) */}
      <AnimatePresence>
        {isLargeDisplayMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black text-white p-6 sm:p-12 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                AuraBridge Large Screen Display
              </span>
              <button
                onClick={() => setIsLargeDisplayMode(false)}
                className="p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>

            <div className="my-auto max-w-4xl mx-auto text-center space-y-6">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-yellow-300 leading-tight">
                "{synthesisResult.composedSentence}"
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleSpeak()}
                className="px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-lg flex items-center gap-2 cursor-pointer hover:bg-zinc-200 shadow-xl"
              >
                <Volume2 className="w-6 h-6 text-amber-600" />
                <span>Speak Again</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
