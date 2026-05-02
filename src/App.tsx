import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, Rocket, Terminal, Zap, Check, Code2, Share2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PostVersions {
  story: string;
  tech: string;
  punchy: string;
}

const PostCard = ({ title, content, icon: Icon, onCopy }: { title: string; content: string; icon: any; onCopy: (text: string) => void }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors group relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm">
          <Icon size={16} className="text-indigo-400" />
          {title}
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "p-2 rounded-lg transition-all",
            copied ? "bg-green-500/10 text-green-400" : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
          )}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <p className="text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans text-sm">
        {content}
      </p>
    </motion.div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');
  const [win, setWin] = useState('');
  const [results, setResults] = useState<PostVersions | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, notes, win }),
      });
      const data = await response.json();
      setResults(data.versions);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#818cf8', '#4f46e5', '#a5b4fc']
    });
  };

  const openLinkedIn = () => {
    window.open('https://www.linkedin.com/feed/', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-indigo-500/30 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Terminal className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Narrate</h1>
              <p className="text-zinc-500 text-sm font-mono">MVP // Developer Content Engine</p>
            </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <Code2 size={20} />
          </a>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Input */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                Raw Technical Notes
              </h2>
              <p className="text-zinc-500 text-sm">Tell Narrate what you built. Keep it raw, the AI handles the polish.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-1">Project Name</label>
                  <input
                    required
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Cordia Analytics"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-1">What did you actually do?</label>
                  <textarea
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Refactored Redis ZSETs, resolved 403 CORS errors, optimized MongoDB TTL..."
                    rows={4}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-700 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 ml-1">What was the 'win'?</label>
                  <input
                    required
                    type="text"
                    value={win}
                    onChange={(e) => setWin(e.target.value)}
                    placeholder="Achieved sub-second dashboard performance"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Generate Narratives</span>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Output */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Rocket size={18} className="text-indigo-400" />
                Post Drafts
              </h2>
              {results && (
                <button
                  onClick={openLinkedIn}
                  className="text-xs font-mono flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Share2 size={14} />
                  Launch to LinkedIn
                </button>
              )}
            </div>

            <div className="space-y-4">
              {!results && !loading && (
                <div className="h-64 border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center text-zinc-600">
                  <p className="text-sm">Posts will appear here after generation</p>
                </div>
              )}

              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 h-40 rounded-xl animate-pulse" />
                  ))}
                </div>
              )}

              <AnimatePresence>
                {results && !loading && (
                  <div className="space-y-4">
                    <PostCard
                      title="The Story"
                      icon={Terminal}
                      content={results.story}
                      onCopy={handleCopy}
                    />
                    <PostCard
                      title="The Tech"
                      icon={Zap}
                      content={results.tech}
                      onCopy={handleCopy}
                    />
                    <PostCard
                      title="The Punchy"
                      icon={Rocket}
                      content={results.punchy}
                      onCopy={handleCopy}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        <footer className="mt-20 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs font-mono">
          NARRATE // BUILT FOR DEVELOPERS BY ANTIGRAVITY
        </footer>
      </div>
    </div>
  );
}
