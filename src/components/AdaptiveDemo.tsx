import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Send,
  UserCheck,
  ShieldCheck,
  Eye,
  Zap,
  Repeat
} from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/samples';
import { UserProfile, AdaptiveData } from '../types';
import { speechService } from '../utils/speech';

interface AdaptiveDemoProps {
  userProfile: UserProfile;
}

export const AdaptiveDemo: React.FC<AdaptiveDemoProps> = ({ userProfile }) => {
  const [selectedDocKey, setSelectedDocKey] = useState<string>('university');
  const [activeTab, setActiveTab] = useState<'all' | 'standard' | 'simple' | 'visual' | 'voice'>('all');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const doc = SAMPLE_DOCUMENTS[selectedDocKey] || SAMPLE_DOCUMENTS.university;
  const adaptive: AdaptiveData = doc.adaptiveData;

  const handleSpeakVoiceScript = () => {
    setIsSpeaking(true);
    speechService.speak(adaptive.voiceScript);
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-amber-700" />;
      case 'Send':
        return <Send className="w-5 h-5 text-teal-700" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-rose-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-700" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB]">
            <Sparkles className="w-3.5 h-3.5 text-[#C25E2B]" />
            <span>Core Differentiator: Adaptive Multi-Modal Rendering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2D2D2D] tracking-tight mt-1">
            "Aura is adapting to you"
          </h1>
          <p className="text-sm text-[#6B6355] max-w-2xl">
            Same verified source document, 4 distinct presentation styles rendered in real-time according to each person's preference.
          </p>
        </div>

        {/* Document Selector */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#EFE8DC] shadow-artistic">
          <span className="text-xs font-bold text-[#7A7265] px-2">Document:</span>
          {Object.entries(SAMPLE_DOCUMENTS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedDocKey(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDocKey === key
                  ? 'bg-[#2D2D2D] text-white shadow-xs'
                  : 'text-[#5A5248] hover:bg-[#FAF7F2]'
              }`}
            >
              {item.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Presentation Style Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DC]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            Side-by-Side Comparison
          </button>
          <button
            onClick={() => setActiveTab('standard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'standard' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            1. Standard (Original)
          </button>
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simple' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            2. Simple (Plain Language)
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'visual' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            3. Visual (Steps & Icons)
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'voice' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            4. Voice (Spoken Script)
          </button>
        </div>

        {/* Key Metrics extracted */}
        <div className="flex items-center gap-2 text-xs">
          {adaptive.keyMetrics.map((m, i) => (
            <div key={i} className="px-2.5 py-1 bg-[#FCFAF7] border border-[#EFE8DC] rounded-lg text-[#93441B]">
              <span className="text-[#7A7265] font-normal">{m.label}: </span>
              <span className="font-bold">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Grid of 4 Renderings */}
      <div className={`grid gap-6 ${activeTab === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* 1. STANDARD RENDERING */}
        {(activeTab === 'all' || activeTab === 'standard') && (
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#EFE8DC] space-y-4 flex flex-col justify-between shadow-artistic">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#3D352B] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="font-black font-serif text-sm text-[#2D2D2D] uppercase tracking-wider">
                    Standard Style (Dense Source Text)
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase bg-[#EFE8DC] text-[#5A5248] px-2 py-0.5 rounded-md">
                  Original Legalese
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EFE8DC] font-serif text-xs sm:text-sm leading-relaxed text-[#2D2D2D]">
                "{adaptive.standard}"
              </div>
            </div>

            <div className="text-[11px] text-[#7A7265] italic">
              Best for legal compliance, audit records, or formal verification.
            </div>
          </div>
        )}

        {/* 2. SIMPLE PLAIN LANGUAGE RENDERING */}
        {(activeTab === 'all' || activeTab === 'simple') && (
          <div className="bg-gradient-to-br from-[#FCFAF7] to-[#FAF7F2] rounded-3xl p-6 border-2 border-[#E8DCCB] space-y-4 flex flex-col justify-between shadow-artistic">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#C25E2B] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="font-black font-serif text-sm text-[#93441B] uppercase tracking-wider">
                    Simple Style (Bold Essential Facts Only)
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase bg-[#F5EFE6] text-[#93441B] px-2 py-0.5 rounded-md border border-[#E8DCCB]">
                  Grade 4 Reading Level
                </span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EFE8DC] space-y-3">
                <p className="text-base sm:text-lg font-black text-[#2D2D2D] leading-snug">
                  {adaptive.simple}
                </p>
                <div className="text-xs text-[#6B6355] flex items-center gap-2 pt-1 border-t border-[#EFE8DC]">
                  <CheckCircle2 className="w-4 h-4 text-[#3A6B4F]" />
                  Zero confusing acronyms or legal jargon.
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#93441B] font-medium">
              Best for quick comprehension, cognitive fatigue relief, or language learners.
            </div>
          </div>
        )}

        {/* 3. VISUAL WORKFLOW RENDERING */}
        {(activeTab === 'all' || activeTab === 'visual') && (
          <div className="bg-gradient-to-br from-[#F0F7F3] to-[#FAF7F2] rounded-3xl p-6 border-2 border-[#D0E6D9] space-y-4 flex flex-col justify-between shadow-artistic">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D0E6D9] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#3A6B4F] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h2 className="font-black font-serif text-sm text-[#2D5A40] uppercase tracking-wider">
                    Visual Style (Sequential Icon Steps)
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase bg-[#F0F7F3] text-[#2D5A40] px-2 py-0.5 rounded-md border border-[#D0E6D9]">
                  Step-by-step
                </span>
              </div>

              {/* Vertical Step Flow */}
              <div className="space-y-2.5">
                {adaptive.visualSteps.map((st) => (
                  <div
                    key={st.stepNumber}
                    className="p-3.5 bg-white rounded-2xl border border-[#D0E6D9] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F7F3] border border-[#D0E6D9] flex items-center justify-center shrink-0">
                        {getStepIcon(st.icon)}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#2D2D2D]">
                          {st.stepNumber}. {st.title}
                        </div>
                        <div className="text-[11px] text-[#7A7265]">{st.description}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                        st.status === 'Completed'
                          ? 'bg-[#EAF5EF] text-[#1E4D31]'
                          : st.status === 'Action Needed'
                          ? 'bg-[#F5EFE6] text-[#93441B]'
                          : st.status === 'Important'
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-[#FAF7F2] text-[#6B6355]'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#2D5A40] font-medium">
              Best for visual thinkers, neurodivergent users, and procedural clarity.
            </div>
          </div>
        )}

        {/* 4. VOICE SCRIPT RENDERING */}
        {(activeTab === 'all' || activeTab === 'voice') && (
          <div className="bg-gradient-to-br from-[#F8F7FA] to-[#FAF7F2] rounded-3xl p-6 border-2 border-[#E2DBE9] space-y-4 flex flex-col justify-between shadow-artistic">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2DBE9] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#5B487A] text-white flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h2 className="font-black font-serif text-sm text-[#463261] uppercase tracking-wider">
                    Voice Style (Spoken Script / Screen Reader)
                  </h2>
                </div>
                <span className="text-[10px] font-bold uppercase bg-[#F8F7FA] text-[#463261] px-2 py-0.5 rounded-md border border-[#E2DBE9]">
                  Audio Optimized
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E2DBE9] space-y-3">
                <p className="text-xs sm:text-sm font-medium text-[#2D2D2D] leading-relaxed italic font-serif">
                  "{adaptive.voiceScript}"
                </p>

                <button
                  onClick={handleSpeakVoiceScript}
                  className="w-full py-2.5 rounded-xl bg-[#5B487A] hover:bg-[#483762] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Play Spoken Audio Script</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#463261] font-medium">
              Best for blind / low-vision users, auditory learners, or hands-free listening.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
