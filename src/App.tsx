/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  User,
  Timestamp
} from './lib/firebase';
import { getDoc } from 'firebase/firestore';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Info, 
  Globe, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Facebook,
  Instagram,
  Youtube,
  Music2,
  Linkedin,
  Plus,
  Check,
   Loader2,
  Zap,
  Tv,
  Users,
  Star,
  Download,
  Lock
} from 'lucide-react';

// --- Types ---

type PageId = 
  | 'home' 
  | 'thesis-shield' 
  | 'internship-shield' 
  | 'subject-catalog' 
  | 'subject-detail' 
  | 'expert-advice' 
  | 'degree-gateway' 
  | 'about' 
  | 'contact'
  | 'blog'
  | 'privacy'
  | 'terms'
  | 'blog-post'
  | 'admin';

interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  date: string;
  featured_image: string;
  description: string;
  body: string;
  authorId?: string;
}

interface Subject {
  id: string;
  name: string;
  description: string;
}

// --- Constants ---

const SUBJECTS: Subject[] = [
  { id: 'business', name: 'Business Management', description: 'Mastering the corporate world from theory to boardroom tactics.' },
  { id: 'cs', name: 'Computer Science', description: 'Algorithms, architecture, and coding excellence.' },
  { id: 'economics', name: 'Economics', description: 'Understanding markets, policy, and global financial shifts.' },
  { id: 'english', name: 'English Literature', description: 'Critical analysis and scholarly interpretation of global texts.' },
  { id: 'ir', name: 'International Relations', description: 'Geopolitics, diplomacy, and global governance frameworks.' },
];

const STICKERS = ["SYSTEMS", "CLARITY", "CONSISTENCY", "PROTECTION"];

// --- Components ---

const TacticalLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Encryption");

  useEffect(() => {
    const statuses = [
      "Initializing Encryption",
      "Scanning Personnel Database",
      "Syncing Career Shields",
      "Locking Subject Intelligence",
      "Finalizing Extraction Protocol"
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 5) + 2;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);
      
      const statusIndex = Math.min(Math.floor((currentProgress / 100) * statuses.length), statuses.length - 1);
      setStatus(statuses[statusIndex]);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md space-y-12">
        <div className="space-y-4 text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto"
          />
          <h2 className="text-4xl font-black italic text-white underline decoration-yellow-400/50 uppercase tracking-tighter">DegreeGate</h2>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">{status}...</p>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Sector: Global Intelligence</p>
            </div>
            <div className="text-5xl font-black italic text-white">{progress}%</div>
          </div>
          
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
            />
          </div>
        </div>

        <div className="pt-12 flex justify-center gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= (progress / 33) ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-12 space-y-1 hidden md:block">
        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Signal Status: Encrypted</p>
        <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Auth Level: Extraction Lead</p>
      </div>
    </motion.div>
  );
};

