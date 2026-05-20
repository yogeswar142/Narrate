import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Copy, Rocket, Terminal, Zap, Check, Code2, Loader2, Sparkles, 
  Lock, ArrowUpRight, Sun, Moon, ArrowRight 
} from 'lucide-react';
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
      className="bg-white dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm backdrop-blur-md relative transition-colors duration-300"
    >
      {/* Top Header Card Info */}
      <div className="p-4 flex items-start justify-between border-b border-zinc-100 dark:border-zinc-900/50">
        <div className="flex gap-3">
          {/* Custom Avatar Gradient */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-400 flex items-center justify-center font-bold text-white dark:text-zinc-950 tracking-wider text-sm shadow-inner uppercase select-none font-display">
            {projectName ? projectName.slice(0, 2).toUpperCase() : 'YW'}
          </div>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-sm md:text-base font-display">
              {projectName || 'Developer'}
              <span className="text-zinc-400 dark:text-zinc-500 font-normal text-xs">• 1st</span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5 max-w-[220px] md:max-w-none truncate">
              Full Stack Engineer & Creator | Building {projectName || 'Narrate'}
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
              <span>1h •</span>
              <span className="scale-75 origin-left select-none">🌐</span>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={cn(
            "p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold font-mono border select-none cursor-pointer",
            copied 
              ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 shadow-sm" 
              : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
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
      <div className="p-5 select-text">
        <p className="text-zinc-800 dark:text-zinc-200 text-sm whitespace-pre-wrap leading-relaxed font-sans">
          {displayContent}
        </p>
        
        {!isExpanded && shouldTruncate && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 text-xs font-semibold mt-2 hover:underline focus:outline-none transition-colors cursor-pointer"
          >
            ...see more
          </button>
        )}
        
        {isExpanded && shouldTruncate && (
          <button
            onClick={() => setIsExpanded(false)}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 text-xs font-semibold mt-2 hover:underline focus:outline-none transition-colors cursor-pointer"
          >
            show less
          </button>
        )}
      </div>

      {/* Feed Interaction Bar Mockup */}
      <div className="px-5 py-2.5 border-t border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 select-none">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1 items-center">
            <span className="w-4.5 h-4.5 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px]">👍</span>
            <span className="w-4.5 h-4.5 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px]">👏</span>
            <span className="w-4.5 h-4.5 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px]">💡</span>
          </div>
          <span>42 likes</span>
        </div>
        <div>
          <span>12 comments • 3 shares</span>
        </div>
      </div>

      <div className="p-1 border-t border-zinc-100 dark:border-zinc-900/80 bg-zinc-50/30 dark:bg-zinc-900/20 grid grid-cols-4 gap-0.5 select-none text-[11px] md:text-xs">
        <button className="py-2.5 rounded-lg flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-semibold cursor-pointer">
          👍 Like
        </button>
        <button className="py-2.5 rounded-lg flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-semibold cursor-pointer">
          💬 Comment
        </button>
        <button className="py-2.5 rounded-lg flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-semibold cursor-pointer">
          🔁 Repost
        </button>
        <button className="py-2.5 rounded-lg flex items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-semibold cursor-pointer">
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

  // Custom Page Routing State: 'home' | 'workspace'
  const [currentPage, setCurrentPage] = useState<'home' | 'workspace'>('home');

  // Multi-Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('narrate_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    }
    return 'dark';
  });

  // Apply Theme Toggle Class
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('narrate_theme', theme);
  }, [theme]);

  // Restore states from localStorage on mount
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
      setCooldown(15);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: theme === 'dark' ? ['#f4f4f5', '#a1a1aa', '#3f3f46'] : ['#18181b', '#71717a', '#d4d4d8']
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
    <div className={cn(
      "min-h-screen font-sans transition-colors duration-300",
      theme === 'dark' 
        ? "bg-[#09090b] text-zinc-100 selection:bg-zinc-800" 
        : "bg-zinc-50 text-zinc-900 selection:bg-zinc-200"
    )}>
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,0,0,0.015),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(255,255,255,0.02),rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 relative z-10">
        
        {/* Minimal Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentPage('home')}
              className="w-9 h-9 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              <Terminal className="text-zinc-100 dark:text-zinc-900" size={18} />
            </button>
            <div>
              <button 
                onClick={() => setCurrentPage('home')} 
                className="text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-zinc-50 cursor-pointer block text-left hover:opacity-85 transition-opacity"
              >
                Narrate
              </button>
              <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-wider uppercase">
                Developer Content Engine
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            {currentPage === 'workspace' ? (
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm"
              >
                ← Back to Home
              </button>
            ) : (
              <a href="#how-it-works" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors hidden sm:inline-block mr-2">
                How it Works
              </a>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer flex items-center justify-center bg-white dark:bg-zinc-950 shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <a 
              href="https://github.com/yogeswar142/Narrate" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1.5 text-xs font-mono bg-white dark:bg-zinc-950 shadow-sm"
            >
              <Code2 size={15} />
              <span>Repo</span>
            </a>
          </div>
        </header>

        <main className="space-y-16">
          <AnimatePresence mode="wait">
            
            {/* Page 1: Home/Marketing Explainer Landing Page */}
            {currentPage === 'home' && (
              <motion.div
                key="home-page"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-20"
              >
                {/* Hero Section */}
                <section className="py-12 text-center max-w-3xl mx-auto space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-[10px] font-mono tracking-widest text-zinc-500 uppercase select-none shadow-sm">
                    <Sparkles size={11} className="text-zinc-400 dark:text-zinc-500 animate-pulse" />
                    Highly Authentic LinkedIn Storyteller
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight leading-[1.15] text-zinc-900 dark:text-zinc-50">
                    Your developer journey, <span className="font-light italic text-zinc-600 dark:text-zinc-400">narrated</span>.
                  </h1>
                  <p className="text-base md:text-lg text-zinc-900 dark:text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto">
                    No corporate speak. No robotic hype. Narrate transforms your messy raw code commits and technical notes into authentic, emotionally grounded LinkedIn stories in 9 customizable writing styles.
                  </p>
                  <div className="flex items-center justify-center gap-3.5 pt-4">
                    <button 
                      onClick={() => setCurrentPage('workspace')}
                      className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-sm font-semibold transition-all hover:scale-[1.02] flex items-center gap-2 shadow-sm cursor-pointer select-none"
                    >
                      Launch Post Builder
                      <ArrowRight size={15} />
                    </button>
                    <a 
                      href="#how-it-works" 
                      className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-sm font-semibold transition-all cursor-pointer select-none shadow-sm"
                    >
                      Learn How it Works
                    </a>
                  </div>
                </section>

                {/* Explainer: visual preview of Workspace UI layout with apple style blur-overlay */}
                <section className="py-8 border-t border-zinc-200 dark:border-zinc-900 space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100 tracking-tight">Post Builder Sandbox</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                      Take a look at the minimalist dashboard. Click to launch into the live workspace.
                    </p>
                  </div>

                  <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 bg-white/70 dark:bg-zinc-900/20 backdrop-blur-sm overflow-hidden select-none shadow-sm">
                    
                    {/* Mockup Workspace (Static, styled, visual representation only) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start opacity-35 blur-[1px]">
                      
                      {/* Left: Input Form Mock */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4">
                          <div className="space-y-1.5">
                            <div className="w-12 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                            <div className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="w-12 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                            <div className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl h-9" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="w-12 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                            <div className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl h-9" />
                          </div>
                        </div>
                      </div>

                      {/* Right: LinkedIn Card Mock */}
                      <div className="lg:col-span-7 bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl">
                        <div className="flex gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                          <div className="space-y-2 flex-1 pt-1.5">
                            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                            <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                          </div>
                        </div>
                        <div className="space-y-2.5 pt-1">
                          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12" />
                          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
                        </div>
                      </div>

                    </div>

                    {/* Clean Apple-Style Glass CTA Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/10 dark:bg-zinc-950/10 backdrop-blur-[2px] transition-all">
                      <motion.button 
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentPage('workspace')}
                        className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-2xl shadow-md border border-zinc-900 dark:border-zinc-100 flex items-center gap-2 cursor-pointer relative z-20 group text-sm"
                      >
                        <span>Open Sandbox Post Builder</span>
                        <Rocket size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-white dark:text-zinc-950" />
                      </motion.button>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs font-semibold mt-3.5 select-none">
                        Launch the production-ready developer content engine
                      </p>
                    </div>
                  </div>
                </section>

                {/* How it Works Explainer */}
                <section id="how-it-works" className="py-12 border-t border-zinc-200 dark:border-zinc-900 scroll-mt-6">
                  <div className="text-center space-y-2 mb-14">
                    <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100 tracking-tight">Engine Pipeline</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                      How Narrate generates premium stories that capture organic developer value.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-mono font-bold text-zinc-600 dark:text-zinc-400 text-sm shadow-inner">
                        01
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 font-display text-base">Context Scan</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Paste a GitHub URL or type raw notes. The engine scrapes repo metadata, key dependencies in <code>package.json</code>, and directory trees to capture the absolute technical context.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-mono font-bold text-zinc-600 dark:text-zinc-400 text-sm shadow-inner">
                        02
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 font-display text-base">Tone Modulation</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Select from 9 fine-tuned tone profiles (e.g. Founder Story, Witty Humor, Deep Tech). Our dynamic LLM prompting adapts formatting, phrasing constraints, and structural hooks on the fly.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-mono font-bold text-zinc-600 dark:text-zinc-400 text-sm shadow-inner">
                        03
                      </div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 font-display text-base">Tri-Variant Synthesis</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Get 3 distinct, platform-ready outputs—an engaging narrative <strong>Story</strong>, an architecture-centric <strong>Tech</strong> post, and a fast-paced <strong>Punchy</strong> variant. Ready to review and publish.
                      </p>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* Page 2: Dedicated Post Builder Workspace Page */}
            {currentPage === 'workspace' && (
              <motion.div
                key="workspace-page"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Back Link breadcrumb Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-900">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="text-xs font-bold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 px-3.5 py-2 rounded-xl shadow-sm"
                  >
                    ← Back to Landing Page
                  </button>
                  
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-500">
                    <Sparkles size={12} className="text-zinc-400" />
                    <span>Workspace Deployed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                  
                  {/* Left Column: Form (5 Columns) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div id="builder-form" className="bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm backdrop-blur-xl space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-lg font-bold font-display flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                          <Zap size={16} className="text-zinc-500 dark:text-zinc-400" />
                          Content Builder
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                          Feed Narrate what you built. Keep it messy and code-heavy; our engine constructs the developer narrative.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Project Name</label>
                          <input
                            required
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g. Cordia Analytics"
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">GitHub Repo URL (Optional)</label>
                          <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/user/repo"
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Writing Style Mode</label>
                          <select
                            value={styleMode}
                            onChange={(e) => setStyleMode(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all text-sm text-zinc-800 dark:text-zinc-200 [&>option]:bg-white dark:[&>option]:bg-zinc-950 cursor-pointer shadow-sm"
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
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">What did you actually do?</label>
                          <textarea
                            required
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Refactored Redis ZSETs, resolved 403 CORS errors, optimized MongoDB TTL..."
                            rows={4}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm text-zinc-900 dark:text-zinc-100 resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">What was the 'win'?</label>
                          <input
                            required
                            type="text"
                            value={win}
                            onChange={(e) => setWin(e.target.value)}
                            placeholder="Achieved sub-second dashboard performance"
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1 flex items-center justify-between">
                            <span>Admin Password</span>
                            <span className="flex items-center gap-1 text-[9px] text-zinc-500 dark:text-zinc-600 font-normal normal-case select-none">
                              <Lock size={9} /> Private
                            </span>
                          </label>
                          <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-xs font-mono leading-relaxed shadow-sm"
                          >
                            ERROR: {error}
                          </motion.div>
                        )}

                        <button
                          disabled={loading || cooldown > 0}
                          type="submit"
                          className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 disabled:bg-zinc-100 dark:disabled:bg-zinc-900/50 disabled:text-zinc-400 dark:disabled:text-zinc-600 border border-zinc-900 dark:border-zinc-100 disabled:border-zinc-200 dark:disabled:border-zinc-900/40 text-white dark:text-zinc-950 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group overflow-hidden relative cursor-pointer shadow-sm"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="animate-spin text-zinc-500 dark:text-zinc-400" size={18} />
                              <span className="font-mono text-zinc-500 dark:text-zinc-400 text-xs">Assembling Narratives...</span>
                            </>
                          ) : cooldown > 0 ? (
                            <span className="font-mono text-xs">Throttle Lock: {cooldown}s</span>
                          ) : (
                            <>
                              <span>Generate Narratives</span>
                              <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-white dark:text-zinc-950" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right Column: Output Preview Panel (7 Columns) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm backdrop-blur-xl">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-900/50">
                        <div className="space-y-1">
                          <h2 className="text-lg font-bold font-display flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                            <Rocket size={16} className="text-zinc-500 dark:text-zinc-400" />
                            Post Drafts
                          </h2>
                          {modelUsed && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                              <Sparkles size={11} className="text-zinc-400 dark:text-zinc-500" />
                              Engine: <span className="text-zinc-800 dark:text-zinc-300 font-semibold">{modelUsed}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5">
                          {results && (
                            <>
                              <button
                                onClick={clearCache}
                                className="text-[10px] font-semibold font-mono text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900/40 cursor-pointer"
                              >
                                Reset
                              </button>
                              <button
                                onClick={openLinkedIn}
                                className="text-xs font-bold flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
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
                        <div className="mb-5 flex border border-zinc-200 dark:border-zinc-800 p-1 bg-zinc-50 dark:bg-zinc-950 rounded-xl max-w-xs md:max-w-sm shadow-sm">
                          {(['story', 'tech', 'punchy'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={cn(
                                "flex-1 py-2 rounded-lg text-[10px] md:text-xs font-mono capitalize tracking-wide transition-all cursor-pointer font-bold",
                                activeTab === tab 
                                  ? "text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm" 
                                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border border-transparent"
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
                          <div className="py-24 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-500 gap-2.5 select-none bg-zinc-50/20 dark:bg-transparent">
                            <Sparkles className="text-zinc-300 dark:text-zinc-700" size={24} />
                            <p className="text-xs font-semibold font-mono">Your generated previews will render here.</p>
                          </div>
                        )}

                        {loading && (
                          <div className="space-y-4 w-full">
                            {/* Pulsing LinkedIn mock shimmer */}
                            <div className="bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 animate-pulse">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900" />
                                <div className="space-y-2 flex-1">
                                  <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-1/3" />
                                  <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-1/2" />
                                </div>
                              </div>
                              <div className="space-y-2.5 pt-2">
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-full" />
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-5/6" />
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-4/5" />
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-11/12" />
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

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-28 py-10 border-t border-zinc-200 dark:border-zinc-900 text-center text-zinc-500 dark:text-zinc-400 text-xs font-mono flex items-center justify-center gap-1.5 select-none animate-fade-in">
          NARRATE // DEPLOYED BY <a href="https://yogeswar.xyz" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-200 dark:decoration-zinc-800 font-semibold">YOGESWAR</a>
        </footer>
      </div>
    </div>
  );
}
