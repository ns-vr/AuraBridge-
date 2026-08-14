import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Type,
  Sun,
  Globe,
  MessageSquare,
  Eye,
  Check,
  Trash2,
  Save
} from 'lucide-react';
import { UserProfile, ExperienceStyle, ExplanationStyle } from '../types';
import { speechService } from '../utils/speech';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetPreferences: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onResetPreferences,
}) => {
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });
  const [saveToast, setSaveToast] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleToggleAccess = (key: keyof typeof profile.accessibility) => {
    const updated = {
      ...profile,
      accessibility: {
        ...profile.accessibility,
        [key]: !profile.accessibility[key],
      },
    };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const handleToggleCommMode = (mode: string) => {
    const exists = profile.communicationModes.includes(mode);
    const updated = {
      ...profile,
      communicationModes: exists
        ? profile.communicationModes.filter((m) => m !== mode)
        : [...profile.communicationModes, mode],
    };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const handleUpdateExperienceStyle = (style: ExperienceStyle) => {
    const updated = { ...profile, experienceStyle: style };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const handleUpdateExplanationStyle = (style: ExplanationStyle) => {
    const updated = { ...profile, explanationStyle: style };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const handleTogglePersonalization = () => {
    const updated = { ...profile, personalizationEnabled: !profile.personalizationEnabled };
    setProfile(updated);
    onUpdateProfile(updated);
  };

  const handleReset = () => {
    onResetPreferences();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
  };

  const handleSave = () => {
    onUpdateProfile(profile);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C25E2B]" />
            <span>Personal Preferences Control Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2D2D2D] tracking-tight mt-1">
            Your Aura: Profile & Settings
          </h1>
          <p className="text-sm text-[#6B6355]">
            Customize how AuraBridge adapts to you. All settings are editable directly on this page.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#C25E2B] hover:bg-[#A84B1D] text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3 bg-[#EAF5EF] border border-[#D0E6D9] text-[#1E4D31] rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3A6B4F]" />
          Preferences updated and saved to your Aura profile!
        </div>
      )}

      {resetToast && (
        <div className="p-3 bg-[#F5EFE6] border border-[#E8DCCB] text-[#93441B] rounded-xl text-xs font-bold flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#C25E2B]" />
          Learned adaptations and preferences have been reset to clean defaults.
        </div>
      )}

      {/* 1. ADAPTATION & CONTINUOUS LEARNING ENGINE */}
      <div className="bg-gradient-to-br from-[#FCFAF7] via-[#FAF7F2] to-white rounded-3xl p-6 sm:p-8 border-2 border-[#E8DCCB] shadow-artistic space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C25E2B]" />
              <h2 className="text-lg font-black font-serif text-[#2D2D2D]">
                Aura Continuous Learning & Privacy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B6355] max-w-2xl leading-relaxed">
              AuraBridge adapts based on the documents you scan and words you tap. Your data stays
              strictly within your session and can be wiped at any instant with zero footprint.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleTogglePersonalization}
              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                profile.personalizationEnabled
                  ? 'bg-[#C25E2B] text-white border-[#C25E2B] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5A5248] border-[#EFE8DC]'
              }`}
            >
              Personalization: {profile.personalizationEnabled ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Learned Preferences
            </button>
          </div>
        </div>
      </div>

      {/* 2. FOUR CORE PREFERENCE SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group A: Understanding & Explanation Style */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE8DC] shadow-artistic space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EFE8DC] pb-3">
            <Eye className="w-5 h-5 text-[#C25E2B]" />
            <h3 className="font-bold font-serif text-base text-[#2D2D2D]">1. Understanding & Presentation</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#7A7265] uppercase tracking-wider block mb-1.5">
                Default Experience Style:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'adaptive', label: '✨ Adaptive' },
                  { id: 'quick', label: '⚡ Quick & Concise' },
                  { id: 'visual', label: '👁️ Visual-First' },
                  { id: 'voice', label: '🔊 Voice-First' },
                  { id: 'detailed', label: '📄 Detailed' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdateExperienceStyle(item.id as ExperienceStyle)}
                    className={`p-2.5 rounded-xl text-left border-2 text-xs font-bold transition-all cursor-pointer ${
                      profile.experienceStyle === item.id
                        ? 'border-[#C25E2B] bg-[#F5EFE6] text-[#93441B] shadow-2xs'
                        : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-[#FAF7F2] text-[#2D2D2D]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#7A7265] uppercase tracking-wider block mb-1.5">
                Explanation Depth:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'simple', label: 'Super Simple (Grade 4)' },
                  { id: 'quick', label: 'Quick (Actions only)' },
                  { id: 'detailed', label: 'Detailed (Full legal)' },
                  { id: 'adaptive', label: 'Adaptive (Auto-tune)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdateExplanationStyle(item.id as ExplanationStyle)}
                    className={`p-2.5 rounded-xl text-left border-2 text-xs font-bold transition-all cursor-pointer ${
                      profile.explanationStyle === item.id
                        ? 'border-[#C25E2B] bg-[#F5EFE6] text-[#93441B] shadow-2xs'
                        : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-[#FAF7F2] text-[#2D2D2D]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Group B: Communication Modes */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE8DC] shadow-artistic space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EFE8DC] pb-3">
            <MessageSquare className="w-5 h-5 text-[#3A6B4F]" />
            <h3 className="font-bold font-serif text-base text-[#2D2D2D]">2. Communication Preferences</h3>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#7A7265] uppercase tracking-wider block">
              Active Input & Output Channels:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Voice', label: 'Voice & Speech (TTS)' },
                { id: 'Tapping', label: 'Fragment Tile Tapping' },
                { id: 'Typing', label: 'Keyboard & Text' },
                { id: 'Camera', label: 'Camera & Visual Scan' },
                { id: 'Visual cards', label: 'Visual Picture Boards' },
                { id: 'Alternative communication', label: 'AAC Engine' },
              ].map((item) => {
                const active = profile.communicationModes.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleCommMode(item.id)}
                    className={`p-2.5 rounded-xl text-left border-2 text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'border-[#3A6B4F] bg-[#F0F7F3] text-[#2D5A40] shadow-2xs'
                        : 'border-[#EFE8DC] hover:border-[#B2D8C3] bg-[#FAF7F2] text-[#2D2D2D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#3A6B4F]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Group C: Accessibility Controls */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE8DC] shadow-artistic space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EFE8DC] pb-3">
            <Sun className="w-5 h-5 text-[#C25E2B]" />
            <h3 className="font-bold font-serif text-base text-[#2D2D2D]">3. Accessibility Controls</h3>
          </div>

          <div className="space-y-2">
            {[
              { key: 'largerText' as const, label: 'Larger Text (48px+ targets)', desc: 'Magnifies interface typography' },
              { key: 'highContrast' as const, label: 'High Contrast Mode', desc: 'Crisp black canvas with AAA borders' },
              { key: 'voiceGuidance' as const, label: 'Voice Guidance (Audio narration)', desc: 'Reads summary cards aloud automatically' },
              { key: 'simplifiedLanguage' as const, label: 'Plain Simplified Language', desc: 'Strips away acronyms & legalese' },
              { key: 'reducedMotion' as const, label: 'Reduced Animations', desc: 'Disables moving beams and transitions' },
            ].map((item) => {
              const active = profile.accessibility[item.key];
              return (
                <div
                  key={item.key}
                  className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EFE8DC] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-[#2D2D2D]">{item.label}</div>
                    <div className="text-[11px] text-[#7A7265]">{item.desc}</div>
                  </div>

                  <button
                    onClick={() => handleToggleAccess(item.key)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                      active ? 'bg-[#C25E2B]' : 'bg-[#D6C2A5]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        active ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Group D: Languages & Translation */}
        <div className="bg-white rounded-3xl p-6 border border-[#EFE8DC] shadow-artistic space-y-4">
          <div className="flex items-center gap-2 border-b border-[#EFE8DC] pb-3">
            <Globe className="w-5 h-5 text-[#C25E2B]" />
            <h3 className="font-bold font-serif text-base text-[#2D2D2D]">4. Languages & Translation</h3>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#7A7265] uppercase tracking-wider block">
              Active Languages:
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#F5EFE6] border border-[#E8DCCB] text-[#93441B] font-bold text-xs flex items-center gap-1.5"
                >
                  <span>{lang}</span>
                  {profile.languages.length > 1 && (
                    <button
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          languages: prev.languages.filter((l) => l !== lang),
                        }))
                      }
                      className="text-[#A89F91] hover:text-rose-600 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-[#7A7265] leading-relaxed italic pt-2">
              💡 AuraBridge translates with cultural & contextual meaning preservation rather than literal dictionary translation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