const ProblemSection = () => (
  <section className="py-20 px-6 lg:px-20 relative overflow-hidden bg-yellow-400 border-y border-black/5">
    <div className="max-w-7xl mx-auto space-y-24 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase leading-tight max-w-4xl mx-auto text-black drop-shadow-none flex items-center justify-center gap-6">
          <Zap className="text-black fill-black hidden md:block" size={48} />
          “European universities weren’t built with you in mind.”
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          "One failed subject can cost you an entire year. Retake deadlines, conditional enrollment, scholarship conditions — severe consequences nobody explains upfront.",
          "Your professors are busy. Your family is far away. Office hours are in a language you’re still learning. Google gives you answers for the wrong country.",
          "You got the opportunity. The paperwork killed it. Internship offers, scholarships, exchange programs — lost to documentation errors and missed deadlines."
        ].map((problem, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="geometric-card !bg-black/80 backdrop-blur-md p-10 space-y-6 hover:border-black/40"
          >
            <div className="text-accent text-5xl font-black italic opacity-40">{i + 1}</div>
            <p className="text-lg md:text-xl font-medium italic leading-relaxed text-white">
              {problem}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase text-white drop-shadow-2xl">
          “DegreeGate was.”
        </h2>
      </motion.div>
    </div>
  </section>
);

const ProductCardAnimationWrapper: React.FC<{ children?: ReactNode, index: number }> = ({ children, index }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Precision tactical offsets for 2 cards (Left, Right)
  const initialX = index === 0 ? '-15%' : '15%';
  const initialRotate = index === 0 ? -5 : 5;

  const xTransform = useTransform(scrollYProgress, [0.05, 0.25], [initialX, '0%']);
  const rotateTransform = useTransform(scrollYProgress, [0.05, 0.25], [initialRotate, 0]);
  const opacityTransform = useTransform(scrollYProgress, [0.05, 0.22], [0, 1]);
  const scaleTransform = useTransform(scrollYProgress, [0.05, 0.25], [0.9, 1]);
  
  const x = useSpring(xTransform, { stiffness: 120, damping: 40, bounce: 0 });
  const rotate = useSpring(rotateTransform, { stiffness: 120, damping: 40, bounce: 0 });
  const opacity = useSpring(opacityTransform, { stiffness: 120, damping: 40, bounce: 0 });
  const scale = useSpring(scaleTransform, { stiffness: 120, damping: 40, bounce: 0 });

  return (
    <motion.div
      ref={containerRef}
      style={{ x, opacity, scale, rotate }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const ShieldVideoBackground = ({ src, className = "", innerClassName = "" }: { src: string; className?: string; innerClassName?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      {/* Placeholder / Subtle Loading Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-xl flex items-center justify-center z-10"
          >
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="w-12 h-12"
             >
               <Loader2 className="w-full h-full text-accent animate-pulse" />
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.video
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src={src}
        onCanPlayThrough={() => setIsLoaded(true)}
        className={`w-full h-full object-cover ${innerClassName}`}
      />
    </div>
  );
};

const Sticker = ({ text, className = "" }: { text: string; className?: string }) => (
  <div className={`geometric-badge ${className}`}>
    {text}
  </div>
);

const Navbar = ({ activePage, setPage }: { activePage: PageId, setPage: (p: PageId, id?: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shieldsOpen, setShieldsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Body Scroll Lock when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Text color logic: Always white for the hero feel, or slight tint on scroll
  const navTextColor = "text-white drop-shadow-md";

  return (
    <header 
      className={`h-[100px] fixed top-0 left-0 right-0 transition-all duration-500 flex items-center ${
        isOpen 
          ? 'z-[99999] bg-white shadow-2xl' 
          : scrolled 
            ? 'z-[100] backdrop-blur-xl bg-black/40 h-[80px] shadow-2xl border-b border-white/5' 
            : 'z-[100] backdrop-blur-sm bg-black/20'
      }`}
    >
      <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between px-6 lg:px-12 relative z-[100001]">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => { setPage('home'); setIsOpen(false); }}
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-yellow-400/20 group-hover:rotate-0 transition-transform duration-500">
            <div className="relative">
              <GraduationCap size={24} className="text-black" />
              <Zap size={14} className="text-black absolute -top-2 -right-2 fill-black" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className={`font-display text-[28px] md:text-[34px] leading-none tracking-tighter uppercase italic ${isOpen ? 'text-slate-900' : navTextColor}`}>
              DegreeGate<span className="text-yellow-400">.</span>
            </div>
            <div className={`text-[10px] font-black uppercase tracking-[0.5em] leading-none mt-1 ${isOpen ? 'text-slate-400' : 'text-white/50'}`}>Intelligence Gate</div>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-10 ml-32">
          <button onClick={() => setPage('home')} className={`geometric-nav-link !text-white drop-shadow-md ${activePage === 'home' ? 'after:w-full' : ''}`}>Base</button>
          
          <div className="relative group/dropdown">
            <button 
              className={`geometric-nav-link flex items-center gap-2 !text-white drop-shadow-md ${activePage.includes('shield') ? 'after:w-full' : ''}`}
              onMouseEnter={() => setShieldsOpen(true)}
              onMouseLeave={() => setShieldsOpen(false)}
            >
              The Shields <ChevronDown size={14} className={`transition-transform duration-300 ${shieldsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {shieldsOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  onMouseEnter={() => setShieldsOpen(true)}
                  onMouseLeave={() => setShieldsOpen(false)}
                  className="absolute top-full right-[-20px] bg-black/80 text-white p-4 min-w-[280px] shadow-2xl rounded-[2.5rem] z-[120] mt-4 border border-white/10 backdrop-blur-xl"
                >
                  <div className="space-y-2">
                    <button 
                      onClick={() => { setPage('thesis-shield'); setShieldsOpen(false); }} 
                      className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-4 group/item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase tracking-tight text-white">Thesis Shield</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 italic">Academic Armor</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setPage('internship-shield'); setShieldsOpen(false); }} 
                      className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-4 group/item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase tracking-tight text-white">Internship Shield</div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 italic">Career Pipeline</div>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setPage('subject-catalog')} className={`geometric-nav-link !text-white drop-shadow-md ${activePage === 'subject-catalog' ? 'after:w-full' : ''}`}>Subject Hub</button>
          <button onClick={() => setPage('expert-advice')} className={`geometric-nav-link !text-white drop-shadow-md ${activePage === 'expert-advice' ? 'after:w-full' : ''}`}>Expert Advice</button>
          <button onClick={() => setPage('degree-gateway')} className={`geometric-nav-link !text-white drop-shadow-md ${activePage === 'degree-gateway' ? 'after:w-full' : ''}`}>Gateway</button>
          <button onClick={() => setPage('blog')} className={`geometric-nav-link !text-white drop-shadow-md ${activePage === 'blog' ? 'after:w-full' : ''}`}>Blog</button>
          <button onClick={() => setPage('about')} className={`geometric-nav-link !text-white drop-shadow-md ${activePage === 'about' ? 'after:w-full' : ''}`}>About</button>
          
          <button 
            onClick={() => setPage('contact')}
            className="geometric-button-primary !py-4 !px-8 text-xs !rounded-full bg-white !text-primary border-none shadow-xl hover:bg-accent-light hover:!text-primary transition-all"
          >
            Contact Hub
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={`lg:hidden w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl relative z-[100002] ${
            isOpen ? 'bg-yellow-400 text-black scale-110 shadow-yellow-400/30' : 'bg-black text-white border border-white/20'
          }`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-0 right-0 bottom-0 bg-white lg:hidden z-[99998] flex flex-col items-center justify-start overflow-y-auto pt-48 ${
              scrolled ? 'top-[80px]' : 'top-[100px]'
            }`}
          >
            <div className="flex flex-col p-10 gap-6 font-black text-slate-900 text-2xl tracking-tighter w-full max-w-sm text-center">
              <div className="mb-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center rotate-12 shadow-2xl shadow-yellow-400/20">
                   <GraduationCap size={36} className="text-black" />
                </div>
                <div className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.8em]">Tactical Interface</div>
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => { setPage('home'); setIsOpen(false); }} 
                className="text-center py-5 border-y border-slate-100 italic hover:text-yellow-600 transition-all uppercase tracking-tight group"
              >
                <span className="group-hover:translate-x-2 transition-transform inline-block">Base Hub</span>
              </motion.button>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 py-4"
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-black mb-6 opacity-60">Strategic Shields</span>
                <div className="grid grid-cols-1 gap-4 px-4">
                  <button onClick={() => { setPage('thesis-shield'); setIsOpen(false); }} className="px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-4 italic uppercase text-xs font-black tracking-widest hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all group scale-100 active:scale-95 shadow-md">
                    <GraduationCap size={20} className="text-yellow-600 group-hover:text-black" /> 
                    Thesis Shield
                  </button>
                  <button onClick={() => { setPage('internship-shield'); setIsOpen(false); }} className="px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-4 italic uppercase text-xs font-black tracking-widest hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all group scale-100 active:scale-95 shadow-md">
                    <Briefcase size={20} className="text-yellow-600 group-hover:text-black" /> 
                    Internship Shield
                  </button>
                </div>
              </motion.div>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => { setPage('subject-catalog'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-slate-100 italic hover:text-yellow-600 transition-all uppercase tracking-tight"
              >
                Subject Inventory
              </motion.button>
              
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => { setPage('expert-advice'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-slate-100 italic hover:text-yellow-600 transition-all uppercase tracking-tight"
              >
                Expert Intel
              </motion.button>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => { setPage('degree-gateway'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-slate-100 italic hover:text-yellow-600 transition-all uppercase tracking-tight"
              >
                The Gateway
              </motion.button>
              
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                onClick={() => { setPage('blog'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-slate-100 italic hover:text-yellow-600 transition-all uppercase tracking-tight"
              >
                Intelligence Blog
              </motion.button>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => { setPage('contact'); setIsOpen(false); }} 
                className="geometric-button-primary w-full mt-10 !py-8 text-center !rounded-full bg-slate-900 !text-white border-none shadow-2xl italic uppercase text-xl font-black hover:bg-yellow-400 hover:!text-black transition-all"
              >
                Open Channel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// --- View Components ---

const HomeView = ({ setPage, formatPrice }: { setPage: (p: PageId, id?: string) => void, formatPrice: (b: number) => string }) => {
  return (
    <div className="flex flex-col bg-transparent w-full overflow-x-hidden pt-0">
      {/* Section 0: Hero Section - The "Creators" Layout */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 lg:px-20 overflow-hidden pt-[140px] pb-32">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://degreegate.com/wp-content/uploads/2026/04/makn.mp4" type="video/mp4" />
          </video>
          {/* Bottom Gradient Fade Overlay */}
          <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.7)_100%)]" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto space-y-12 relative z-10"
        >
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black leading-tight text-white tracking-tight drop-shadow-2xl">
              WE PROTECT <br />
              <span className="animate-rainbow-glow underline underline-offset-8 decoration-white/20">CAREERS</span>, <br />
              NOT JUST <span className="text-white border-b-8 border-yellow-400">DEGREES</span>
            </h1>
            
            <p className="text-white text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-2xl italic">
              From first modules to final defense — we help you build your academic infrastructure and scale into global industries.
            </p>
          </div>
          
          <div className="pt-10">
            <button 
              onClick={() => setPage('contact')}
              className="geometric-button-cta shadow-[0_25px_60px_rgba(255,69,0,0.5)] scale-110 md:scale-125"
            >
              START PROTECTING
            </button>
          </div>
        </motion.div>
      </section>

      {/* Section 1: Problem Section */}
      <ProblemSection />

      {/* Section 2: Product Suite (Previously Section 1, reordered to appear after Problem Section) */}
      <section className="bg-purple-300 text-black py-20 px-6 lg:px-20 overflow-hidden relative border-b border-black/5">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        <div className="max-w-7xl mx-auto w-full space-y-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-black/20 pb-16">
            <div className="space-y-6">
              <div className="geometric-badge bg-black text-white">Operational Units</div>
              <h2 className="text-6xl sm:text-7xl md:text-8xl font-black leading-none text-black italic drop-shadow-none">Elite <br /> <span className="text-white underline">Shields</span></h2>
            </div>
            <p className="max-w-md text-black font-black text-lg italic border-l-4 border-black pl-6 py-2 drop-shadow-none">
              Subscription-based bodyguards for your academic and career milestones. Zero failure tolerance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {[
              { 
                id: 'thesis-shield', 
                title: 'Thesis Shield', 
                price: formatPrice(131.5),
                video: 'https://degreegate.com/wp-content/uploads/2026/04/mmkcard.mov',
                desc: 'Total milestone security for your final dissertation.',
                img: 'https://picsum.photos/seed/thesis-tactical/800/600',
                feats: ['Logic Audit', 'Source Scrape', 'Defense Drill']
              },
              { 
                id: 'internship-shield', 
                title: 'Internship Shield', 
                price: formatPrice(105), 
                video: 'https://degreegate.com/wp-content/uploads/2026/04/caed-2.mp4',
                desc: 'Aggressive professional pipeline for global careers.',
                img: 'https://picsum.photos/seed/career-tactical/800/600',
                feats: ['CV Weaponization', 'Interview Ops', 'LinkedIn Audit']
              }
            ].map((s, idx) => (
              <ProductCardAnimationWrapper key={s.id} index={idx}>
                <motion.div 
                  whileHover={{ y: -20, perspective: 1000, rotateY: idx === 0 ? 5 : -5 }}
                  className={`geometric-card h-full min-h-[600px] border-white/10 p-1 group overflow-hidden relative ${s.video ? '!bg-transparent' : ''}`}
                >
                  {s.video && (
                    <>
                      <ShieldVideoBackground src={s.video} />
                      {/* Sub-scrolling cinematic gradient shimmer */}
                      <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-accent/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </>
                  )}

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="relative aspect-video rounded-[2.8rem] overflow-hidden mb-8">
                      {s.video ? (
                        <div className="w-full h-full bg-black/20 backdrop-blur-[2px]" />
                      ) : (
                        <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                      <div className="absolute bottom-8 right-8">
                        <div className="text-5xl font-black text-white italic bg-accent px-8 py-4 rounded-[2rem] shadow-2xl">{s.price}</div>
                      </div>
                    </div>
                    <div className="px-10 pb-16 space-y-8">
                      <h3 className={`text-5xl italic tracking-tighter uppercase drop-shadow-xl text-white`}>
                        {s.title}
                      </h3>
                      <p className={`font-medium leading-relaxed italic drop-shadow-md text-white/95`}>
                        {s.desc}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {s.feats.map(f => (
                          <span 
                            key={f} 
                            className={`text-[10px] font-black border px-4 py-2 rounded-full uppercase tracking-widest text-white border-white/30 bg-black/20 backdrop-blur-sm`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => setPage(s.id as PageId)}
                        className={`geometric-button-primary w-full shadow-none !py-6 text-lg transition-all bg-white !text-primary border-none hover:bg-white hover:scale-[1.02] shadow-xl`}
                      >
                        Initialize Deployment
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ProductCardAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 (Now 6): Expert Intel Callout */}
      <section className="py-20 bg-yellow-400 px-6 lg:px-20 border-b border-black/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
             <div className="absolute -inset-4 bg-black/10 rounded-[4rem] rotate-3 blur-2xl group-hover:rotate-6 transition-transform" />
             <img 
               src="https://degreegate.com/wp-content/uploads/2026/04/img_4502.jpg" 
               className="relative rounded-[3rem] w-full aspect-[4/5] object-cover bg-black shadow-2xl border-[10px] border-black"
               referrerPolicy="no-referrer"
               alt="Expert Advice"
             />
             <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-black text-black animate-bounce shadow-2xl z-20">
               <Zap size={40} className="fill-black" />
             </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
               <div className="geometric-badge bg-black text-white">Expert Advice</div>
               <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-none text-black drop-shadow-none">Brutal <br /> <span className="text-white underline">Honesty.</span></h2>
               <p className="text-xl text-black font-black italic leading-relaxed drop-shadow-none">30 minutes of direct intelligence from professionals working in the heart of Europe. No fluff, just results.</p>
            </div>
            <button onClick={() => setPage('expert-advice')} className="geometric-button-primary w-full !py-8 text-xl italic uppercase tracking-widest !rounded-3xl shadow-xl shadow-black/20 bg-black text-white border-black hover:bg-black/90">Get Direct Intel</button>
          </div>
        </div>
      </section>

      {/* Section 3 (Now 5): Intelligence Stats */}
      <section className="pt-[55px] pb-16 bg-purple-300 text-black overflow-hidden relative border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {[
            { l: 'System Status', v: 'ACTIVE', s: 'text-[52px]' },
            { l: 'Successful Defenses', v: '100%', s: 'text-4xl sm:text-5xl lg:text-6xl' },
            { l: 'Strategic Reach', v: 'GLOBAL', s: 'text-[52px]' },
            { l: 'Operational Phase', v: 'ALPHA', s: 'text-[57px]' }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className={`${stat.s} font-display font-black italic leading-none text-black break-words uppercase`}>{stat.v}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Strategy Hub / Ladder */}
      <section className="py-24 px-6 lg:px-20 relative overflow-hidden border-b border-white/5 min-h-[750px] flex items-center">
        {/* Full Section Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-90"
          >
            <source src="https://degreegate.com/wp-content/uploads/2026/04/5.mp4" type="video/mp4" />
          </video>
          
          {/* Tactical Edge-Only Premium Vignette */}
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,black,transparent_15%,transparent_85%,black)]" />
          <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,black,transparent_15%,transparent_85%,black)]" />
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.03] font-black text-[30vw] leading-none pointer-events-none uppercase italic select-none z-[1]">
          Ladder
        </div>
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div className="geometric-badge bg-accent">Strategy Hub</div>
              <h2 className="text-6xl sm:text-8xl leading-none italic uppercase text-white drop-shadow-2xl">The Value <br /><span className="text-accent underline decoration-4">Ladder</span></h2>
              <p className="text-xl text-white font-medium max-w-lg italic drop-shadow-xl">We take you from total confusion to boardroom excellence. Every step is a strategic advancement.</p>
            </div>

            <div className="space-y-6">
              {[
                { n: '01', t: 'Gateway Hub', d: 'Intelligence & Community', p: 'Free' },
                { n: '02', t: 'Subject Rescue', d: 'Module Correction Ops', p: formatPrice(21) },
                { n: '03', t: 'Expert Intel', d: '30m Strategic Session', p: formatPrice(5) },
                { n: '04', t: 'Shield Ops', d: 'Full Milestone Armor', p: 'Elite' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-8 group cursor-pointer">
                  <div className="text-5xl font-black text-accent/20 group-hover:text-accent transition-colors italic leading-none">{item.n}</div>
                  <div className="flex-grow border-b border-white/10 pb-6 flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-black uppercase text-white group-hover:translate-x-2 transition-transform italic tracking-tighter">{item.t}</div>
                      <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">{item.d}</div>
                    </div>
                    <div className="text-sm font-black text-accent italic">{item.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hidden lg:block h-[600px]" /> {/* Spacer to maintain the layout and let background show through */}
        </div>
      </section>
    </div>
  );
};

const ThesisShieldView = ({ setPage, formatPrice }: { setPage: (p: PageId) => void, formatPrice: (b: number) => string }) => (
  <div className="bg-purple-300">
    <section className="min-h-[65vh] flex items-center justify-center px-6 lg:px-20 pt-[160px] pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/5 z-0 h-[65vh] lg:h-[60vh] rounded-b-[4rem] lg:rounded-b-[10rem] shadow-sm backdrop-blur-sm" />
      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="geometric-badge bg-black !text-white">Protocol ID: ACAD-TH-01</div>
          <h1 className="text-6xl sm:text-7xl md:text-9xl text-black leading-[0.8] tracking-tighter italic uppercase drop-shadow-none">Thesis <br /><span className="text-white underline underline-offset-[12px]">Shield.</span></h1>
          <p className="text-xl text-black font-black max-w-lg italic underline decoration-white/30 drop-shadow-none">
            3-Month Strategic Academic Architecture. We don't write it for you; we audit the logic, scrub the sources, and prepare your defense.
          </p>
          <div className="grid grid-cols-2 gap-8 lg:gap-12 pt-4">
            <div className="space-y-2">
              <div className="text-[10px] font-black text-black/50 uppercase tracking-widest">Access Fee</div>
              <div className="text-5xl lg:text-6xl font-black text-black italic leading-none">{formatPrice(131.5)}</div>
            </div>
            <div className="space-y-2 border-l border-black/10 pl-8 lg:pl-12">
              <div className="text-[10px] font-black text-black/50 uppercase tracking-widest">Success Rate</div>
              <div className="text-5xl font-black text-black italic leading-none">100%</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <button 
              onClick={() => setPage('contact')}
              className="geometric-button-primary px-12 py-6 text-lg !rounded-2xl shadow-xl shadow-black/20 bg-black border-black text-white hover:bg-black/90"
            >
              Initialize Protection
            </button>
          </div>
        </div>
        <motion.div 
          whileHover={{ perspective: 1000, rotateY: 10, rotateX: 5 }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-accent/10 rounded-[4rem] lg:rounded-[5rem] blur-2xl" />
          <div className="relative geometric-card overflow-hidden bg-accent-light border-none shadow-xl aspect-[4/5] rounded-[4rem] lg:rounded-[5rem]">
            <ShieldVideoBackground 
              src="https://degreegate.com/wp-content/uploads/2026/04/mmkcard.mov" 
              innerClassName="group-hover:scale-110 transition-transform duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent flex flex-col justify-end p-10 lg:p-16">
              <h3 className="text-4xl text-white italic mb-4 uppercase tracking-tighter">The Logic Fortress</h3>
              <p className="text-accent text-sm font-bold uppercase tracking-widest">Verify every citation. Validate every argument.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      {[
        { t: 'Logical Consistency Hub', d: 'We audit the entire structure to ensure your research makes objective sense to the committee.', i: <ShieldCheck /> },
        { t: 'Source Verification', d: 'Comprehensive scraping of all academic citations to prevent logical gaps or source errors.', i: <GraduationCap /> },
        { t: 'Defense Simulation', d: 'Live mock defense sessions to prepare you for the committee\'s most aggressive questions.', i: <MessageCircle /> }
      ].map((feat, i) => (
        <motion.div 
          key={i} 
          whileHover={{ y: -10 }}
          className="geometric-card p-10 lg:p-12 space-y-8 group hover:border-accent !bg-black/40 backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
            {feat.i}
          </div>
          <h3 className="text-3xl italic leading-tight text-white uppercase tracking-tighter">{feat.t}</h3>
          <p className="text-white/70 font-medium leading-relaxed italic">{feat.d}</p>
        </motion.div>
      ))}
    </section>
  </div>
);

const InternshipShieldView = ({ setPage, formatPrice }: { setPage: (p: PageId) => void, formatPrice: (b: number) => string }) => (
  <div className="bg-yellow-400">
    <section className="min-h-[70vh] flex items-center justify-center px-6 lg:px-20 pt-[160px] pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[80vw] lg:w-[50vw] h-full bg-black/5 -skew-x-12 z-0 backdrop-blur-sm shadow-2xl" />
      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          whileHover={{ perspective: 1000, rotateY: -10, rotateX: -5 }}
          className="relative order-2 lg:order-1"
        >
          <div className="absolute -inset-8 bg-black/5 rounded-[4rem] lg:rounded-[6rem] -rotate-3" />
          <div className="relative geometric-card border-none shadow-3xl rounded-[4rem] lg:rounded-[6rem] overflow-hidden aspect-[4/5] p-2 !bg-black/80 backdrop-blur-md">
            <ShieldVideoBackground 
              src="https://degreegate.com/wp-content/uploads/2026/04/caed-2.mp4" 
              innerClassName="rounded-[3.5rem] lg:rounded-[5.5rem]"
            />
            <div className="absolute top-12 right-12 bg-black text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Pipeline Active</div>
          </div>
        </motion.div>
        <div className="space-y-12 order-1 lg:order-2 py-10 lg:py-0">
          <div className="space-y-6">
            <div className="geometric-badge bg-black text-white">Sector: Corporate Logistics</div>
            <h1 className="text-6xl sm:text-7xl md:text-9xl tracking-tighter leading-[0.8] italic uppercase text-black drop-shadow-none">Internship <br /><span className="text-white underline">Shield.</span></h1>
            <p className="text-xl text-black font-black max-w-lg leading-relaxed italic underline decoration-white/30 drop-shadow-none">3-Month Professional Weaponization. We bridge the gap between your degree and the global boardroom.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-2">
              <div className="text-[10px] font-black text-black/50 uppercase tracking-widest">Entry Fee</div>
              <div className="text-5xl lg:text-6xl font-black text-black italic leading-none">{formatPrice(105)}</div>
            </div>
            <div className="space-y-2 border-l border-black/10 pl-8 lg:pl-12">
              <div className="text-[10px] font-black text-black/50 uppercase tracking-widest">Global Ops</div>
              <div className="text-2xl lg:text-3xl font-black text-white uppercase italic tracking-tighter">EU Network</div>
            </div>
          </div>

          <button 
            onClick={() => setPage('contact')}
            className="geometric-button-primary w-full !py-8 text-xl shadow-2xl shadow-black/20 !rounded-3xl bg-black border-black text-white hover:bg-black/90"
          >
            Secure Your Career Hub
          </button>
        </div>
      </div>
    </section>

    <section className="bg-black/10 backdrop-blur-sm py-20 px-6 lg:px-20 border-y border-white/5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <h2 className="text-6xl text-white leading-tight italic uppercase tracking-tighter underline decoration-accent/20">The Career <br /> Infrastructure</h2>
          <p className="text-white/80 text-lg font-medium leading-relaxed italic">Most students use a local strategy for a global market. We build your global profile and inject you directly into corporate hiring loops.</p>
          <div className="flex flex-wrap gap-4 pt-4">
            {['CV Weaponization', 'Mock Drills', 'LinkedIn Audit', 'Visa Protocols'].map(tag => (
              <span key={tag} className="px-6 py-3 border border-white/10 bg-black/30 rounded-full text-[10px] font-black text-white uppercase tracking-widest">{tag}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[
            { n: '01', t: 'Asset Polish', d: 'Transformation of your academic history into a corporate weapon.' },
            { n: '02', t: 'Direct Channels', d: 'Activation of our network of recruiters and partners across the EU.' },
            { n: '03', t: 'Boardroom Prep', d: 'Intensive interview training for high-impact negotiations.' }
          ].map((step, i) => (
            <div key={i} className="p-10 border border-white/5 bg-black/40 backdrop-blur-md rounded-[3rem] hover:border-accent/40 transition-all group relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-0 group-hover:opacity-10 rounded-full -mr-16 -mt-16 transition-opacity" />
              <div className="text-5xl font-black text-accent italic mb-4 opacity-30 group-hover:opacity-100 transition-opacity leading-none">{step.n}</div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">{step.t}</h4>
              <p className="text-white/70 text-sm font-medium leading-relaxed italic">{step.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const CatalogView = ({ setPage }: { setPage: (p: PageId, id?: string) => void }) => (
  <div className="bg-purple-300 pt-[160px] pb-20 px-6 lg:px-20 min-h-screen">
    <div className="max-w-7xl mx-auto space-y-24">
      <div className="space-y-8 max-w-4xl">
        <div className="geometric-badge bg-black text-white">Deployment Ready</div>
        <h1 className="text-7xl md:text-[9rem] leading-[0.8] italic uppercase text-black drop-shadow-none">Subject <br /><span className="text-white underline">Catalog.</span></h1>
        <p className="text-xl text-black font-black italic underline decoration-white/30 drop-shadow-none">Module-specific rescue operations. Don't let one technical failure jeopardize your entire degree.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SUBJECTS.map((s, idx) => (
          <motion.div 
            key={s.id}
            whileHover={{ y: -12 }}
            className="geometric-card p-12 space-y-12 flex flex-col justify-between cursor-pointer group !bg-black/40 backdrop-blur-md"
            onClick={() => setPage('subject-detail', s.id)}
          >
            <div className="space-y-6">
              <div className="text-[10px] font-black text-accent uppercase tracking-widest">Module Cluster {idx + 1}</div>
              <h3 className="text-4xl italic leading-none group-hover:text-accent transition-colors text-white">{s.name}</h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed italic">{s.description}</p>
            </div>
            <div className="flex items-center justify-between pt-8 border-t border-white/10">
              <div className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-accent transition-colors flex items-center gap-3">
                Initialize Support <ArrowRight size={16} />
              </div>
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all text-white">
                <Plus size={20} className="rotate-45" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const SubjectDetailView = ({ subjectId, setPage, formatPrice }: { subjectId: string, setPage: (p: PageId, id?: string) => void, formatPrice: (b: number) => string }) => {
  const subject = SUBJECTS.find(s => s.id === subjectId) || SUBJECTS[0];
  
  return (
    <div className="bg-transparent pt-[160px] pb-20 px-6 lg:px-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        <div className="space-y-12 max-w-5xl">
          <button 
            onClick={() => setPage('subject-catalog')}
            className="text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-4 group"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
              <ArrowRight className="rotate-180" size={14} />
            </div>
            Protocol Return: Inventory
          </button>
          <h1 className="text-5xl sm:text-7xl md:text-[10rem] italic leading-[0.7] uppercase underline decoration-accent/10 tracking-tighter text-white drop-shadow-2xl">{subject.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            className="geometric-card-featured p-10 lg:p-16 space-y-12 flex flex-col justify-between border-4 lg:border-8 border-accent shadow-3xl !bg-black/60 backdrop-blur-xl !text-white"
          >
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <div className="geometric-badge bg-accent">Rescue Protocol</div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-accent uppercase tracking-widest">Priority</div>
                  <div className="text-xl font-black italic text-white uppercase tracking-tighter">Immediate Ops</div>
                </div>
              </div>
              <h3 className="text-5xl italic leading-none tracking-tighter uppercase text-white drop-shadow-xl">Rescue <br />Package</h3>
              <p className="text-lg text-white font-medium leading-relaxed italic drop-shadow-md">For emergency grade recovery and immediate exam readiness. High intensity, high results.</p>
              <ul className="space-y-6">
                {['Portfolio Logical Audit', 'Customized Logic Roadmaps', '1:1 Technical Sessions (60m)', 'Emergency Revision Window'].map(t => (
                  <li key={t} className="flex items-center gap-6 text-sm font-black uppercase tracking-tight text-white italic">
                    <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                      <Check size={14} />
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-12 border-t border-white/10">
              <div className="text-7xl font-black text-white italic tracking-tighter">{formatPrice(21)}</div>
              <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-2">Per Session / Full Asset Delivery</div>
              <button 
                onClick={() => setPage('contact')}
                className="geometric-button-primary w-full mt-12 !py-8 text-xl shadow-2xl shadow-accent/20 italic !rounded-[2rem] !bg-white !text-primary border-none"
              >
                Initialize Rescue
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -10 }}
            className="geometric-card p-10 lg:p-16 space-y-12 flex flex-col justify-between group !bg-black/40 backdrop-blur-md"
          >
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <div className="geometric-badge bg-white/10 !text-white">Oversight Hub</div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Duration</div>
                  <div className="text-xl font-black italic text-white uppercase tracking-tighter">Lifecycle</div>
                </div>
              </div>
              <h3 className="text-5xl italic leading-none text-white tracking-tighter uppercase drop-shadow-xl">Support <br />Hub</h3>
              <p className="text-lg text-white font-medium leading-relaxed italic drop-shadow-md">Strategic academic oversight for the entire semester. Consistent, reliable, elite.</p>
              <ul className="space-y-6">
                {['Weekly Strategic Check-ins', 'Resource Distribution Network', 'Live Q&A (Unlimited)', 'One-on-one technical, three sessions, 60 minutes', 'Career Alignment Ops'].map(t => (
                  <li key={t} className="flex items-center gap-6 text-sm font-black uppercase tracking-tight text-white italic">
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-accent">
                      <Check size={14} />
                    </div>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-12 border-t border-white/10">
              <div className="text-7xl font-black text-white italic tracking-tighter">{formatPrice(42)}</div>
              <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-2">Monthly Retainer / Total Oversight</div>
              <button 
                onClick={() => setPage('contact')}
                className="geometric-button-secondary w-full mt-12 !py-8 text-xl italic !rounded-[2rem] border-white/20 !text-white hover:!bg-white hover:!text-primary transition-all"
              >
                Activate Pipeline
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tactical Briefing Video Asset */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3rem] lg:rounded-[4rem] overflow-hidden border-4 border-white/5 shadow-3xl aspect-[21/9] group bg-black"
        >
          <video 
            src="https://degreegate.com/wp-content/uploads/2026/04/ggg.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-contain grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 space-y-4">
            <div className="geometric-badge bg-accent text-white">Live Asset: Subject Intelligence</div>
            <h4 className="text-4xl font-black italic text-white uppercase tracking-tighter">Strategic Thesis <br /> Visualization</h4>
          </div>
          <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
            <Zap size={24} className="fill-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ExpertAdviceView = ({ formatPrice }: { formatPrice: (b: number) => string }) => (
  <div className="bg-yellow-400 pt-[160px] pb-20 px-6 lg:px-20 overflow-hidden relative min-h-screen">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/[0.03] font-black text-[30vw] leading-none pointer-events-none uppercase italic select-none">
      Elite
    </div>
    <div className="max-w-7xl mx-auto space-y-24 relative z-10">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="geometric-badge mx-auto bg-black text-white">Direct Intel Channel</div>
        <h1 className="text-6xl sm:text-7xl md:text-9xl leading-[0.8] italic uppercase text-black tracking-tighter drop-shadow-none">Expert <br /><span className="text-white underline decoration-4 underline-offset-[12px]">Advice.</span></h1>
        <p className="text-xl text-black font-black italic underline decoration-white/30 leading-relaxed drop-shadow-none">30 minutes of brutal, strategic honesty. The information the university doesn't want you to have.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <motion.div 
          whileHover={{ y: -20, perspective: 1000, rotateY: 5 }}
          className="geometric-card p-1 flex flex-col justify-between group shadow-xl border-none overflow-hidden rounded-[3rem] lg:rounded-[4rem] !bg-black/40 backdrop-blur-md"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-black">
            <video 
              src="https://degreegate.com/wp-content/uploads/2026/04/kkk.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-contain transition-transform duration-[2000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
            <div className="absolute bottom-8 right-8">
               <div className="text-5xl font-black text-white italic bg-accent px-10 py-4 rounded-[2rem] shadow-2xl">{formatPrice(4.5)}</div>
            </div>
          </div>
          <div className="p-10 lg:p-16 space-y-8">
            <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all border border-accent/10">
              <Globe size={40} />
            </div>
            <h2 className="text-4xl text-white italic uppercase tracking-tighter">Inside Europe</h2>
            <p className="text-lg text-white/70 font-medium leading-relaxed italic">For students already in the EU. Disputes, legal aid, or aggressive career pivots. Support in university regulations.</p>
            <button className="geometric-button-primary w-full !py-8 text-xl !rounded-[2rem] shadow-2xl shadow-accent/20 italic mt-8">Initialize Local Ops</button>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -20, perspective: 1000, rotateY: -5 }}
          className="geometric-card p-1 flex flex-col justify-between group border-2 border-white/5 shadow-xl relative overflow-hidden rounded-[3rem] lg:rounded-[4rem] !bg-black/40 backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative aspect-[3/4] overflow-hidden bg-black">
            <video 
              src="https://degreegate.com/wp-content/uploads/2026/04/ggg.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-contain transition-transform duration-[2000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
            <div className="absolute bottom-8 right-8">
               <div className="text-5xl font-black text-white italic bg-black/40 border border-white/10 backdrop-blur-xl px-10 py-4 rounded-[2rem] shadow-2xl group-hover:bg-accent group-hover:text-white transition-all">€5.00</div>
            </div>
          </div>
          <div className="p-10 lg:p-16 space-y-8 relative z-10">
            <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all border border-accent/10">
              <ExternalLink size={40} />
            </div>
            <h2 className="text-4xl text-white italic uppercase tracking-tighter">Outside Europe</h2>
            <p className="text-lg text-white/70 font-medium leading-relaxed italic">Thinking of migrating? Get the unfiltered truth from professionals living the reality. Don't buy a dream, buy a plan.</p>
            <button className="geometric-button-secondary w-full !py-8 text-xl !rounded-[2rem] border-white/10 italic mt-8 !text-white hover:!bg-white hover:!text-primary transition-all">Initialize Global Intel</button>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const DegreeGatewayView = () => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    country: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/gateway-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        throw new Error(data.error || 'Failed to request access.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const benefits = [
    { title: "Free webinars on real student challenges", icon: Tv, color: "bg-blue-500" },
    { title: "Live Q&A with expert mentors", icon: Users, color: "bg-emerald-500" },
    { title: "Early access to DegreeGate resources", icon: Zap, color: "bg-amber-500" },
    { title: "First access to new programs and offers", icon: Star, color: "bg-rose-500" },
  ];

  const steps = [
    { n: "01", t: "Apply below in 30 seconds" },
    { n: "02", t: "Receive exclusive session invites to your inbox" },
    { n: "03", t: "Grow with the community as Gateway evolves" },
  ];

  return (
    <div className="bg-[#f8f9ff] pt-[100px] sm:pt-[140px] pb-20 sm:pb-32 px-4 sm:px-6 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-32">
        {/* Hero Section */}
        <div className="text-center space-y-4 sm:space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 rounded-full bg-black text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] italic text-center"
          >
            PROTOCOL: GATEWAY
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-black leading-[0.95] sm:leading-[0.85]"
          >
            Your Access to the <br /> <span className="text-accent underline decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8">DegreeGate Inner Circle.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl text-black/60 font-medium italic max-w-2xl mx-auto leading-relaxed"
          >
            An exclusive community for international students in Europe. Join the first wave.
          </motion.p>
        </div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-5 sm:p-8 bg-white border border-black/5 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] transition-all group"
            >
              <div className={`w-10 h-10 sm:w-14 sm:h-14 ${b.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6`}>
                <b.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-lg font-black italic uppercase tracking-tight leading-tight text-black">{b.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-24 items-start">
          <div className="space-y-8 sm:space-y-16">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 justify-start">
                <Star className="text-accent fill-accent" size={24} />
                <h2 className="text-3xl sm:text-7xl font-black italic uppercase tracking-tighter text-black">How It Works.</h2>
              </div>
              <div className="w-16 sm:w-32 h-1.5 sm:h-2.5 bg-black rounded-full" />
            </div>
            <div className="space-y-8 sm:space-y-12">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4 sm:gap-10 group items-start">
                  <div className="text-4xl sm:text-6xl font-black text-black/5 group-hover:text-accent/20 transition-colors italic leading-none">{s.n}</div>
                  <div className="pt-0.5 sm:pt-2">
                    <p className="text-lg sm:text-2xl font-black italic text-black leading-tight uppercase tracking-tight max-w-sm">{s.t}</p>
                  </div>
                </div>
              ))}
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 sm:px-10 sm:py-6 bg-black text-white font-black italic uppercase tracking-widest text-[10px] sm:text-sm rounded-2xl shadow-xl hover:bg-slate-900 transition-all border-b-4 border-accent"
              >
                <Star size={16} className="fill-accent text-accent" />
                Begin Application Now
              </motion.button>
            </div>
          </div>

          {/* Signup Form */}
          <div id="signup-form" className="p-6 sm:p-10 lg:p-16 bg-black rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-10 sm:py-20"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-500/20">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tighter">{message}</h3>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-accent underline font-black uppercase text-[10px] sm:text-xs tracking-widest italic"
                >
                  Apply another contact
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic ml-4">First Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ENTER"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/10 font-bold italic uppercase text-sm"
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic ml-4">Last Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ENTER"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/10 font-bold italic uppercase text-sm"
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic ml-4">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@university.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/10 font-bold italic uppercase text-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic ml-4">University Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ENTER UNIVERSITY"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/10 font-bold italic uppercase text-sm"
                    value={formData.university}
                    onChange={e => setFormData({...formData, university: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic ml-4">Country</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ENTER COUNTRY"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/10 font-bold italic uppercase text-sm"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    disabled={status === 'loading'}
                    className="w-full bg-accent hover:bg-accent-light text-black font-black py-6 rounded-2xl transition-all uppercase tracking-widest italic text-sm relative overflow-hidden group disabled:opacity-50"
                  >
                    {status === 'loading' ? 'ENCRYPTING DATA...' : 'REQUEST ACCESS'}
                  </button>
                  <p className="text-[10px] text-white/30 text-center mt-6 uppercase tracking-widest italic font-bold">Once you join you will receive all updates and invites directly to your inbox.</p>
                </div>
                {status === 'error' && (
                  <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest italic mt-4">{message}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutView = () => (
  <div className="bg-yellow-400 pt-[160px] pb-20 px-6 lg:px-20 min-h-screen relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[80vw] lg:w-[40vw] h-full bg-black/5 border-l border-black/5 z-0 backdrop-blur-sm" />
    <div className="max-w-7xl mx-auto space-y-32 relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="geometric-badge bg-black text-white">Operational History</div>
            <h1 className="text-6xl sm:text-7xl md:text-[108px] leading-[0.7] italic uppercase tracking-tighter text-black drop-shadow-none">The <br /><span className="text-white underline decoration-8 text-[99px]">DegreeGate</span><br /> Narrative.</h1>
            <p className="text-xl md:text-2xl italic font-black max-w-lg border-l-[12px] border-black pl-10 text-black drop-shadow-none">We didn't start as a business. We started as students who realized the system was built to be broken, and then we mastered the cracks.</p>
          </div>
          <div className="space-y-8 text-black/80 text-sm leading-relaxed font-black max-w-xl italic">
             <p>Founded by graduates who navigated the complex academic landscape of Europe, DegreeGate was born out of one simple truth: <strong className="text-black italic drop-shadow-none">Traditional support is slow, expensive, and fundamentally out of touch with high-impact reality.</strong></p>
             <p>Our mentors aren't just academics. They are mercenaries of the corporate world who have scaled their own careers into global powerhouses like Amazon, Google, and beyond. We don't just teach modules; we deployment career assets.</p>
          </div>
          <button className="geometric-button-primary px-16 py-7 italic shadow-2xl shadow-black/10 !rounded-[2rem] bg-black text-white border-black hover:bg-black/90">Audit Our Sector</button>
        </div>
        <motion.div 
          whileHover={{ perspective: 1000, rotateY: 10, rotateX: 5 }}
          className="relative group perspective-1000"
        >
          <div className="absolute -inset-12 bg-accent/5 rounded-[4rem] lg:rounded-[6rem] -rotate-3 blur-2xl" />
          <div className="relative geometric-card overflow-hidden bg-black/40 border-none shadow-3xl rounded-[4rem] lg:rounded-[6rem] aspect-[4/5] p-2 backdrop-blur-md">
            <img src="https://picsum.photos/seed/operational-hq/1200/1500" className="w-full h-full object-cover rounded-[3.5rem] lg:rounded-[5.5rem] group-hover:scale-110 transition-transform duration-[3000ms]" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 lg:p-20">
              <h4 className="text-4xl text-white italic tracking-tighter uppercase mb-4">Strategic Capacity</h4>
              <p className="text-accent text-sm font-black uppercase tracking-widest">Global Operational Readiness</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="py-20 border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
        <div className="text-center mb-20">
          <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] mb-4 italic">Global Operational Footprint</div>
          <div className="w-20 h-1 bg-accent mx-auto shadow-glow" />
        </div>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 lg:gap-32 opacity-30 hover:opacity-100 transition-all duration-1000">
          {['Amazon', 'JP Morgan', 'Google', 'Deloitte', 'BMW Group', 'Apple'].map(b => (
             <div key={b} className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase">{b}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ContactView = ({ setPage }: { setPage: (p: PageId) => void }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      data.append(key, value.toString());
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-purple-300 pt-[200px] min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full geometric-card !bg-white p-12 space-y-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto text-green-600">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Message <span className="text-yellow-600">Sent.</span></h2>
          <p className="text-slate-500 font-bold italic">Thank you for contacting us. We have received your message.</p>
          <button onClick={() => setPage('home')} className="geometric-button-primary w-full !py-6 !rounded-full italic">Back to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
  <div className="bg-purple-300 pt-[160px] pb-20 px-6 lg:px-20 min-h-screen relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.05),transparent)]" />
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
        <div className="space-y-16">
          <div className="space-y-8">
            <div className="geometric-badge bg-black text-white">Direct Channel</div>
            <h1 className="text-6xl sm:text-7xl md:text-[85px] text-black tracking-tighter leading-[0.8] italic uppercase underline decoration-white/30">Contact <br /><span className="text-white">Support.</span></h1>
            <p className="text-xl text-black font-black italic underline decoration-white/20 leading-relaxed">Get in touch with us. We are here to help you with your academic and career queries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[
              { label: 'Priority Support', value: '24/7 Global Response', icon: <ShieldCheck /> },
              { label: 'Asset Support', value: <span className="text-base not-italic underline">help@degreegate.com</span>, icon: <GraduationCap /> },
            ].map((item, i) => (
              <div key={i} className="space-y-4 group cursor-pointer text-black">
                <div className="flex items-center gap-4 text-black">
                  <div className="w-12 h-12 bg-black/5 border border-black/10 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-xl">{item.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50">{item.label}</span>
                </div>
                <div className="font-black text-xl lg:text-2xl italic tracking-tight uppercase">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="pt-16 border-t border-accent/10">
            <div className="flex gap-8">
              <button 
                onClick={() => setPage('privacy')}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-accent transition-all"
              >
                [Privacy Policy]
              </button>
              <button 
                onClick={() => setPage('terms')}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-accent transition-all"
              >
                [Terms of Service]
              </button>
              <button 
                onClick={() => setPage('blog')}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-accent transition-all"
              >
                [Intelligence Blog]
              </button>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="geometric-card p-10 lg:p-20 !bg-black/40 backdrop-blur-md space-y-12 shadow-3xl rounded-[3rem] lg:rounded-[5rem] border-white/10"
        >
          <div className="space-y-4">
            <h3 className="text-5xl italic tracking-tighter text-white uppercase leading-none">Contact <br /> Us</h3>
            <p className="text-white/70 font-medium italic">Please fill out the form below to get in touch with us.</p>
          </div>
          <form 
            onSubmit={handleSubmit}
            className="space-y-10" 
          >
            <input type="hidden" name="form-name" value="contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic text-left block">First Name</label>
                <input name="first_name" type="text" required placeholder="Enter your first name" className="w-full bg-black/40 border border-white/10 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/20 italic" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic text-left block">Last Name</label>
                <input name="last_name" type="text" required placeholder="Enter your last name" className="w-full bg-black/40 border border-white/10 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/20 italic" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic text-left block">Email Address</label>
                <input name="email" type="email" required placeholder="Enter your email" className="w-full bg-black/40 border border-white/10 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/20 italic" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic">Subject</label>
                <input name="subject" type="text" required placeholder="Subject of message" className="w-full bg-black/40 border border-white/10 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/20 italic" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6 italic">Message</label>
              <textarea name="message" required placeholder="Your message..." rows={4} className="w-full bg-black/40 border border-white/10 rounded-[40px] px-10 py-8 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all resize-none placeholder:text-white/20 italic" />
            </div>
            
            {status === 'error' && (
              <p className="text-red-500 text-[10px] font-black uppercase italic text-center">Something went wrong. Please try again.</p>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="geometric-button-primary w-full !py-8 text-xl italic shadow-2xl shadow-accent/20 !rounded-[2.5rem] disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  </div>
  );
};


const BlogView = ({ posts, setPage }: { posts: BlogPost[], setPage: (p: PageId, id?: string) => void }) => (
  <div className="bg-slate-50 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen relative overflow-hidden">
    <div className="max-w-7xl mx-auto space-y-20 relative z-10">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="geometric-badge mx-auto bg-black text-white">Intelligence Pipeline</div>
        <h1 className="text-6xl md:text-8xl font-black italic uppercase text-slate-900 tracking-tighter">Strategic <br /><span className="text-yellow-500 underline">Intel.</span></h1>
        <p className="text-xl text-slate-500 font-bold italic border-x border-slate-200 px-10">Operational briefings, system updates, and academic extraction tactics.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map(post => (
          <div 
            key={post.slug} 
            onClick={() => setPage('blog-post', post.slug)}
            className="geometric-card bg-white border-slate-200 p-10 space-y-8 group hover:border-yellow-400 transition-all shadow-sm cursor-pointer"
          >
            <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-100">
               <img src={post.featured_image || 'https://picsum.photos/seed/degreegate/800/600'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{new Date(post.date).toLocaleDateString()}</div>
              <h3 className="text-2xl font-black text-slate-900 italic uppercase leading-tight group-hover:text-yellow-600 transition-colors">{post.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic line-clamp-3">{post.description}</p>
            </div>
            <button className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors flex items-center gap-3">
              Decrypt Full Story <ArrowRight size={14} />
            </button>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="text-slate-300 italic font-black text-xl uppercase tracking-widest">Signal Awaiting Data...</div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const BlogPostView = ({ post, setPage }: { post: BlogPost, setPage: (p: PageId) => void }) => (
  <div className="bg-slate-50 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen">
    <div className="max-w-4xl mx-auto space-y-16">
      <button 
        onClick={() => setPage('blog')}
        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-black transition-colors flex items-center gap-4"
      >
        <ArrowRight className="rotate-180" size={14} /> Back to Intel Pipeline
      </button>

      <div className="space-y-8 text-center md:text-left">
        <div className="geometric-badge bg-black text-white">{new Date(post.date).toLocaleDateString()}</div>
        <h1 className="text-6xl md:text-8xl font-black italic uppercase text-slate-900 tracking-tighter leading-none">{post.title}</h1>
        <p className="text-xl text-slate-500 font-bold italic border-l-8 border-yellow-400 pl-8">{post.description}</p>
      </div>

      <div className="aspect-video rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl">
        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>

      <div className="prose prose-slate max-w-none prose-headings:uppercase prose-headings:italic prose-headings:font-black prose-p:italic prose-p:font-medium prose-p:text-slate-700">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
    </div>
  </div>
);

const PrivacyView = () => (
  <div className="bg-slate-50 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen">
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="space-y-6">
        <div className="geometric-badge bg-black text-white">Security Protocol</div>
        <h1 className="text-6xl font-black italic uppercase text-slate-900 tracking-tighter">Privacy <span className="text-yellow-500">Shield.</span></h1>
      </div>
      <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium italic">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">01. Signal Encryption</h2>
          <p>We respect your tactical data. All intelligence signals sent via DegreeGate are encrypted using enterprise-grade protocols. Your personal academic footprint is treated with the highest level of security.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">02. Data Extraction</h2>
          <p>We only collect the minimum intelligence necessary to facilitate your academic protection. This includes your contact vectors and university sector details.</p>
        </section>
        <div className="p-8 bg-slate-100 rounded-3xl border border-slate-200">
          <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-2">Update status</p>
          <p className="text-lg font-black text-slate-900 italic uppercase tracking-tighter">Current Revision: April 2026</p>
        </div>
      </div>
    </div>
  </div>
);

const TermsView = () => (
  <div className="bg-slate-50 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen">
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="space-y-6">
        <div className="geometric-badge bg-black text-white">Engagement Protocol</div>
        <h1 className="text-6xl font-black italic uppercase text-slate-900 tracking-tighter">Terms of <span className="text-yellow-500">Service.</span></h1>
      </div>
      <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium italic">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">01. Service Deployment</h2>
          <p>By initializing a signal with DegreeGate, you agree to our engagement protocols. Our shields are architectural in nature; we provide tactical guidance, not academic dishonesty.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">02. Operational Limits</h2>
          <p>DegreeGate is an intelligence network. We do not guarantee specific outcomes but provide the highest level of strategic preparation possible under current global university regulations.</p>
        </section>
      </div>
    </div>
  </div>
);

const AdminPortal = ({ posts, setPage }: { posts: BlogPost[], setPage: (p: PageId, id?: string) => void }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(localStorage.getItem('dg_admin_token'));
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('dg_admin_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    featured_image: '',
    description: '',
    body: ''
  });

  // Auto-login check on mount
  useEffect(() => {
    if (localStorage.getItem('dg_admin_token')) {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('dg_admin_token', data.token);
        setSessionToken(data.token);
        
        // Tactical: Background Firebase sign-in to satisfy Firestore security rules
        try {
          await signInAnonymously(auth);
        } catch (authError) {
          console.error('Tactical Auth Failed:', authError);
        }

        setIsAdmin(true);
        setPassword('');
      } else {
        setError(data.error || 'ACCESS DENIED.');
      }
    } catch (e) {
      console.error('Auth Signal Failure:', e);
      setError('Communication link severed. Check server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dg_admin_token');
    setSessionToken(null);
    setIsAdmin(false);
    setError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = newPost.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'briefing-' + Date.now();
      await addDoc(collection(db, 'blog_posts'), {
        ...newPost,
        slug,
        authorId: 'admin',
        createdAt: Timestamp.now()
      });
      setIsCreating(false);
      setNewPost({ title: '', date: new Date().toISOString().split('T')[0], featured_image: '', description: '', body: '' });
    } catch (e) {
      console.error('Extraction Failure:', e);
      alert('SIGNAL COLLISION: Could not deploy intelligence.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('PERMANENT DATA ERASURE: Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (e) {
      console.error('Deletion Failure:', e);
    }
  };

  const downloadLogo = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.clearRect(0, 0, 1024, 1024);
    
    // Create the rotated square
    ctx.save();
    ctx.translate(512, 512);
    ctx.rotate(12 * Math.PI / 180);
    ctx.fillStyle = '#FACC15'; 
    
    const size = 720;
    const radius = 160;
    ctx.beginPath();
    ctx.roundRect(-size/2, -size/2, size, size, radius);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(512, 512);
    ctx.scale(18, 18);
    ctx.fillStyle = '#000000';
    
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(20, 0);
    ctx.lineTo(0, 10);
    ctx.lineTo(-20, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-12, 5);
    ctx.lineTo(-12, 10);
    ctx.quadraticCurveTo(0, 15, 12, 10);
    ctx.lineTo(12, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(20, 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(512, 512);
    ctx.translate(220, -220);
    ctx.scale(8, 8);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, 25);
    ctx.lineTo(5, 25);
    ctx.lineTo(-10, 50);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const link = document.createElement('a');
    link.download = 'degreegate_logo_tactical.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading) return (
    <div className="pt-[200px] flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-yellow-400" size={48} />
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="bg-black pt-[200px] min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full geometric-card !bg-white/5 border-white/10 p-12 space-y-10 backdrop-blur-xl"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto rotate-12 shadow-2xl">
              <ShieldCheck size={32} className="text-black" />
            </div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Command <span className="text-yellow-400">Lock.</span></h2>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Encrypted Administrative Gateway</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-4">Access Secret</label>
              <input 
                required
                type="password"
                placeholder="ENTER PASSPHRASE"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm font-bold text-white focus:border-yellow-400 outline-none transition-all italic"
              />
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase italic p-3 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="geometric-button-primary w-full !py-6 !rounded-full italic bg-yellow-400 text-black hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              Authorize Session
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b-4 border-black pb-12">
          <div>
            <div className="geometric-badge bg-black text-white">Active Tactical Session</div>
            <h1 className="text-6xl font-black italic uppercase text-slate-900 tracking-tighter mt-4">Intel. <span className="text-yellow-500">Dashboard.</span></h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={downloadLogo}
              className="geometric-nav-link text-slate-400 hover:text-black !p-0 mr-4 flex items-center gap-2"
            >
              <Download size={14} /> Export PNG
            </button>
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className="geometric-button-primary !py-4 !px-10 text-xs !rounded-full flex items-center gap-3"
            >
              {isCreating ? <X size={16} /> : <Plus size={16} />}
              {isCreating ? 'Abort Operation' : 'Launch New Intel'}
            </button>
            <button 
              onClick={handleLogout}
              className="geometric-nav-link text-slate-400 hover:text-red-600 !p-0"
            >
              Term. Session
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleCreate} className="geometric-card bg-white border-slate-200 p-12 space-y-8 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Intel Title</label>
                    <input 
                      required
                      placeholder="Title of briefing..."
                      value={newPost.title}
                      onChange={e => setNewPost({...newPost, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mission Date</label>
                    <input 
                      type="date"
                      required
                      value={newPost.date}
                      onChange={e => setNewPost({...newPost, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Featured Image Vector (URL)</label>
                  <input 
                    placeholder="https://images.unsplash.com/..."
                    value={newPost.featured_image}
                    onChange={e => setNewPost({...newPost, featured_image: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Signal Abstract (Short Description)</label>
                  <textarea 
                    rows={2}
                    value={newPost.description}
                    onChange={e => setNewPost({...newPost, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all italic resize-none"
                    placeholder="Briefly describe the intel payload..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Briefing Payload (Markdown / Content)</label>
                  <textarea 
                    rows={10}
                    required
                    value={newPost.body}
                    onChange={e => setNewPost({...newPost, body: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all italic resize-none"
                    placeholder="# Writing intel... Use markdown standard."
                  />
                </div>
                <div className="flex justify-end gap-4">
                   <button type="submit" disabled={loading} className="geometric-button-primary !px-16 !py-6 !rounded-full !bg-black !text-white hover:!bg-yellow-400 hover:!text-black transition-all shadow-2xl">
                      {loading ? 'Encrypting...' : 'Publish Extraction'}
                   </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-400">Deployed Intelligence Index</h3>
          <div className="grid gap-4">
            {posts.map(post => (
              <div key={post.id} className="geometric-card bg-white border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-black transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                    <img src={post.featured_image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black italic uppercase text-slate-900 leading-none">{post.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">{new Date(post.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-8 items-center">
                  <button 
                    onClick={() => setPage('blog-post', post.slug)}
                    className="text-[10px] font-black text-yellow-600 uppercase tracking-widest hover:text-black transition-colors italic"
                  >
                    View on Site
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id!)}
                    className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-red-500 transition-colors italic"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <div className="p-20 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-200 rounded-[2rem]">No intelligence deployed in this sector.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main App ---

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activePostSlug, setActivePostSlug] = useState<string | null>(null);

  // Currency Logic
  const [currency, setCurrency] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({ EUR: 1 });
  const supportedCurrencies = useMemo(() => ['PLN', 'EUR', 'GBP', 'USD', 'INR', 'UAR', 'SEK', 'NOK', 'CZK', 'HUF'], []);

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        // 1. Detect currency by IP
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        const detectedCurrency = ipData.currency?.toUpperCase();
        
        if (detectedCurrency && supportedCurrencies.includes(detectedCurrency)) {
          setCurrency(detectedCurrency);
        } else {
          setCurrency('EUR');
        }

        // 2. Fetch exchange rates (from EUR base)
        const ratesResponse = await fetch('https://open.er-api.com/v6/latest/EUR');
        const ratesData = await ratesResponse.json();
        if (ratesData && ratesData.rates) {
          setRates(ratesData.rates);
        }
      } catch (error) {
        console.error('Failed to fetch currency/rates:', error);
      }
    };
    fetchCurrencyData();
  }, [supportedCurrencies]);

  const formatPrice = (eurBase: number) => {
    const rate = rates[currency] || 1;
    const converted = eurBase * rate;
    
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency === 'UAR' ? 'AED' : currency,
      maximumFractionDigits: 0
    }).format(converted).replace('AED', 'UAR');
  };

  useEffect(() => {
    // Firebase Intelligence Subscription
    const q = query(collection(db, 'blog_posts'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(p);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isBooting) {
      window.scrollTo(0, 0);
    }
  }, [currentPage, activeSubjectId, activePostSlug, isBooting]);

  const setView = (page: PageId, id?: string) => {
    setCurrentPage(page);
    if (page === 'subject-detail') setActiveSubjectId(id || null);
    if (page === 'blog-post') setActivePostSlug(id || null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return <HomeView setPage={setView} formatPrice={formatPrice} />;
      case 'thesis-shield': return <ThesisShieldView setPage={setView} formatPrice={formatPrice} />;
      case 'internship-shield': return <InternshipShieldView setPage={setView} formatPrice={formatPrice} />;
      case 'subject-catalog': return <CatalogView setPage={setView} />;
      case 'subject-detail': return <SubjectDetailView subjectId={activeSubjectId!} setPage={setView} formatPrice={formatPrice} />;
      case 'expert-advice': return <ExpertAdviceView formatPrice={formatPrice} />;
      case 'degree-gateway': return <DegreeGatewayView />;
      case 'about': return <AboutView />;
      case 'contact': return <ContactView setPage={setView} />;
      case 'blog': return <BlogView posts={posts} setPage={setView} />;
      case 'blog-post': {
        const post = posts.find(p => p.slug === activePostSlug);
        return post ? <BlogPostView post={post} setPage={setView} /> : <BlogView posts={posts} setPage={setView} />;
      }
      case 'admin': return <AdminPortal posts={posts} setPage={setView} />;
      case 'privacy': return <PrivacyView />;
      case 'terms': return <TermsView />;
      default: return <HomeView setPage={setView} formatPrice={formatPrice} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isBooting && (
          <TacticalLoader key="boot-loader" onComplete={() => setIsBooting(false)} />
        )}
      </AnimatePresence>

      <div className="geometric-container">
      <Navbar activePage={currentPage} setPage={setView} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (activeSubjectId || '')}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-50 text-slate-900 py-24 px-6 md:px-10 mt-32 border-t-[10px] border-yellow-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200 rounded-full blur-[100px] -ml-48 -mb-48 opacity-30" />
        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setView('home')}
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-xl rotate-12 flex items-center justify-center group-hover:rotate-0 transition-transform duration-500 shadow-md shadow-yellow-400/20 shrink-0">
                  <div className="relative">
                    <GraduationCap size={24} className="text-black" />
                    <Zap size={12} className="text-black absolute -top-1.5 -right-1.5 fill-black" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="font-display text-xl lg:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    DegreeGate<span className="text-yellow-500 font-black">°</span>
                  </div>
                  <div className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Tactical Strategy Hub</div>
                </div>
              </div>
              <p className="text-slate-500 text-[11px] font-medium leading-relaxed max-w-xs italic uppercase tracking-tighter">
                Tactical academic and career protection for high-impact students. We audit the system so you don't have to.
              </p>
            </div>
            
            <div className="space-y-5">
              <h4 className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em] border-b border-slate-200 pb-2">Operational Sectors</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setView('thesis-shield')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Thesis Shield</button></li>
                <li><button onClick={() => setView('internship-shield')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Internship Pipeline</button></li>
                <li><button onClick={() => setView('subject-catalog')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Subject Catalog</button></li>
                <li><button onClick={() => setView('degree-gateway')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Gateway Hub</button></li>
              </ul>
            </div>
            
            <div className="space-y-5">
              <h4 className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em] border-b border-slate-200 pb-2">Direct Channels</h4>
              <ul className="space-y-3">
                <li><a href="mailto:help@degreegate.com" className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">help@degreegate.com</a></li>
                <li><button onClick={() => setView('blog')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Intelligence Blog</button></li>
                <li><button onClick={() => setView('about')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Operational History</button></li>
                <li><button onClick={() => setView('contact')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Contact Intel</button></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em] border-b border-slate-200 pb-2">Legal Access</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setView('privacy')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Privacy Policy</button></li>
                <li><button onClick={() => setView('terms')} className="text-[11px] font-bold text-slate-500 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Terms of Service</button></li>
                <li><button onClick={() => setView('admin')} className="text-[11px] font-bold text-slate-500/30 hover:text-yellow-600 transition-colors uppercase italic tracking-tighter">Admin Portal</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              © 2026 DegreeGate Intelligence Network. All Rights Reserved.
            </div>
            <div className="flex gap-8">
              {[
                { icon: <Facebook size={22} />, title: "Facebook", href: "https://www.facebook.com/degreegates?rdid=mbDxmXpoAwgbSkMB&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1863a7eXUv%2F#" },
                { icon: <X size={22} />, title: "X", href: "https://x.com/degreegates?s=21" },
                { icon: <Instagram size={22} />, title: "Instagram", href: "https://www.instagram.com/degreegate" },
                { icon: <Linkedin size={22} />, title: "LinkedIn", href: "https://pl.linkedin.com/company/degreegates" }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-yellow-500 transition-all hover:scale-110" title={social.title}>{social.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
