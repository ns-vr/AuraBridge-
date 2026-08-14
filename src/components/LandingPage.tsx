import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Camera,
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Receipt,
  UserCheck,
  CheckCircle2,
  Volume2,
  Globe,
  MessageSquare,
  ListTodo,
  ShieldCheck,
  Zap,
  Search,
  BookOpen,
  Users
} from 'lucide-react';
import { UserAccessibilityPreferences } from '../types';
import { speechService } from '../utils/speech';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onNavigate: (view: string) => void;
  accessibility: UserAccessibilityPreferences;
  onOpenExplainability: (target: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onNavigate,
  accessibility,
  onOpenExplainability,
}) => {
  // Mini hero interactive demo state
  const [heroChipMode, setHeroChipMode] = useState<'default' | 'simple' | 'translate' | 'respond'>('default');
  const [heroScanning, setHeroScanning] = useState(false);

  const handleTriggerHeroChip = (mode: 'default' | 'simple' | 'translate' | 'respond') => {
    setHeroScanning(true);
    setTimeout(() => {
      setHeroChipMode(mode);
      setHeroScanning(false);
      if (mode === 'simple') {
        speechService.speak("Simple explanation: You were awarded $4,500 for tuition. Please upload your income paper before September 17 to receive the money.");
      } else if (mode === 'translate') {
        speechService.speak("En español: Beca aprobada. Por favor suba su certificado de ingresos antes del 17 de septiembre.");
      }
    }, 280);
  };

  const handleTransformationListen = () => {
    speechService.speak("Good news! You qualified for the Merit Scholarship. There is only one item missing: your family income certificate. Make sure to upload it before September 17 at 5 PM.");
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Vision & Primary Calls to Action */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB]">
              <Sparkles className="w-3.5 h-3.5 text-[#C25E2B]" />
              <span>Universal AI Accessibility Layer</span>
            </div>

            <div className="space-y-3">
              <h1
                className={`font-black tracking-tight text-[#2D2D2D] font-serif leading-[1.15] ${
                  accessibility.largerText
                    ? 'text-4xl sm:text-5xl lg:text-6xl'
                    : 'text-3xl sm:text-5xl lg:text-[3.25rem]'
                }`}
              >
                The world wasn't designed for everyone.{' '}
                <span className="text-[#C25E2B] block mt-1 italic">
                  AI can adapt it to you.
                </span>
              </h1>
              <p
                className={`text-[#6B6355] leading-relaxed max-w-2xl font-normal ${
                  accessibility.largerText ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                }`}
              >
                AuraBridge uses multimodal AI to understand what’s in front of you, communicate
                what you’re trying to say, and turn confusing bureaucracy into actionable checklists
                — personalized to your preferred way of learning and interacting.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onStartOnboarding}
                className="px-6 py-3.5 rounded-xl font-bold text-base bg-[#C25E2B] hover:bg-[#A84B1D] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('understand')}
                className="px-6 py-3.5 rounded-xl font-semibold text-base bg-white hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#C25E2B]" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Tagline Footnote */}
            <p className="text-xs sm:text-sm font-medium text-[#7A7265] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#A89F91]" />
              For every voice · Every language · Every generation · Every ability
            </p>
          </div>

          {/* Right Column: Interactive Hero Mini Demo Frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-[#25201A] rounded-3xl p-3 sm:p-4 shadow-2xl border-4 border-[#3D352B] text-white">
              {/* Phone Status Bar Simulation */}
              <div className="flex items-center justify-between px-3 py-1.5 text-xs text-[#A89F91] font-mono">
                <span className="font-semibold text-[#FAF7F2]">AuraBridge Live Preview</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Ready
                </span>
              </div>

              {/* Viewport Card */}
              <div className="bg-[#1A1612] rounded-2xl p-4 sm:p-5 border border-[#3D352B] space-y-4 relative overflow-hidden">
                {/* Simulated scanning beam */}
                {heroScanning && (
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: '100%' }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E67E22] to-transparent shadow-[0_0_12px_#E67E22] z-20"
                  />
                )}

                {/* Classification Pill */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C25E2B]/25 text-[#F6C29E] border border-[#C25E2B]/40">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>University Notice Detected</span>
                  </div>
                  <span className="text-[11px] text-[#A89F91] font-mono">98% Match</span>
                </div>

                {/* Parsed Summary Card Body */}
                <div className="bg-[#262019] rounded-xl p-4 border border-[#3D352B] space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-sm text-stone-100 font-serif">
                      Scholarship Application (Merit Grant)
                    </h2>
                    <span className="text-xs font-bold text-[#F6C29E] px-2 py-0.5 bg-[#422616] rounded-md border border-[#69391D]">
                      $4,500
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {heroChipMode === 'default' && (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between text-stone-300 bg-[#312B23] px-2.5 py-1.5 rounded-lg border border-[#433B30]">
                          <span className="text-[#A89F91]">📅 Deadline:</span>
                          <span className="font-semibold text-amber-200">17 September 2026</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-300 bg-rose-950/40 border border-rose-900/50 px-2.5 py-1.5 rounded-lg">
                          <span className="text-rose-300">⚠️ Missing Item:</span>
                          <span className="font-semibold text-rose-200">Income Certificate</span>
                        </div>
                      </motion.div>
                    )}

                    {heroChipMode === 'simple' && (
                      <motion.div
                        key="simple"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="p-3 bg-[#382312] border border-[#C25E2B]/50 rounded-xl text-xs text-[#FBEBE1] space-y-1.5"
                      >
                        <div className="font-bold text-[#F6C29E] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Plain Language Version
                        </div>
                        <p className="leading-relaxed">
                          You won the scholarship! You just need to upload your family income paper online
                          before September 17 at 5 PM so the money can be sent to you.
                        </p>
                      </motion.div>
                    )}

                    {heroChipMode === 'translate' && (
                      <motion.div
                        key="translate"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="p-3 bg-[#132A22] border border-[#3A6B4F]/50 rounded-xl text-xs text-[#E1F3EA] space-y-1.5"
                      >
                        <div className="font-bold text-[#84D2A6] flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#84D2A6]" />
                          Traducción al Español (Significado adaptado)
                        </div>
                        <p className="leading-relaxed">
                          ¡Beca aprobada ($4,500)! Debe adjuntar su certificado de ingresos en el portal estudiantil
                          antes del 17 de septiembre.
                        </p>
                      </motion.div>
                    )}

                    {heroChipMode === 'respond' && (
                      <motion.div
                        key="respond"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="p-3 bg-[#1A2536] border border-[#3E5C76]/50 rounded-xl text-xs text-[#E2EBF5] space-y-2"
                      >
                        <div className="font-bold text-[#90B8DE] flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#90B8DE]" />
                          Ready-to-Send Inquiries (AAC / Email)
                        </div>
                        <div className="bg-[#121A26] p-2 rounded-md font-mono text-[11px] text-stone-200">
                          "Hello, could you please confirm if my IRS 1040 form is accepted for Annexure-B?"
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3 Interactive Tappable Chips */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-[#A89F91]">
                    Tap to adapt presentation live:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleTriggerHeroChip('simple')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                        heroChipMode === 'simple'
                          ? 'bg-[#C25E2B] text-white font-bold ring-2 ring-[#E67E22]'
                          : 'bg-[#312B23] hover:bg-[#3D352B] text-stone-200'
                      }`}
                    >
                      Explain simply
                    </button>
                    <button
                      onClick={() => handleTriggerHeroChip('translate')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                        heroChipMode === 'translate'
                          ? 'bg-[#3A6B4F] text-white font-bold ring-2 ring-[#52946F]'
                          : 'bg-[#312B23] hover:bg-[#3D352B] text-stone-200'
                      }`}
                    >
                      Translate
                    </button>
                    <button
                      onClick={() => handleTriggerHeroChip('respond')}
                      className={`px-2.5 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                        heroChipMode === 'respond'
                          ? 'bg-[#3E5C76] text-white font-bold ring-2 ring-[#648BAA]'
                          : 'bg-[#312B23] hover:bg-[#3D352B] text-stone-200'
                      }`}
                    >
                      Help respond
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "MADE FOR YOU" SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE8DC] shadow-artistic space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#C25E2B]">
              Personal Preference Over Age or Stereotype
            </span>
            <h2
              className={`font-black text-[#2D2D2D] font-serif tracking-tight ${
                accessibility.largerText ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
              }`}
            >
              You don't adapt to AuraBridge. AuraBridge adapts to you.
            </h2>
            <p className="text-[#6B6355] text-sm sm:text-base">
              Accessibility shouldn't force you into a rigid box. We adapt how information is
              explained, voiced, or displayed based on your explicit preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Young Learners */}
            <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#EFE8DC] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C25E2B] text-white flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2D2D2D] font-serif">Young Learners</h3>
              <p className="text-xs sm:text-sm text-[#6B6355] leading-relaxed">
                Visual cards, simple language, step-by-step guidance, and engaging fragment sentence builders.
              </p>
            </div>

            {/* Card 2: Students */}
            <div className="p-5 rounded-2xl bg-[#F7FAF8] border border-[#DCEBE2] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3A6B4F] text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2D2D2D] font-serif">Students & Scholars</h3>
              <p className="text-xs sm:text-sm text-[#6B6355] leading-relaxed">
                Fast document extraction, deadline reminders, missing attachment detection, and task checklists.
              </p>
            </div>

            {/* Card 3: Everyday Life */}
            <div className="p-5 rounded-2xl bg-[#F8F7F5] border border-[#EFE8DC] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D352B] text-white flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2D2D2D] font-serif">Everyday Life</h3>
              <p className="text-xs sm:text-sm text-[#6B6355] leading-relaxed">
                De-jargoning confusing bureaucracy — utility bills, government notices, lease clauses, and appointment slips.
              </p>
            </div>

            {/* Card 4: Older Adults & Low Vision */}
            <div className="p-5 rounded-2xl bg-[#FDF9F4] border border-[#F4E2D0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#93441B] text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#2D2D2D] font-serif">Older Adults & Low Vision</h3>
              <p className="text-xs sm:text-sm text-[#6B6355] leading-relaxed">
                Large high-contrast text, patient spoken explanations, clear medical schedules, and zero clutter.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#7A7265]">
            <span>💡 "Age doesn't define how you should use AuraBridge. You do."</span>
            <button
              onClick={() => onNavigate('profile')}
              className="text-[#C25E2B] hover:text-[#93441B] underline flex items-center gap-1 cursor-pointer"
            >
              Configure Your Preferences
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. "MAGIC" TRANSFORMATION PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-[#C25E2B]">
            The Transformation Flow
          </span>
          <h2
            className={`font-black text-[#2D2D2D] font-serif tracking-tight ${
              accessibility.largerText ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            From Bureaucratic Maze to Clear Action
          </h2>
          <p className="text-[#6B6355] text-sm sm:text-base">
            Watch how a dense legal clause transforms into clear facts, explainable citations, and concrete next steps.
          </p>
        </div>

        {/* Pipeline Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 py-2 text-xs sm:text-sm font-bold">
          <div className="px-3.5 py-1.5 rounded-full bg-[#EFE8DC] text-[#3D352B] flex items-center gap-1.5 shadow-xs border border-[#DFD5C2]">
            <Camera className="w-3.5 h-3.5 text-[#6B6355]" />
            <span>Camera / Voice</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#A89F91] hidden sm:block" />
          <div className="px-3.5 py-1.5 rounded-full bg-[#C25E2B] text-white flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aura AI Multimodal</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#A89F91] hidden sm:block" />
          <div className="px-3.5 py-1.5 rounded-full bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB] flex items-center gap-1.5">
            <span>1. Understand</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#F0F7F3] text-[#2D5A40] border border-[#D0E6D9] flex items-center gap-1.5">
            <span>2. Communicate</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[#EFF4F9] text-[#2C4A6F] border border-[#CFE0F0] flex items-center gap-1.5">
            <span>3. Act</span>
          </div>
        </div>

        {/* Side-by-side Before & After Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Before Card */}
          <div className="bg-[#F3EEE6] rounded-2xl p-6 border border-[#E4DAC8] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#7A7265] uppercase tracking-wider">
                <span>Before: Original Complex Notice</span>
                <span className="text-rose-700 font-semibold">❌ Confusing & Dense</span>
              </div>
              <div className="bg-white/90 p-4 rounded-xl border border-[#E4DAC8] font-serif text-sm leading-relaxed text-[#3D352B]">
                "Pursuant to Section 4.8 of the Higher Education Affordability Directive, your application for the Merit Tuition Subsidy has been provisionally accepted. To finalize the disbursement of funds ($4,500/semester), all recipients must submit Annexure-B (Certified Gross Familial Income Certificate) no later than September 17, 2026 at 17:00 EST. Failure to submit required annexures by the prescribed cutoff will result in automatic nullification of the allocated financial concession."
              </div>
            </div>
            <div className="text-xs text-[#7A7265] italic">
              * Users often miss critical deadlines due to overwhelming legal phrasing.
            </div>
          </div>

          {/* After Card */}
          <div className="bg-gradient-to-br from-[#FDF9F4] to-[#F7F2EA] rounded-2xl p-6 border-2 border-[#E8C5A8] shadow-artistic space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#93441B] uppercase tracking-wider">
                <span>After: AuraBridge Structured Clarity</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Actionable & Clear
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EFE8DC] shadow-xs space-y-3">
                <div className="font-bold text-base text-[#2D2D2D] font-serif flex items-center justify-between">
                  <span>Merit Tuition Subsidy ($4,500)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#266840] font-semibold border border-[#D2EFE0]">
                    Approved
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#F9F7F4] rounded-lg border border-[#EFE8DC]">
                    <span className="text-[#7A7265] block">Deadline</span>
                    <span className="font-bold text-[#93441B]">Sept 17, 2026 (5 PM)</span>
                  </div>
                  <div className="p-2 bg-[#FDF5ED] rounded-lg border border-[#F6DAC1]">
                    <span className="text-[#93441B] block">Missing Item</span>
                    <span className="font-bold text-[#74300E]">Income Certificate</span>
                  </div>
                </div>

                <p className="text-xs text-[#5A5248] leading-relaxed">
                  <strong>Plain Summary:</strong> You won the $4,500 scholarship. Just upload your income
                  certificate to the portal before September 17 to receive your money.
                </p>
              </div>
            </div>

            {/* Action Chips */}
            <div className="space-y-2 pt-2 border-t border-[#EFE8DC]">
              <div className="text-[11px] font-semibold text-[#7A7265]">Available immediate actions:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleTransformationListen}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#C25E2B]" />
                  Listen
                </button>
                <button
                  onClick={() => onNavigate('understand')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#F0F7F3] text-[#2D2D2D] border border-[#EFE8DC] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-[#3A6B4F]" />
                  Translate
                </button>
                <button
                  onClick={() => onNavigate('communicate')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#EFF4F9] text-[#2D2D2D] border border-[#EFE8DC] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#2C4A6F]" />
                  Help me ask someone
                </button>
                <button
                  onClick={() => onNavigate('actions')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C25E2B] hover:bg-[#A84B1D] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <ListTodo className="w-3.5 h-3.5" />
                  Make a checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#2A231C] via-[#382C22] to-[#452918] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl border border-[#4D3D2F]">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black font-serif tracking-tight">
              Ready to make the world adapt to you?
            </h2>
            <p className="text-[#D8CFBF] text-sm sm:text-base">
              Set your preferences in under 60 seconds or dive straight into camera understanding.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartOnboarding}
              className="px-8 py-3.5 rounded-xl font-bold text-base bg-[#E67E22] hover:bg-[#D35400] text-[#1C150E] shadow-lg transition-all cursor-pointer"
            >
              Personalize Your Aura (1 min)
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 rounded-xl font-semibold text-base bg-[#3D3227] hover:bg-[#4E4032] text-[#FAF7F2] border border-[#594A3B] transition-all cursor-pointer"
            >
              Enter Dashboard Directly →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
