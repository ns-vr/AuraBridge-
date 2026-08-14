import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ShieldCheck, Volume2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { ExplainabilityTarget } from '../types';
import { speechService } from '../utils/speech';

interface ExplainabilityModalProps {
  target: ExplainabilityTarget | null;
  onClose: () => void;
  accessibility: { largerText: boolean; highContrast: boolean };
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  target,
  onClose,
  accessibility,
}) => {
  if (!target) return null;

  const handleSpeak = () => {
    speechService.speak(
      `Why Aura concluded: ${target.claimLabel} is ${target.claimValue}. ${target.rationale}. Source citation: ${target.locationCitation}. Excerpt: ${target.sourceExcerpt}`
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${
            accessibility.highContrast
              ? 'bg-black text-white border-white'
              : 'bg-[#FDFBF7] text-[#2D2D2D] border-[#EFE8DC] shadow-artistic'
          }`}
          role="dialog"
          aria-labelledby="explainability-title"
          aria-modal="true"
        >
          {/* Header */}
          <div
            className={`p-5 sm:p-6 border-b flex items-start justify-between ${
              accessibility.highContrast
                ? 'border-zinc-800 bg-zinc-950'
                : 'border-[#EFE8DC] bg-[#FAF7F2]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  accessibility.highContrast
                    ? 'bg-white text-black'
                    : 'bg-[#C25E2B] text-white shadow-xs'
                }`}
              >
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      accessibility.highContrast
                        ? 'bg-zinc-800 text-yellow-300'
                        : 'bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB]'
                    }`}
                  >
                    AI Explainability & Grounding
                  </span>
                  <span className="text-xs text-[#7A7265] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3A6B4F]" />
                    {Math.round(target.confidenceScore * 100)}% Confidence
                  </span>
                </div>
                <h2
                  id="explainability-title"
                  className={`text-lg sm:text-xl font-bold font-serif mt-1 ${
                    accessibility.largerText ? 'text-2xl' : ''
                  }`}
                >
                  Show Me Why: {target.claimLabel}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                accessibility.highContrast
                  ? 'hover:bg-zinc-800 text-zinc-300'
                  : 'hover:bg-[#EFE8DC] text-[#7A7265]'
              }`}
              aria-label="Close explainability dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Extracted Claim Card */}
            <div
              className={`p-4 rounded-xl border ${
                accessibility.highContrast
                  ? 'bg-zinc-900 border-zinc-700'
                  : 'bg-white border-[#EFE8DC] shadow-artistic'
              }`}
            >
              <div className="text-xs font-medium uppercase tracking-wider text-[#7A7265] mb-1">
                Extracted Fact
              </div>
              <div
                className={`text-lg font-bold ${
                  accessibility.highContrast ? 'text-yellow-300' : 'text-[#2D2D2D]'
                }`}
              >
                {target.claimValue}
              </div>
              <div className="text-xs text-[#7A7265] mt-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Source: {target.documentTitle}
              </div>
            </div>

            {/* Document Highlight Preview Simulation */}
            <div
              className={`p-4 rounded-xl border relative overflow-hidden ${
                accessibility.highContrast
                  ? 'bg-zinc-950 border-zinc-800'
                  : 'bg-[#FAF7F2] border-[#EFE8DC]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#7A7265] mb-2">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C25E2B]" />
                  Exact Source Passage in Original Document
                </span>
                <span className="bg-[#EFE8DC] px-2 py-0.5 rounded-sm font-mono text-[11px] text-[#5A5248]">
                  {target.locationCitation}
                </span>
              </div>

              {/* Highlighted Quote Box */}
              <div
                className={`p-4 rounded-lg font-mono text-sm leading-relaxed border-l-4 ${
                  accessibility.highContrast
                    ? 'bg-zinc-900 border-yellow-400 text-yellow-100'
                    : 'bg-[#F5EFE6] border-[#C25E2B] text-[#2D2D2D] shadow-xs'
                }`}
              >
                <span className="text-xs font-bold text-[#93441B] uppercase block mb-1">
                  Detected Evidence:
                </span>
                "{target.sourceExcerpt}"
              </div>
            </div>

            {/* Rationale Breakdown */}
            <div
              className={`p-4 rounded-xl border ${
                accessibility.highContrast
                  ? 'bg-zinc-900 border-zinc-800'
                  : 'bg-white border-[#EFE8DC]'
              }`}
            >
              <div className="text-xs font-semibold text-[#7A7265] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3A6B4F]" />
                How AuraBridge Verified This
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  accessibility.highContrast ? 'text-zinc-200' : 'text-[#6B6355]'
                } ${accessibility.largerText ? 'text-base' : ''}`}
              >
                {target.rationale}
              </p>
            </div>
          </div>

          {/* Footer Controls */}
          <div
            className={`p-4 sm:p-5 border-t flex flex-wrap items-center justify-between gap-3 ${
              accessibility.highContrast
                ? 'border-zinc-800 bg-zinc-950'
                : 'border-[#EFE8DC] bg-[#FAF7F2]'
            }`}
          >
            <button
              onClick={handleSpeak}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all cursor-pointer ${
                accessibility.highContrast
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                  : 'bg-white hover:bg-[#FAF7F2] text-[#2D2D2D] border border-[#EFE8DC] shadow-xs'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#C25E2B]" />
              Listen to Explanation
            </button>

            <button
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                accessibility.highContrast
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-xs'
              }`}
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
