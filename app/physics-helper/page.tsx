'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import TopicSelector from '@/components/TopicSelector';
import { getPhysicsStaticContent } from '@/lib/physics-static';

type Mode = 'explain' | 'solver' | 'pyq' | 'mistake' | 'rapid';

interface ModeConfig {
  id: Mode;
  title: string;
  icon: string;
  desc: string;
  color: string;
  inputType: 'topic' | 'text';
  placeholder: string;
  example: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'explain',
    title: 'Simple Mode (Weak Student)',
    icon: '🧩',
    desc: 'Bite-sized concept explanations with analogies',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inputType: 'topic',
    placeholder: 'Topic (e.g. Current Electricity)',
    example: 'Current Electricity'
  },
  {
    id: 'solver',
    title: 'Step-by-Step Solver',
    icon: '⚡',
    desc: 'Paste a numerical, get it solved slowly step-by-step',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    inputType: 'text',
    placeholder: 'Paste your Physics question here...',
    example: 'A car accelerates uniformly from rest to 20m/s in 10s. Find the distance covered.'
  },
  {
    id: 'pyq',
    title: 'PYQ Pattern Mode',
    icon: '🎯',
    desc: 'See the most repeated models for a topic + shortcuts',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    inputType: 'topic',
    placeholder: 'Topic (e.g. Ray Optics)',
    example: 'Ray Optics'
  },
  {
    id: 'mistake',
    title: 'Mistake Fixer',
    icon: '❌',
    desc: 'Paste your wrong logic, AI will diagnose your weakness',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    inputType: 'text',
    placeholder: 'E.g. I used v=u+at but didn\'t take g as negative...',
    example: 'I calculated projectile max height using H = u^2/2g instead of H = u^2 sin^2(theta)/2g.'
  },
  {
    id: 'rapid',
    title: '15-Min Revision',
    icon: '⏱️',
    desc: 'Quick formula sheet + 3 traps + 5 rapid MCQs',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    inputType: 'topic',
    placeholder: 'Topic (e.g. Modern Physics)',
    example: 'Modern Physics'
  }
];

const StructuredResult = ({ text, copyToClipboard }: { text: string; copyToClipboard: () => void }) => {
  // Split sections by emojis followed by titles
  const sections = text.split(/(?=🚀|🧩|🔢|⚡|❌|📝|🔍|🎯|💡|🛠️|⚠️|⏱️)/g).filter(Boolean);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
      <div className="bg-gray-900 px-5 py-3 flex justify-between items-center">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Coach Protocol Active
        </span>
        <button 
          onClick={copyToClipboard}
          className="text-[10px] font-bold bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
        >
          Copy
        </button>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {sections.map((section, idx) => {
          const lines = section.trim().split('\n');
          const header = lines[0];
          const content = lines.slice(1).join('\n');

          // Determine section colors based on icons
          let headerColor = "text-gray-900";
          let bgColor = "bg-gray-50/50";
          let borderColor = "border-gray-100";

          if (header.includes('🚀')) { headerColor = "text-blue-600"; bgColor = "bg-blue-50/50"; borderColor = "border-blue-100"; }
          if (header.includes('⚡') || header.includes('🎯')) { headerColor = "text-amber-600"; bgColor = "bg-amber-50/50"; borderColor = "border-amber-100"; }
          if (header.includes('❌') || header.includes('⚠️')) { headerColor = "text-rose-600"; bgColor = "bg-rose-50/50"; borderColor = "border-rose-100"; }
          if (header.includes('🧩')) { headerColor = "text-purple-600"; bgColor = "bg-purple-50/50"; borderColor = "border-purple-100"; }
          if (header.includes('🔢') || header.includes('🛠️')) { headerColor = "text-emerald-600"; bgColor = "bg-emerald-50/50"; borderColor = "border-emerald-100"; }
          if (header.includes('⏱️')) { headerColor = "text-amber-700"; bgColor = "bg-amber-50/50"; borderColor = "border-amber-100"; }

          return (
            <div key={idx} className={`${bgColor} border ${borderColor} rounded-2xl p-4 transition-all hover:shadow-sm`}>
              <h3 className={`text-sm font-black mb-1.5 flex items-center gap-2 ${headerColor}`}>
                {header}
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                {content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function PhysicsHelperPage() {
  const [activeMode, setActiveMode] = useState<ModeConfig | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleRun = async () => {
    if (!inputVal || !activeMode) return;
    setLoading(true);
    setResult('');
    
    try {
      const staticResult = getPhysicsStaticContent(activeMode.id, inputVal);
      
      if (staticResult) {
        // Add a small artificial delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        setResult(staticResult);
      } else {
        const res = await fetch('/api/physics-helper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: activeMode.id, input: inputVal })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to generate');
        
        setResult(data.result);
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-4">
        {activeMode ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveMode(null); setResult(''); setInputVal(''); }}
              className="text-gray-500 font-medium text-sm border border-gray-200 px-3 py-1 rounded-full active:scale-95 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-bold text-gray-900">{activeMode.icon} {activeMode.title}</h1>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">🧲 Physics AI Mentor</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Weak Student Mode Active</p>
            </div>
            <div className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full border border-blue-200">
              PRO
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {!activeMode ? (
          <div className="grid grid-cols-1 gap-4">
            {MODES.map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveMode(mod)}
                className={`text-left p-5 rounded-[2rem] border transition-all active:scale-[0.98] ${mod.color} bg-opacity-40 hover:bg-opacity-80 shadow-sm flex items-start gap-4`}
              >
                <div className="text-3xl bg-white/60 p-3 rounded-2xl shadow-sm">{mod.icon}</div>
                <div>
                  <h2 className="font-black text-base mb-1 tracking-tight">{mod.title}</h2>
                  <p className="text-xs font-medium opacity-80 leading-relaxed">{mod.desc}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  {activeMode.inputType === 'topic' ? 'Select or Type Topic' : 'Input Question'}
                </label>
                {activeMode.inputType === 'topic' ? (
                  <div className="mt-2 text-gray-900">
                     <TopicSelector subject="Physics" value={inputVal} onChange={setInputVal} />
                  </div>
                ) : (
                  <textarea
                    className="w-full mt-2 px-5 py-4 rounded-2xl border-2 border-gray-100 text-sm font-medium focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none text-gray-900 min-h-[140px] resize-y transition-all"
                    placeholder={activeMode.placeholder}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                )}
                
                <div className="mt-3 flex items-center justify-between">
                  <button 
                    onClick={() => setInputVal(activeMode.example)}
                    className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1.5 active:scale-95"
                  >
                    🎲 Try Example Topic
                  </button>
                  {inputVal && (
                    <button 
                      onClick={() => setInputVal('')}
                      className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors px-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleRun}
                disabled={!inputVal || loading}
                className={`w-full py-4 rounded-2xl font-black text-sm text-white transition-all active:scale-95 flex items-center justify-center gap-3
                  ${(!inputVal || loading) ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-gray-900 shadow-xl shadow-blue-900/10 hover:bg-blue-600'}
                `}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>✨ Launch Learning Mode</>
                )}
              </button>
            </div>

            {loading && !result && (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <div>
                  <p className="text-sm font-black text-gray-900">Simplifying your path to MBBS...</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Building step-by-step logic</p>
                </div>
              </div>
            )}

            {result && <StructuredResult text={result} copyToClipboard={copyToClipboard} />}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
