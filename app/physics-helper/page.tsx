'use client';

import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import TopicSelector from '@/components/TopicSelector';

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
    title: 'Explain Simply',
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
    title: 'PYQ Pattern',
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
    title: 'Rapid Revision',
    icon: '⏱️',
    desc: 'Quick formula sheet + 3 traps + 5 rapid MCQs',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    inputType: 'topic',
    placeholder: 'Topic (e.g. Modern Physics)',
    example: 'Modern Physics'
  }
];

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
      const res = await fetch('/api/physics-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: activeMode.id, input: inputVal })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      
      setResult(data.result);
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
              className="text-gray-500 font-medium text-sm"
            >
              ← Back
            </button>
            <h1 className="text-lg font-bold text-gray-900">{activeMode.icon} {activeMode.title}</h1>
          </div>
        ) : (
          <div>
            <h1 className="text-lg font-bold text-gray-900">🧲 Physics Helper</h1>
            <p className="text-xs text-gray-500 mt-0.5">Weak in math? Let\'s make physics intuitive.</p>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {!activeMode ? (
          <div className="grid grid-cols-1 gap-3">
            {MODES.map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveMode(mod)}
                className={`text-left p-4 rounded-2xl border transition-transform active:scale-[0.98] ${mod.color} bg-opacity-40 hover:bg-opacity-60`}
              >
                <div className="text-2xl mb-2">{mod.icon}</div>
                <h2 className="font-bold text-base mb-1">{mod.title}</h2>
                <p className="text-xs opacity-90">{mod.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-5 animate-slide-up">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {activeMode.inputType === 'topic' ? 'Select or Type Topic' : 'Your Input'}
                </label>
                {activeMode.inputType === 'topic' ? (
                  <div className="mt-2 text-gray-900">
                     <TopicSelector subject="Physics" value={inputVal} onChange={setInputVal} />
                  </div>
                ) : (
                  <textarea
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:border-blue-400 outline-none text-gray-900 min-h-[120px] resize-y"
                    placeholder={activeMode.placeholder}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                  />
                )}
                
                <div className="mt-2">
                  <button 
                    onClick={() => setInputVal(activeMode.example)}
                    className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    🎲 Try Example
                  </button>
                </div>
              </div>

              <button
                onClick={handleRun}
                disabled={!inputVal || loading}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95 flex items-center justify-center gap-2
                  ${(!inputVal || loading) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 shadow-md hover:bg-gray-800'}
                `}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>✨ Generate Magic</>
                )}
              </button>
            </div>

            {loading && !result && (
              <div className="text-center py-10 space-y-3">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium text-gray-600 animate-pulse">Simplifying physics concepts for you...</p>
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                <div className="bg-gray-900 px-4 py-2.5 flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">AI Coach Output</span>
                  <button 
                    onClick={copyToClipboard}
                    className="text-xs font-bold bg-white text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 active:scale-95"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-4 sm:p-5 overflow-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed max-w-none">
                    {result.replace(/\*/g, '')}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
