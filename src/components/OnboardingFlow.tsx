import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Volume2,
  Eye,
  Zap,
  Layers,
  MessageSquare,
  Camera,
  Keyboard,
  MousePointerClick,
  FileText,
  Globe,
  Sliders,
  Type,
  Sun,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { UserProfile, ExperienceStyle, ExplanationStyle } from '../types';
import { speechService } from '../utils/speech';

interface OnboardingFlowProps {
  userProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  userProfile,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Local state to mutate during onboarding
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });
  const [customLanguageInput, setCustomLanguageInput] = useState('');

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ ...profile, onboardingCompleted: true });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleCommMode = (mode: string) => {
    setProfile((prev) => {
      const exists = prev.communicationModes.includes(mode);
      return {
        ...prev,
        communicationModes: exists
          ? prev.communicationModes.filter((m) => m !== mode)
          : [...prev.communicationModes, mode],
      };
    });
  };

  const toggleAccess = (key: keyof typeof profile.accessibility) => {
    setProfile((prev) => {
      if (key === 'preferNotToSay') {
        return {
          ...prev,
          accessibility: {
            largerText: false,
            highContrast: false,
            voiceGuidance: false,
            reducedMotion: false,
            simplifiedLanguage: false,
            preferNotToSay: true,
          },
        };
      }
      return {
        ...prev,
        accessibility: {
          ...prev.accessibility,
          preferNotToSay: false,
          [key]: !prev.accessibility[key],
        },
      };
    });
  };

  const toggleLanguage = (lang: string) => {
    setProfile((prev) => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang],
      };
    });
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLanguageInput.trim() && !profile.languages.includes(customLanguageInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        languages: [...prev.languages, customLanguageInput.trim()],
      }));
      setCustomLanguageInput('');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#EFE8DC] shadow-artistic overflow-hidden text-[#2D2D2D]">
        {/* Progress Bar & Header */}
        <div className="p-6 pb-4 border-b border-[#EFE8DC] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C25E2B] text-white flex items-center justify-center font-bold text-sm">
              {step < 6 ? step : '✓'}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#93441B]">
                {step === 6 ? 'Setup Complete' : `Step ${step} of 5 · Preferences`}
              </span>
              <div className="text-xs text-[#7A7265]">
                You can change these anytime in Your Aura
              </div>
            </div>
          </div>

          <button
            onClick={onSkip}
            className="text-xs font-semibold text-[#7A7265] hover:text-[#2D2D2D] px-3 py-1.5 rounded-lg hover:bg-[#EFE8DC] transition-colors cursor-pointer"
          >
            Skip for now →
          </button>
        </div>

        {/* Step Content Container */}
        <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: Experience Style */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black font-serif tracking-tight text-[#2D2D2D]">
                    Let’s make AuraBridge yours.
                  </h2>
                  <p className="text-sm text-[#6B6355] mt-1">
                    How do you prefer information to be presented when you open the app?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'adaptive', title: '✨ Let AuraBridge Decide', desc: 'Adapts dynamically depending on document type (Recommended)', icon: Sparkles },
                    { id: 'quick', title: '⚡ Quick & Concise', desc: 'Essential bullet points, deadlines, and direct facts only', icon: Zap },
                    { id: 'visual', title: '👁️ Visual-First', desc: 'Icon workflows, step sequences, and structured cards', icon: Eye },
                    { id: 'voice', title: '🔊 Voice-First', desc: 'Audio explanations read aloud automatically', icon: Volume2 },
                    { id: 'detailed', title: '📄 Detailed & Explanatory', desc: 'Comprehensive context with full legal & policy excerpts', icon: FileText },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setProfile({ ...profile, experienceStyle: opt.id as ExperienceStyle })}
                      className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        profile.experienceStyle === opt.id
                          ? 'border-[#C25E2B] bg-[#F5EFE6] shadow-xs'
                          : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-white'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#2D2D2D] flex items-center justify-between">
                        <span>{opt.title}</span>
                        {profile.experienceStyle === opt.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#C25E2B]" />
                        )}
                      </div>
                      <p className="text-xs text-[#6B6355] mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Communication Preferences */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black font-serif tracking-tight text-[#2D2D2D]">
                    How do you prefer to communicate?
                  </h2>
                  <p className="text-sm text-[#6B6355] mt-1">
                    Select all modes you find helpful or comfortable. (Multi-select)
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Voice', title: 'Voice & Speech', desc: 'Speak or listen', icon: Volume2 },
                    { id: 'Tapping', title: 'Fragment Tapping', desc: 'Build sentences via AAC tiles', icon: MousePointerClick },
                    { id: 'Typing', title: 'Typing', desc: 'Standard keyboard input', icon: Keyboard },
                    { id: 'Camera', title: 'Camera & Vision', desc: 'Point at real-world objects', icon: Camera },
                    { id: 'Visual cards', title: 'Visual Cards', desc: 'Structured picture boards', icon: Layers },
                    { id: 'Alternative communication', title: 'AAC Mode', desc: 'Symbol & fragment engine', icon: MessageSquare },
                  ].map((mode) => {
                    const isSelected = profile.communicationModes.includes(mode.id);
                    return (
                      <button
                        key={mode.id}
                        onClick={() => toggleCommMode(mode.id)}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#3A6B4F] bg-[#F0F7F3] shadow-xs'
                            : 'border-[#EFE8DC] hover:border-[#B2D8C3] bg-white'
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm text-[#2D2D2D] flex items-center justify-between">
                          <span>{mode.title}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#3A6B4F]" />}
                        </div>
                        <p className="text-[11px] text-[#7A7265] mt-0.5">{mode.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-[#7A7265] italic">
                  * AuraBridge combines your selected modes seamlessly in the Communicate tab.
                </div>
              </motion.div>
            )}

            {/* STEP 3: Explanation Style */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black font-serif tracking-tight text-[#2D2D2D]">
                    How should AuraBridge explain things to you?
                  </h2>
                  <p className="text-sm text-[#6B6355] mt-1">
                    Choose your preferred level of simplicity when digesting notices and instructions.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'adaptive', title: 'Adaptive (Recommended)', badge: 'Recommended', desc: 'Aura evaluates the complexity of the document and creates the optimal balance automatically.' },
                    { id: 'simple', title: 'Super Simple ("Tell me like I’m new to this")', badge: 'Plain Language', desc: 'Grade 4 reading level, bold facts only, no confusing legal clauses or acronyms.' },
                    { id: 'quick', title: 'Quick ("Just give me what matters")', badge: 'Action-First', desc: 'Summary + Deadline + 1 immediate next step.' },
                    { id: 'detailed', title: 'Detailed ("Explain everything")', badge: 'Full Depth', desc: 'In-depth analysis with references, full policy guidelines, and fine-print citations.' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setProfile({ ...profile, explanationStyle: style.id as ExplanationStyle })}
                      className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-start justify-between cursor-pointer ${
                        profile.explanationStyle === style.id
                          ? 'border-[#C25E2B] bg-[#F5EFE6] shadow-xs'
                          : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#2D2D2D]">{style.title}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#EFE8DC] text-[#5A5248]">
                            {style.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B6355] leading-relaxed">{style.desc}</p>
                      </div>
                      {profile.explanationStyle === style.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#C25E2B] shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Accessibility Preferences */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black font-serif tracking-tight text-[#2D2D2D]">
                    Accessibility & Comfort Controls
                  </h2>
                  <p className="text-sm text-[#6B6355] mt-1">
                    Turn on any visual or assistive helpers you’d like active across all screens.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'largerText' as const, label: 'Larger Text Display', desc: 'Increases base font size and touch targets', icon: Type },
                    { key: 'highContrast' as const, label: 'High Contrast Mode', desc: 'Deep black background with sharp AAA borders', icon: Sun },
                    { key: 'voiceGuidance' as const, label: 'Voice Guidance (TTS)', desc: 'Reads out important summaries aloud', icon: Volume2 },
                    { key: 'simplifiedLanguage' as const, label: 'Simplified Plain Language', desc: 'Removes legal jargon and unnecessary jargon', icon: ShieldCheck },
                    { key: 'reducedMotion' as const, label: 'Reduced Animations', desc: 'Disables parallax, sliding beams, and transitions', icon: RotateCcw },
                    { key: 'preferNotToSay' as const, label: 'Prefer Not to Specify', desc: 'Use standard clean defaults', icon: CheckCircle2 },
                  ].map((item) => {
                    const active = profile.accessibility[item.key];
                    return (
                      <button
                        key={item.key}
                        onClick={() => toggleAccess(item.key)}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-start gap-3 cursor-pointer ${
                          active
                            ? 'border-[#C25E2B] bg-[#F5EFE6] shadow-xs'
                            : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-white'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 mt-0.5 ${active ? 'text-[#C25E2B]' : 'text-[#A89F91]'}`} />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#2D2D2D]">{item.label}</div>
                          <p className="text-[11px] text-[#7A7265] mt-0.5">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Languages */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black font-serif tracking-tight text-[#2D2D2D]">
                    Which languages do you use?
                  </h2>
                  <p className="text-sm text-[#6B6355] mt-1">
                    AuraBridge translates information by <strong>meaning and intent</strong>, not just literal word-for-word.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Hindi', 'Vietnamese', 'Tagalog', 'Portuguese', 'German'].map((lang) => {
                    const isSelected = profile.languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#C25E2B] bg-[#C25E2B] text-white shadow-xs'
                            : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-white text-[#2D2D2D]'
                        }`}
                      >
                        {lang} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Language */}
                <form onSubmit={handleAddCustomLanguage} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={customLanguageInput}
                    onChange={(e) => setCustomLanguageInput(e.target.value)}
                    placeholder="Add other language (e.g. Japanese, ASL, Swahili)..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#EFE8DC] text-sm focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/50 text-[#2D2D2D]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#2D2D2D] hover:bg-[#1E1E1E] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 6: Completion Screen */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#EAF5EF] text-[#1E4D31] mx-auto flex items-center justify-center shadow-xs">
                  <Sparkles className="w-8 h-8 text-[#3A6B4F]" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-serif text-[#2D2D2D]">You’re ready.</h2>
                  <p className="text-sm text-[#6B6355] max-w-md mx-auto">
                    AuraBridge is calibrated to your preferences. Every document, phrase, and checklist will now adapt to you.
                  </p>
                </div>

                {/* Recap of Core Loop */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-[#FAF7F2] border border-[#E8DCCB] rounded-2xl text-left">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#93441B]">1. UNDERSTAND</div>
                    <p className="text-[11px] text-[#6B6355]">Camera / Vision scanner with explainable "Show me why".</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#2D5A40]">2. COMMUNICATE</div>
                    <p className="text-[11px] text-[#6B6355]">Fragment-to-sentence generator with instant speech.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#463261]">3. ACT</div>
                    <p className="text-[11px] text-[#6B6355]">Concrete deadlines, checklists, and response templates.</p>
                  </div>
                </div>

                <button
                  onClick={() => onComplete({ ...profile, onboardingCompleted: true })}
                  className="w-full py-4 rounded-xl bg-[#C25E2B] hover:bg-[#A84B1D] text-white font-bold text-base shadow-artistic transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enter AuraBridge Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {step < 6 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#EFE8DC] mt-6">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-[#5A5248] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
