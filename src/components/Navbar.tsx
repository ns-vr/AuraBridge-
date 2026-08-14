import React from 'react';
import { Eye, Volume2, VolumeX, Sparkles, SlidersHorizontal, Sun, Moon, Type } from 'lucide-react';
import { UserAccessibilityPreferences } from '../types';
import { speechService } from '../utils/speech';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  accessibility: UserAccessibilityPreferences;
  onToggleAccessibility: (key: keyof UserAccessibilityPreferences) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  accessibility,
  onToggleAccessibility,
}) => {
  const isSpeaking = speechService.isSpeaking();

  const handleAudioToggle = () => {
    onToggleAccessibility('voiceGuidance');
    if (speechService.isSpeaking()) {
      speechService.stop();
    } else {
      speechService.speak("Voice guidance is now enabled for AuraBridge.");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        accessibility.highContrast
          ? 'bg-black/95 border-white text-white'
          : 'bg-[#FDFBF7]/95 border-[#EFE8DC] text-[#2D2D2D] shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C25E2B] rounded-lg p-1 group cursor-pointer"
          aria-label="AuraBridge home"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105 ${
              accessibility.highContrast
                ? 'bg-white text-black font-mono border border-white'
                : 'bg-gradient-to-br from-[#C25E2B] to-[#A84B1D] text-white shadow-xs'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight font-serif text-[#2D2D2D]">AuraBridge</span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm ${
                  accessibility.highContrast
                    ? 'bg-zinc-800 text-yellow-300'
                    : 'bg-[#F4ECE1] text-[#A84B1D] border border-[#E8DCCB]'
                }`}
              >
                AI Layer
              </span>
            </div>
            <p className="text-[11px] text-[#7A7265] hidden sm:block font-medium">
              Universal Multimodal Accessibility
            </p>
          </div>
        </button>

        {/* Center Primary Nav (for larger screens) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F5F0E6]/80 dark:bg-zinc-900/60 p-1 rounded-xl border border-[#EAE2D2]">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'dashboard' || currentView === 'home'
                ? accessibility.highContrast
                  ? 'bg-white text-black'
                  : 'bg-white text-[#2D2D2D] shadow-xs border border-[#EFE8DC]'
                : 'text-[#6B6355] hover:text-[#2D2D2D]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('understand')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'understand'
                ? accessibility.highContrast
                  ? 'bg-white text-black'
                  : 'bg-white text-[#2D2D2D] shadow-xs border border-[#EFE8DC]'
                : 'text-[#6B6355] hover:text-[#2D2D2D]'
            }`}
          >
            Understand (Camera)
          </button>
          <button
            onClick={() => onNavigate('communicate')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'communicate'
                ? accessibility.highContrast
                  ? 'bg-white text-black'
                  : 'bg-white text-[#2D2D2D] shadow-xs border border-[#EFE8DC]'
                : 'text-[#6B6355] hover:text-[#2D2D2D]'
            }`}
          >
            Communicate
          </button>
          <button
            onClick={() => onNavigate('adaptive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'adaptive'
                ? accessibility.highContrast
                  ? 'bg-white text-black'
                  : 'bg-white text-[#2D2D2D] shadow-xs border border-[#EFE8DC]'
                : 'text-[#6B6355] hover:text-[#2D2D2D]'
            }`}
          >
            Adaptive Demo
          </button>
          <button
            onClick={() => onNavigate('actions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'actions'
                ? accessibility.highContrast
                  ? 'bg-white text-black'
                  : 'bg-white text-[#2D2D2D] shadow-xs border border-[#EFE8DC]'
                : 'text-[#6B6355] hover:text-[#2D2D2D]'
            }`}
          >
            My Actions
          </button>
        </nav>

        {/* Accessibility Quick Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Larger Text Toggle */}
          <button
            onClick={() => onToggleAccessibility('largerText')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              accessibility.largerText
                ? accessibility.highContrast
                  ? 'bg-yellow-400 text-black ring-2 ring-white'
                  : 'bg-[#F6EADB] text-[#A84B1D] ring-2 ring-[#C25E2B]/40'
                : accessibility.highContrast
                ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                : 'bg-[#F5F0E6] text-[#5A5248] hover:bg-[#ECE4D6]'
            }`}
            title="Toggle Larger Text"
            aria-label="Toggle text size"
            aria-pressed={accessibility.largerText}
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Text</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => onToggleAccessibility('highContrast')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              accessibility.highContrast
                ? 'bg-white text-black ring-2 ring-yellow-400'
                : 'bg-[#F5F0E6] text-[#5A5248] hover:bg-[#ECE4D6]'
            }`}
            title="Toggle High Contrast Mode"
            aria-label="Toggle high contrast"
            aria-pressed={accessibility.highContrast}
          >
            {accessibility.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Voice Guidance Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              accessibility.voiceGuidance
                ? accessibility.highContrast
                  ? 'bg-yellow-400 text-black ring-2 ring-white'
                  : 'bg-[#C25E2B] text-white shadow-xs'
                : accessibility.highContrast
                ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                : 'bg-[#F5F0E6] text-[#5A5248] hover:bg-[#ECE4D6]'
            }`}
            title="Toggle Voice Guidance"
            aria-label="Toggle voice guidance"
            aria-pressed={accessibility.voiceGuidance}
          >
            {accessibility.voiceGuidance ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Voice</span>
          </button>

          {/* Your Aura / Profile button */}
          <button
            onClick={() => onNavigate('profile')}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'profile'
                ? accessibility.highContrast
                  ? 'bg-white text-black'
                  : 'bg-[#2D2D2D] text-[#FAF7F2]'
                : accessibility.highContrast
                ? 'bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
                : 'bg-[#EAE2D2] hover:bg-[#DFD5C2] text-[#3D372E]'
            }`}
            aria-label="Your Aura Profile and Preferences"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Your Aura</span>
          </button>
        </div>
      </div>
    </header>
  );
};
