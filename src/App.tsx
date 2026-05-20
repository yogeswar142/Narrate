import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, Rocket, Terminal, Zap, Check, Code2, Loader2, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
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

const LinkedInPreviewCard = ({ 
  content, 
  projectName,
  onCopy 
}: { 
  content: string; 
  projectName: string;
  onCopy: (text: string) => void 
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    onCopy(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldTruncate = content.length > 320;
  const displayContent = (!isExpanded && shouldTruncate) 
    ? `${content.slice(0, 280)}...` 
    : content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-[#141416]/95 border border-zinc-800/80 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative"
    >
      {/* Top Header Card Info */}
      <div className="p-4 flex items-start justify-between border-b border-zinc-900/50">
        <div className="flex gap-3">
          {/* Custom Avatar Gradient */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-inner uppercase select-none">
            {projectName ? projectName.slice(0, 2).toUpperCase() : 'YW'}
          </div>
          <div>
            <div className="font-semibold text-zinc-100 flex items-center gap-1.5 text-sm md:text-base">
              {projectName || 'Developer'}
              <span className="text-zinc-500 font-normal text-xs">• 1st</span>
            </div>
            <div className="text-xs text-zinc-400 font-normal mt-0.5 max-w-[220px] md:max-w-none truncate">
              Full Stack Engineer & Creator | Building {projectName || 'Narrate'}
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
              <span>1h •</span>
              <span className="scale-75 origin-left select-none">🌐</span>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={cn(
            "p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium font-mono border select-none cursor-pointer",
            copied 
              ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700"
          )}
        >
          {copied ? (
            <>
              <Check size={13} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy Post
            </>
          )}
        </button>
      </div>

      {/* Main LinkedIn Text Body */}
      <div className="p-4 md:p-5 select-text">
        <p className="text-zinc-200 text-sm whitespace-pre-wrap leading-relaxed font-sans">
          {displayContent}
        </p>
        
        {!isExpanded && shouldTruncate && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-zinc-400 hover:text-indigo-400 text-xs font-semibold mt-2 hover:underline focus:outline-none transition-colors cursor-pointer"
          >
            ...see more
          </button>
        )}
        
        {isExpanded && shouldTruncate && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-zinc-400 hover:text-indigo-400 text-xs font-semibold mt-2 hover:underline focus:outline-none transition-colors cursor-pointer"
          >
            show less
          </button>
        )}
      </div>

      {/* Feed Interaction Bar Mockup */}
      <div className="px-4 py-2 border-t border-zinc-900/60 bg-zinc-900/10 flex items-center justify-between text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1 items-center">
            <span className="w-4.5 h-4.5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px]">👍</span>
            <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px]">👏</span>
            <span className="w-4.5 h-4.5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[10px]">💡</span>
          </div>
          <span>42 likes</span>
        </div>
        <div>
          <span>12 comments • 3 shares</span>
        </div>
      </div>

      <div className="p-1 border-t border-zinc-900/80 bg-zinc-900/30 grid grid-cols-4 gap-0.5 select-none text-[11px] md:text-xs">
        <button className="py-2 rounded-lg flex items-center justify-center gap-1 text-zinc-400 hover:bg-zinc-800/40 hover:text-indigo-400 transition-colors font-medium cursor-pointer">
          👍 Like
        </button>
        <button className="py-2 rounded-lg flex items-center justify-center gap-1 text-zinc-400 hover:bg-zinc-800/40 hover:text-indigo-400 transition-colors font-medium cursor-pointer">
          💬 Comment
        </button>
        <button className="py-2 rounded-lg flex items-center justify-center gap-1 text-zinc-400 hover:bg-zinc-800/40 hover:text-indigo-400 transition-colors font-medium cursor-pointer">
          🔁 Repost
        </button>
        <button className="py-2 rounded-lg flex items-center justify-center gap-1 text-zinc-400 hover:bg-zinc-800/40 hover:text-indigo-400 transition-colors font-medium cursor-pointer">
          ✉️ Send
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [win, setWin] = useState('');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<PostVersions | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [activeTab, setActiveTab] = useState<'story' | 'tech' | 'punchy'>('story');
  const [styleMode, setStyleMode] = useState<string>('default');

  // 1. Restore state from localStorage on mount (Prevents re-generation costs)
  React.useEffect(() => {
    try {
      const savedResults = localStorage.getItem('narrate_results');
      if (savedResults) setResults(JSON.parse(savedResults));
      
      const savedModel = localStorage.getItem('narrate_model_used');
      if (savedModel) setModelUsed(savedModel);

      const savedProj = localStorage.getItem('narrate_proj');
      if (savedProj) setProjectName(savedProj);

      const savedUrl = localStorage.getItem('narrate_url');
      if (savedUrl) setGithubUrl(savedUrl);

      const savedNotes = localStorage.getItem('narrate_notes');
      if (savedNotes) setNotes(savedNotes);

      const savedWin = localStorage.getItem('narrate_win');
      if (savedWin) setWin(savedWin);

      const savedPass = localStorage.getItem('narrate_pass');
      if (savedPass) setPassword(savedPass);

      const savedStyleMode = localStorage.getItem('narrate_style_mode');
      if (savedStyleMode) setStyleMode(savedStyleMode);
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
  }, []);

  // Cooldown timer logic
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, githubUrl, notes, win, password, styleMode }),
      });
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Generation failed');
        }
        setResults(data.versions);
        setModelUsed(data.modelUsed);
        
        // Cache in browser
        localStorage.setItem('narrate_results', JSON.stringify(data.versions));
        localStorage.setItem('narrate_model_used', data.modelUsed);
        localStorage.setItem('narrate_proj', projectName);
        localStorage.setItem('narrate_url', githubUrl);
        localStorage.setItem('narrate_notes', notes);
        localStorage.setItem('narrate_win', win);
        localStorage.setItem('narrate_pass', password);
        localStorage.setItem('narrate_style_mode', styleMode);
      } else {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || `Server error: ${response.status}`);
        }
        throw new Error('Unexpected response format from server');
      }
    } catch (error: any) {
      console.error('Generation failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setCooldown(15); // 15-second visual rate-limit safety cooldown
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
  };

  const openLinkedIn = () => {
    window.open('https://www.linkedin.com/feed/', '_blank');
  };

  const clearCache = () => {
    localStorage.removeItem('narrate_results');
    localStorage.removeItem('narrate_model_used');
    setResults(null);
    setModelUsed(null);
  };

  return (
    <div className="min-h-screen bg-[#070708] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.1),rgba(255,255,255,0))] text-zinc-100 selection:bg-indigo-500/30 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Modern Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://yogeswar.xyz" className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <Terminal className="text-white animate-pulse" size={22} />
            </a>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Narrate</h1>
              <p className="text-zinc-500 text-xs font-mono flex items-center gap-1.5">
                by Yogeswar
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                Developer Content Engine
              </p>
            </div>
          </div>
          <a href="https://github.com/yogeswar142/Narrate" target="_blank" rel="noopener noreferrer" className="p-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 hover:border-zinc-700 transition-all text-zinc-400 hover:text-white flex items-center gap-1 text-xs font-mono">
            <Code2 size={16} />
            Repo
          </a>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/20 border border-zinc-800/40 p-5 rounded-2xl backdrop-blur-xl">
              <div className="space-y-2 mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
                  <Zap size={18} className="text-amber-400" />
                  Raw Technical Notes
                </h2>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Feed Narrate what you built. Keep it messy and code-heavy; our AI constructs the developer narrative.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1">Project Name</label>
                  <input
                    required
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Cordia Analytics"
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-700 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1">GitHub Repo URL (Optional)</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-700 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1">Writing Style Mode</label>
                  <select
                    value={styleMode}
                    onChange={(e) => setStyleMode(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm text-zinc-300 [&>option]:bg-zinc-950 cursor-pointer"
                  >
                    <option value="default">Default (Balanced & Authentic)</option>
                    <option value="professional">Professional (Polished & Structured)</option>
                    <option value="founder_story">Founder Story (Journey & Lessons)</option>
                    <option value="funny_humorous">Funny / Humorous (Developer Wit)</option>
                    <option value="casual_developer">Casual Developer (Relaxed & Conversational)</option>
                    <option value="technical">Technical (Architecture & Engineering)</option>
                    <option value="inspirational">Inspirational (Uplifting & Grounded)</option>
                    <option value="minimal">Minimal (Short, Clean, No Fluff)</option>
                    <option value="viral_linkedin">Viral LinkedIn (Hook & Pacing)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1">What did you actually do?</label>
                  <textarea
                    required
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Refactored Redis ZSETs, resolved 403 CORS errors, optimized MongoDB TTL..."
                    rows={4}
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-700 text-sm resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1">What was the 'win'?</label>
                  <input
                    required
                    type="text"
                    value={win}
                    onChange={(e) => setWin(e.target.value)}
                    placeholder="Achieved sub-second dashboard performance"
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-700 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1 flex items-center justify-between">
                    <span>Admin Password</span>
                    <span className="flex items-center gap-1 text-[9px] text-zinc-600 font-normal normal-case select-none">
                      <Lock size={9} /> Private
                    </span>
                  </label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-zinc-700 text-sm"
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/5 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-mono leading-relaxed"
                  >
                    ERROR: {error}
                  </motion.div>
                )}

                <button
                  disabled={loading || cooldown > 0}
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-900/50 disabled:text-zinc-600 border border-indigo-500/20 disabled:border-zinc-800/40 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group overflow-hidden relative cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-indigo-400" size={18} />
                      <span className="font-mono text-zinc-400 text-xs">Assembling Narratives...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <span className="font-mono text-xs">Throttle Lock: {cooldown}s</span>
                  ) : (
                    <>
                      <span>Generate Narratives</span>
                      <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Output Preview Panel (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-900/10 border border-zinc-800/30 p-5 rounded-2xl backdrop-blur-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-900/50">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
                    <Rocket size={18} className="text-indigo-400" />
                    Post Drafts
                  </h2>
                  {modelUsed && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                      <Sparkles size={11} className="text-indigo-400/80" />
                      Engine: <span className="text-indigo-400">{modelUsed}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {results && (
                    <>
                      <button
                        onClick={clearCache}
                        className="text-[10px] font-mono text-zinc-500 hover:text-red-400 transition-colors border border-zinc-850 px-2 py-1 rounded-md bg-zinc-900/40 cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        onClick={openLinkedIn}
                        className="text-xs font-semibold flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        Launch LinkedIn
                        <ArrowUpRight size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Switcher */}
              {results && !loading && (
                <div className="mb-5 flex border-b border-zinc-800 p-0.5 bg-zinc-950/40 rounded-xl max-w-xs md:max-w-sm">
                  {(['story', 'tech', 'punchy'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[10px] md:text-xs font-mono capitalize tracking-wide transition-all cursor-pointer",
                        activeTab === tab 
                          ? "text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 font-bold" 
                          : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                      )}
                    >
                      {tab === 'story' ? 'The Story' : tab === 'tech' ? 'The Tech' : 'The Punchy'}
                    </button>
                  ))}
                </div>
              )}

              {/* Display Area */}
              <div className="min-h-[300px] flex flex-col justify-center">
                {!results && !loading && (
                  <div className="py-20 border border-zinc-850 border-dashed rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-2 select-none">
                    <Sparkles className="text-zinc-700" size={24} />
                    <p className="text-xs font-mono">Your generated previews will render here.</p>
                  </div>
                )}

                {loading && (
                  <div className="space-y-4 w-full">
                    {/* Pulsing LinkedIn mock shimmer */}
                    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 space-y-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-zinc-800" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-zinc-800 rounded w-1/3" />
                          <div className="h-3 bg-zinc-800 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="space-y-2.5 pt-2">
                        <div className="h-3 bg-zinc-800 rounded w-full" />
                        <div className="h-3 bg-zinc-800 rounded w-5/6" />
                        <div className="h-3 bg-zinc-800 rounded w-4/5" />
                        <div className="h-3 bg-zinc-800 rounded w-11/12" />
                      </div>
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {results && !loading && (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {activeTab === 'story' && (
                        <LinkedInPreviewCard
                          projectName={projectName}
                          content={results.story}
                          onCopy={handleCopy}
                        />
                      )}
                      {activeTab === 'tech' && (
                        <LinkedInPreviewCard
                          projectName={projectName}
                          content={results.tech}
                          onCopy={handleCopy}
                        />
                      )}
                      {activeTab === 'punchy' && (
                        <LinkedInPreviewCard
                          projectName={projectName}
                          content={results.punchy}
                          onCopy={handleCopy}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </main>

        <footer className="mt-20 pt-8 border-t border-zinc-900/60 text-center text-zinc-600 text-xs font-mono flex items-center justify-center gap-1.5 select-none">
          NARRATE // CORE DEPLOYED BY <a href="https://yogeswar.xyz" className="hover:text-indigo-400 transition-colors underline decoration-zinc-800">YOGESWAR</a>
        </footer>
      </div>
    </div>
  );
}
