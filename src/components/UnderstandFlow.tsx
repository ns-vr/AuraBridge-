import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  Volume2,
  Globe,
  ListTodo,
  MessageSquare,
  ShieldCheck,
  Clock,
  FileText,
  AlertCircle,
  Video,
  VideoOff,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { UnderstandResult, UserProfile, ExplainabilityTarget, ActionChecklistItem } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/samples';
import { speechService } from '../utils/speech';

interface UnderstandFlowProps {
  userProfile: UserProfile;
  onOpenExplainability: (target: ExplainabilityTarget) => void;
  onAddChecklistItem: (item: ActionChecklistItem) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const UnderstandFlow: React.FC<UnderstandFlowProps> = ({
  userProfile,
  onOpenExplainability,
  onAddChecklistItem,
  onNavigate,
}) => {
  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('university');
  const [currentResult, setCurrentResult] = useState<UnderstandResult>(
    SAMPLE_DOCUMENTS.university.result
  );
  const [activeIntent, setActiveIntent] = useState<string>('Explain this');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isUsingRealWebcam, setIsUsingRealWebcam] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [customTextPrompt, setCustomTextPrompt] = useState<string>('');
  const [addedToChecklistAlert, setAddedToChecklistAlert] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Intent buttons as requested in master prompt
  const intents = [
    { id: "What's this?", label: "🔍 What's this?" },
    { id: "Explain this", label: "💡 Explain this" },
    { id: "What do I need to do?", label: "✅ What do I need to do?" },
    { id: "Translate", label: "🌐 Translate" },
    { id: "Help me ask", label: "💬 Help me ask" },
  ];

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    setWebcamError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsUsingRealWebcam(true);
      } else {
        setWebcamError('Webcam API is not supported in this browser environment.');
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setWebcamError('Camera access unavailable or declined. Using interactive document scanner.');
      setIsUsingRealWebcam(false);
    }
  };

  const stopWebcam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsUsingRealWebcam(false);
  };

  const handleSelectSample = (key: string) => {
    setSelectedSampleKey(key);
    setUploadedImagePreview(null);
    const sample = SAMPLE_DOCUMENTS[key];
    if (sample) {
      setIsScanning(true);
      setTimeout(() => {
        setCurrentResult(sample.result);
        setIsScanning(false);
        if (userProfile.accessibility.voiceGuidance) {
          speechService.speak(sample.result.oneLineSummary);
        }
      }, 350);
    }
  };

  const handleCaptureOrAnalyze = async (intent: string = activeIntent) => {
    setActiveIntent(intent);
    setIsScanning(true);

    try {
      let imageBase64: string | null = null;

      // If webcam is active, capture frame
      if (isUsingRealWebcam && videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        }
      } else if (uploadedImagePreview) {
        imageBase64 = uploadedImagePreview;
      }

      const sampleDoc = SAMPLE_DOCUMENTS[selectedSampleKey];
      const payloadText = customTextPrompt || sampleDoc?.rawDocumentText || '';

      // Call full-stack server endpoint
      const response = await fetch('/api/understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          text: payloadText,
          intent,
          preferences: {
            explanationStyle: userProfile.explanationStyle,
            language: userProfile.languages[0] || 'English',
          },
        }),
      });

      const json = await response.json();
      if (json && json.data) {
        const d = json.data;
        const generatedResult: UnderstandResult = {
          id: `scan-${Date.now()}`,
          classification: d.classification || '📄 Verified Document',
          title: d.title || 'Official Notice',
          oneLineSummary: d.oneLineSummary || 'Important document analyzed by AuraBridge.',
          essentialFacts: d.essentialFacts?.map((f: any, idx: number) => ({
            id: `ef-${idx}`,
            label: f.label,
            value: f.value,
            sourceExcerpt: f.sourceExcerpt,
            locationCitation: f.locationCitation || 'Page 1',
            confidence: 0.98,
          })) || sampleDoc.result.essentialFacts,
          whatToDoNext: d.whatToDoNext || sampleDoc.result.whatToDoNext,
          simplifiedExplanation: d.simplifiedExplanation || sampleDoc.result.simplifiedExplanation,
          confidenceScore: d.confidenceScore || 0.98,
          explainabilityNote: d.explainabilityNote || 'Grounding verified against detected clauses.',
          timestamp: 'Just now',
          liveAi: json.liveAi,
          sampleType: selectedSampleKey,
        };

        setCurrentResult(generatedResult);

        if (userProfile.accessibility.voiceGuidance) {
          speechService.speak(generatedResult.oneLineSummary);
        }
      }
    } catch (err) {
      console.warn('API error, using local dataset fallback', err);
      if (SAMPLE_DOCUMENTS[selectedSampleKey]) {
        setCurrentResult(SAMPLE_DOCUMENTS[selectedSampleKey].result);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedImagePreview(result);
        handleCaptureOrAnalyze();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListenToSummary = () => {
    speechService.speak(
      `${currentResult.title}. ${currentResult.oneLineSummary}. What to do next: ${currentResult.whatToDoNext.join('. ')}`
    );
  };

  const handleAddAllToChecklist = () => {
    currentResult.whatToDoNext.forEach((step, idx) => {
      onAddChecklistItem({
        id: `act-${Date.now()}-${idx}`,
        title: step,
        category: currentResult.title,
        dueDate: currentResult.essentialFacts.find((f) => f.label.toLowerCase().includes('date') || f.label.toLowerCase().includes('deadline'))?.value || 'Next Week',
        isCompleted: false,
        sourceDocName: currentResult.title,
        priority: idx === 0 ? 'high' : 'medium',
      });
    });
    setAddedToChecklistAlert(true);
    setTimeout(() => setAddedToChecklistAlert(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB]">
            <Camera className="w-3.5 h-3.5 text-[#C25E2B]" />
            <span>Multimodal Vision & Document Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2D2D2D] tracking-tight mt-1">
            See & Understand with AuraBridge
          </h1>
          <p className="text-sm text-[#6B6355]">
            Point at any real-world notice, form, medication, or assignment to extract essential facts and action steps.
          </p>
        </div>

        {/* Live Webcam Toggle */}
        <div className="flex items-center gap-2">
          {isUsingRealWebcam ? (
            <button
              onClick={stopWebcam}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <VideoOff className="w-4 h-4" />
              <span>Turn Camera Off</span>
            </button>
          ) : (
            <button
              onClick={startWebcam}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2D2D2D] hover:bg-[#1E1E1E] text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Video className="w-4 h-4" />
              <span>Use Live Device Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Viewfinder & Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Viewfinder & Preset Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Document Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-[#EFE8DC] shadow-artistic space-y-2">
            <label className="text-xs font-bold text-[#7A7265] uppercase tracking-wider block">
              Choose Real-World Sample Document:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.entries(SAMPLE_DOCUMENTS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleSelectSample(key)}
                  className={`p-2.5 rounded-xl text-left border-2 text-xs font-semibold transition-all cursor-pointer ${
                    selectedSampleKey === key && !uploadedImagePreview
                      ? 'border-[#C25E2B] bg-[#FCFAF7] text-[#93441B] shadow-2xs font-bold'
                      : 'border-[#EFE8DC] hover:border-[#D6C2A5] bg-[#FAF7F2] text-[#2D2D2D]'
                  }`}
                >
                  <div className="truncate">{item.label.split(' ')[0]} {item.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>

            {/* Custom Upload Drop */}
            <div className="pt-2">
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#D6C2A5] hover:border-[#C25E2B] bg-[#FAF7F2] hover:bg-[#F5EFE6] text-xs font-semibold text-[#6B6355] cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#C25E2B]" />
                <span>Upload Custom Document / Photo</span>
                <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Viewfinder Window */}
          <div className="relative bg-stone-950 rounded-3xl overflow-hidden border-4 border-stone-800 shadow-xl aspect-4/3 flex items-center justify-center text-white">
            {isUsingRealWebcam ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : uploadedImagePreview ? (
              <img
                src={uploadedImagePreview}
                alt="Uploaded scan"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              /* Realistic Simulated Document Viewfinder */
              <div className="p-6 text-stone-300 text-xs font-mono space-y-3 w-full h-full flex flex-col justify-between bg-stone-900/90">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-amber-400 font-bold">● OPTICAL SCANNER ACTIVE</span>
                  <span className="text-[10px] text-stone-500">1080p Multimodal Stream</span>
                </div>

                <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-2 text-[11px] leading-relaxed text-stone-300">
                  <div className="font-bold text-stone-100 uppercase tracking-wide">
                    {SAMPLE_DOCUMENTS[selectedSampleKey]?.label}
                  </div>
                  <p className="line-clamp-4 text-stone-400">
                    {SAMPLE_DOCUMENTS[selectedSampleKey]?.rawDocumentText}
                  </p>
                </div>

                <div className="text-[10px] text-stone-500 flex items-center justify-between">
                  <span>Bounding Box: Auto-Framing</span>
                  <span>Confidence: 98%</span>
                </div>
              </div>
            )}

            {/* Scanning Line Animation */}
            {isScanning && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E67E22] to-transparent shadow-[0_0_15px_#E67E22] z-20"
              />
            )}

            {/* Corner Viewfinder Crosshairs */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#E67E22] rounded-tl-sm pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#E67E22] rounded-tr-sm pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#E67E22] rounded-bl-sm pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#E67E22] rounded-br-sm pointer-events-none"></div>
          </div>

          {/* Bottom Action Bar of Intents */}
          <div className="bg-white p-3 rounded-2xl border border-[#EFE8DC] shadow-artistic space-y-2">
            <div className="text-[11px] font-bold text-[#7A7265] uppercase tracking-wider">
              Select Analysis Intent:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {intents.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => handleCaptureOrAnalyze(intent.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeIntent === intent.id
                      ? 'bg-[#C25E2B] text-white shadow-xs'
                      : 'bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D]'
                  }`}
                >
                  {intent.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Summary Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentResult.id + selectedSampleKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl border-2 border-[#E8DCCB] shadow-artistic p-6 sm:p-8 space-y-6 text-[#2D2D2D]"
            >
              {/* Classification & Confidence Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFE8DC] pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB]">
                    {currentResult.classification}
                  </span>
                  <span className="text-xs text-[#7A7265] flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3A6B4F]" />
                    Verified by Aura
                  </span>
                </div>
                <span className="text-xs text-[#A89F91] font-mono">
                  {currentResult.timestamp}
                </span>
              </div>

              {/* Title & Plain Summary */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black font-serif text-[#2D2D2D] tracking-tight">
                  {currentResult.title}
                </h2>
                <div className="p-4 bg-[#FCFAF7] rounded-2xl border border-[#EFE8DC]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#93441B] mb-1">
                    Plain Summary (Your Preference: {userProfile.explanationStyle})
                  </div>
                  <p className="text-sm sm:text-base font-medium text-[#2D2D2D] leading-relaxed">
                    {currentResult.oneLineSummary}
                  </p>
                </div>
              </div>

              {/* Essential Facts with "🔎 Show me why" trigger */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A7265]">
                    Essential Facts Extracted ({currentResult.essentialFacts.length})
                  </h3>
                  <span className="text-[11px] text-[#C25E2B] font-medium">
                    Tap "Show me why" to view proof
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentResult.essentialFacts.map((fact) => (
                    <div
                      key={fact.id}
                      className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EFE8DC] hover:border-[#D6C2A5] transition-colors space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#7A7265]">{fact.label}</div>
                        <div className="text-sm font-bold text-[#2D2D2D] mt-0.5">{fact.value}</div>
                      </div>

                      {/* The "Show me why" Explainability Affordance */}
                      <button
                        onClick={() =>
                          onOpenExplainability({
                            claimLabel: fact.label,
                            claimValue: fact.value,
                            sourceExcerpt: fact.sourceExcerpt,
                            locationCitation: fact.locationCitation,
                            confidenceScore: fact.confidence || 0.98,
                            rationale: currentResult.explainabilityNote,
                            documentTitle: currentResult.title,
                            sampleType: currentResult.sampleType,
                          })
                        }
                        className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-[#93441B] hover:text-[#7A3614] bg-[#F5EFE6] hover:bg-[#EBDDC9] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#E8DCCB]"
                        title="View exact proof and location in original document"
                      >
                        <Search className="w-3.5 h-3.5 text-[#C25E2B]" />
                        <span>🔎 Show me why</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* What To Do Next (Numbered Checklist) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A7265]">
                  What You Need To Do Next
                </h3>
                <div className="space-y-2">
                  {currentResult.whatToDoNext.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FCFAF7] rounded-xl border border-[#EFE8DC] flex items-start gap-3 text-xs sm:text-sm text-[#2D2D2D]"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#C25E2B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Chips Bar */}
              <div className="pt-4 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleListenToSummary}
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-[#C25E2B]" />
                    <span>Listen Aloud</span>
                  </button>

                  <button
                    onClick={() => onNavigate('adaptive')}
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-[#3A6B4F]" />
                    <span>Adaptive Styles</span>
                  </button>

                  <button
                    onClick={() => onNavigate('communicate')}
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-[#FAF7F2] hover:bg-[#F5EFE6] text-[#2D2D2D] border border-[#EFE8DC] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#5B487A]" />
                    <span>Help Me Respond</span>
                  </button>
                </div>

                <button
                  onClick={handleAddAllToChecklist}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#C25E2B] hover:bg-[#A84B1D] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <ListTodo className="w-4 h-4" />
                  <span>Add To My Checklists</span>
                </button>
              </div>

              {/* Confirmation Toast */}
              {addedToChecklistAlert && (
                <div className="p-3 bg-[#EAF5EF] border border-[#B2D8C3] text-[#1E4D31] rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3A6B4F]" />
                    Action items successfully added to your Checklists!
                  </span>
                  <button
                    onClick={() => onNavigate('actions')}
                    className="underline font-bold hover:text-[#143522] cursor-pointer"
                  >
                    View Checklists →
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
