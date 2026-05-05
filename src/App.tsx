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
  Timestamp,
  serverTimestamp
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
  Lock,
  Cpu,
  Settings
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

interface Submission {
  id: string;
  form_name: string;
  data: any;
  status: 'unread' | 'read' | 'archived';
  createdAt: any;
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

const socials = [
  { id: "facebook", href: "https://www.facebook.com/degreegates?rdid=mbDxmXpoAwgbSkMB&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1863a7eXUv%2F#" },
  { id: "x", href: "https://x.com/degreegates?s=21" },
  { id: "instagram", href: "https://www.instagram.com/degreegates" },
  { id: "linkedin", href: "https://pl.linkedin.com/company/degreegates" }
];

const STICKERS = ["SYSTEMS", "CLARITY", "CONSISTENCY", "PROTECTION"];

// --- Components ---

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Who is DegreeGate for exactly?",
      a: "DegreeGate is designed exclusively for international students pursuing higher education in Europe. Whether you're currently in the EU facing academic challenges or outside the EU planning your migration and study path, we provide the tactical intelligence and support infrastructure you need."
    },
    {
      q: "Is DegreeGate affiliated with universities?",
      a: "No. We are an independent intelligence and support platform. This independence allows us to provide brutal, unfiltered honesty and tactical advice that universities often cannot or will not share due to internal regulations or bureaucracy."
    },
    {
      q: "How does the 'Early Access' work?",
      a: "We are currently in a controlled beta phase (Alpha/Beta transition). Joining Early Access puts you in the Inner Circle where you receive first-wave invites to sessions, community access, and prioritized deployment of our 'Shield' services before they open to the general public."
    },
    {
      q: "What makes the 'Shield' services elite?",
      a: "Our Shield services (Thesis and Internship) are high-intensity, subscription-based programs. They are led by mentors who have already successfully scaled careers into top-tier global companies. Zero failure tolerance means we audit every logic gap and weaponize every asset to ensure outcome success."
    },
    {
      q: "Is my data and privacy protected?",
      a: "DegreeGate is built with a privacy-first approach. We use encrypted communication channels and do not share student intelligence with academic institutions or third-party advertisers. Your academic journey remains your own."
    }
  ];

  return (
    <section className="py-32 px-6 lg:px-20 bg-[#500683] relative overflow-hidden transition-all duration-700">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <div className="geometric-badge bg-accent text-white">INTELLIGENCE BRIEFING</div>
          <h2 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Frequently <br /> <span className="text-accent underline underline-offset-8">Asked Questions.</span></h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              className="border border-slate-100 dark:border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left group"
              >
                <span className={`text-xl font-black italic uppercase tracking-tight transition-colors ${openIndex === i ? 'text-accent' : 'text-slate-900 dark:text-white'}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-accent text-white rotate-180' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                   <ChevronDown size={18} />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed border-t border-slate-50 dark:border-white/5 pt-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
  <section className="py-32 px-6 lg:px-20 relative overflow-hidden bg-yellow-500 border-y border-black/10 transition-colors duration-700">
    <div className="max-w-7xl mx-auto space-y-24 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black italic uppercase leading-[1.1] max-w-4xl mx-auto text-black flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Zap className="text-black fill-current hidden md:block" size={48} />
          <span className="inline-block text-center px-4 tracking-tighter">
            “European academic pathways <span className="text-blue-700">weren’t designed</span> for you.”
          </span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
        {[
          "The invisible barriers. One missed regulation in a foreign language can cost you an entire year. Deadlines, scholarship conditions, and enrollment rules that nobody explains properly to international newcomers.",
          "Extreme isolation. Your professors are distant, and your support network is thousands of miles away. You're navigating a high-stakes migration path with incomplete information and zero safety net.",
          "The paperwork trap. You earned the opportunity, but the bureaucracy killed it. Lost internships, expired visas, and rejected applications due to minor documentation technicalities."
        ].map((problem, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="geometric-card !bg-black/95 backdrop-blur-md p-10 space-y-6 hover:scale-105 transition-transform border-none shadow-2xl flex flex-col items-center md:items-start"
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
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase text-white drop-shadow-2xl italic tracking-tighter">
          “DegreeGate changed that.”
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

const ShieldVideoBackground = ({ 
  src, 
  className = "", 
  innerClassName = "", 
  thumbnail 
}: { 
  src: string; 
  className?: string; 
  innerClassName?: string;
  thumbnail?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (!isLoaded) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev;
          const increment = (100 - prev) * 0.05;
          return prev + increment;
        });
      }, 150);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoaded]);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      {/* Tactical Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center z-10"
          >
             {thumbnail && (
               <motion.img 
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 0.3, scale: 1 }}
                 src={thumbnail} 
                 className="absolute inset-0 w-full h-full object-cover blur-sm" 
                 alt="" 
                 referrerPolicy="no-referrer"
               />
             )}
             
             {/* Scanlines/Grid Effect */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
             
             <div className="relative z-20 w-full max-w-[280px] space-y-8 px-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[11px] font-black text-accent uppercase tracking-[0.4em] animate-pulse">Initializing Sector</p>
                    <p className="text-3xl font-black italic text-white leading-none">{Math.floor(progress)}%</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-accent shadow-[0_0_20px_rgba(14,165,233,0.6)]"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-accent rounded-full animate-ping" />
                    <span>Signal: Strong</span>
                  </div>
                  <span>DegreeGate v2.4</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.video
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
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

const Navbar = ({ 
  activePage, 
  setPage, 
}: { 
  activePage: PageId, 
  setPage: (p: PageId, id?: string) => void, 
}) => {
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

  // Text color logic: Dynamic based on context
  const navTextColor = "text-white";
  const navBgColor = isOpen 
    ? 'bg-black'
    : scrolled 
      ? 'backdrop-blur-2xl bg-black/80 border-b border-white/10' 
      : 'bg-transparent';

  return (
    <header 
      className={`h-[100px] fixed top-0 left-0 right-0 transition-all duration-500 flex items-center ${
        scrolled ? 'h-[80px] shadow-2xl border-b border-black/5 dark:border-white/5' : ''
      } ${navBgColor} z-[1000]`}
    >
      <div className="max-w-[1400px] w-full mx-auto flex items-center gap-12 lg:gap-20 px-6 lg:px-12 relative z-[100001]">
        {/* LOGO SECTION - Left Aligned */}
        <div 
          className="flex items-center gap-4 cursor-pointer group flex-shrink-0"
          onClick={() => { setPage('home'); setIsOpen(false); }}
        >
          <div className="w-[47px] h-[44px] bg-yellow-400 rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-yellow-400/20 group-hover:rotate-0 transition-transform duration-500">
            <div className="relative">
              <GraduationCap size={24} className="text-black" />
              <Zap size={14} className="text-black absolute -top-2 -right-2 fill-black" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className={`font-display text-[22px] sm:text-[28px] md:text-[34px] leading-none tracking-tighter uppercase italic text-white`}>
              DegreeGate<span className="text-yellow-400">.</span>
            </div>
            <div className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em] leading-none mt-1 ${isOpen ? 'text-slate-400 dark:text-slate-500' : scrolled ? 'text-slate-400' : 'text-white/50'}`}>Intelligence Gate</div>
          </div>
        </div>

        {/* Desktop Menu - Brought closer to logo */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 ml-12 xl:ml-20">
          <button onClick={() => setPage('home')} className={`geometric-nav-link ${activePage === 'home' ? 'after:w-full' : ''} ${navTextColor}`}>Base</button>
          
          <div className="relative group/dropdown"
            onMouseEnter={() => setShieldsOpen(true)}
            onMouseLeave={() => setShieldsOpen(false)}
          >
            <button 
              className={`geometric-nav-link flex items-center gap-2 ${activePage.includes('shield') ? 'after:w-full' : ''} ${navTextColor}`}
            >
              The Shields <ChevronDown size={14} className={`transition-transform duration-300 ${shieldsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {shieldsOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute top-full left-0 pt-4 min-w-[320px] z-[120]"
                >
                  <div className="bg-black p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] rounded-[2.5rem] border border-white/10 backdrop-blur-2xl">
                    <div className="space-y-2">
                    <button 
                      onClick={() => { setPage('thesis-shield'); setShieldsOpen(false); }} 
                      className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-4 group/item"
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
                      className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-4 group/item"
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
                </div>
              </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setPage('subject-catalog')} className={`geometric-nav-link ${activePage === 'subject-catalog' ? 'after:w-full' : ''} ${navTextColor}`}>Subject Hub</button>
          <button onClick={() => setPage('expert-advice')} className={`geometric-nav-link ${activePage === 'expert-advice' ? 'after:w-full' : ''} ${navTextColor}`}>Expert Intel</button>
          <button onClick={() => setPage('degree-gateway')} className={`geometric-nav-link ${activePage === 'degree-gateway' ? 'after:w-full' : ''} ${navTextColor}`}>Gateway</button>
          <button onClick={() => setPage('blog')} className={`geometric-nav-link ${activePage === 'blog' ? 'after:w-full' : ''} ${navTextColor}`}>Blog</button>
          <button onClick={() => setPage('about')} className={`geometric-nav-link ${activePage === 'about' ? 'after:w-full' : ''} ${navTextColor}`}>About</button>
        </nav>

        {/* CTA and Mobile Toggle Area - Pushed to the right */}
        <div className="flex items-center gap-6 ml-auto">
          <button 
            onClick={() => setPage('contact')}
            className="hidden lg:block geometric-button-primary !py-4 !px-8 text-xs !rounded-full bg-black dark:bg-white !text-white dark:!text-slate-900 border-none shadow-xl hover:bg-accent dark:hover:bg-accent-light hover:!text-white transition-all whitespace-nowrap"
          >
            Contact Hub
          </button>

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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-0 right-0 bottom-0 bg-black lg:hidden z-[99998] flex flex-col items-center justify-start overflow-y-auto pt-48 border-t border-white/10 ${
              scrolled ? 'top-[80px]' : 'top-[100px]'
            }`}
          >
            <div className="flex flex-col p-10 gap-6 font-black text-white text-2xl tracking-tighter w-full max-w-sm text-center">
              <div className="mb-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center rotate-12 shadow-2xl shadow-yellow-400/20">
                   <GraduationCap size={36} className="text-black" />
                </div>
                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.8em]">Inner Circle Interface</div>
              </div>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => { setPage('home'); setIsOpen(false); }} 
                className="text-center py-5 border-y border-white/5 italic hover:text-yellow-400 transition-all uppercase tracking-tight group"
              >
                <span className="group-hover:translate-x-2 transition-transform inline-block">Base Hub</span>
              </motion.button>
              
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => { setPage('thesis-shield'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-white/5 italic hover:text-yellow-400 transition-all uppercase tracking-tight group"
              >
                <span className="group-hover:translate-x-2 transition-transform inline-block">Thesis Shield</span>
              </motion.button>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => { setPage('internship-shield'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-white/5 italic hover:text-yellow-400 transition-all uppercase tracking-tight group"
              >
                <span className="group-hover:translate-x-2 transition-transform inline-block">Internship Shield</span>
              </motion.button>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => { setPage('degree-gateway'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-white/5 italic hover:text-yellow-400 transition-all uppercase tracking-tight group"
              >
                <span className="group-hover:translate-x-2 transition-transform inline-block">The Gateway</span>
              </motion.button>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => { setPage('about'); setIsOpen(false); }} 
                className="text-center py-5 border-b border-white/5 italic hover:text-yellow-400 transition-all uppercase tracking-tight group"
              >
                <span className="group-hover:translate-x-2 transition-transform inline-block">Our Story</span>
              </motion.button>

              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => { setPage('contact'); setIsOpen(false); }} 
                className="bg-black text-white py-6 rounded-2xl mt-4 uppercase tracking-[0.2em] italic font-black shadow-2xl"
              >
                Connect Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const ValueLadder = () => {
  return (
    <section className="py-32 px-6 lg:px-20 relative min-h-screen flex items-center overflow-hidden bg-black text-white">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-40 grayscale"
        >
          <source src="https://degreegate.pl/wp-content/uploads/2026/04/caed-2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,transparent_0%,black_100%)] opacity-60 z-10" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-20 grid lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-6xl sm:text-8xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter"
            >
              <span className="text-white opacity-20 block translate-x-[-0.05em]" style={{ WebkitTextStroke: '2px white' }}>THE VALUE</span>
              <span className="text-[#a855f7] block drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">LADDER</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl font-bold italic text-white/80 max-w-xl leading-relaxed"
            >
              We take you from total confusion to boardroom excellence. Every step is a strategic advancement.
            </motion.p>
          </div>

          <div className="space-y-8 relative">
            {/* The vertical divider line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-white/10" />

            {[
              { id: '01', title: 'GATEWAY HUB', desc: 'INTELLIGENCE & COMMUNITY', price: 'Free' },
              { id: '02', title: 'SUBJECT RESCUE', desc: 'MODULE CORRECTION OPS', price: 'PLN 89' },
              { id: '03', title: 'EXPERT INTEL', desc: '30M STRATEGIC SESSION', price: 'PLN 21' },
              { id: '04', title: 'SHIELD OPS', desc: 'FULL MILESTONE ARMOR', price: 'Elite' },
            ].map((step, i) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-8">
                  <div className="text-4xl md:text-6xl font-black italic text-white/5 group-hover:text-[#a855f7] transition-colors duration-500 shrink-0">
                    {step.id}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white group-hover:translate-x-2 transition-transform duration-500">
                      {step.title}
                    </h4>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 italic">
                      {step.desc}
                    </p>
                  </div>
                </div>
                <div className="text-xl md:text-3xl font-black italic text-[#a855f7] group-hover:scale-110 transition-transform duration-500 underline decoration-white/10 underline-offset-8">
                  {step.price}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- View Components ---

const HomeView = ({ setPage, formatPrice }: { setPage: (p: PageId, id?: string) => void, formatPrice: (b: number) => string }) => {
  return (
    <div className="flex flex-col bg-transparent w-full overflow-x-hidden pt-0">
      {/* Section 0: Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-screen w-full flex flex-col items-center justify-center text-center px-6 lg:px-20 overflow-hidden pt-[180px] pb-32">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-75"
          >
            <source src="https://degreegate.pl/wp-content/uploads/2026/04/makn.mp4" type="video/mp4" />
          </video>
          {/* Bottom Gradient Fade Overlay */}
          <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(to_bottom,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 z-[1] opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto space-y-12 relative z-10"
        >
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-yellow-400 text-black font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              Early Access Platform for International Students
            </motion.div>

            <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-tight sm:leading-[0.95] text-white tracking-tighter drop-shadow-2xl uppercase italic break-words">
              DegreeGate: The <span className="text-yellow-400">Intelligence Gateway</span> for your Degree, Thesis, and Shield Protection.
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-2xl italic font-sans">
              Navigate European higher education with precision. Access subject experts in tech and business, secure your thesis shield, and master the academic gateway.
            </p>
          </div>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setPage('degree-gateway')}
              className="geometric-button-cta !py-7 !px-12 !rounded-full shadow-[0_25px_60px_rgba(255,69,0,0.4)] hover:shadow-[0_30px_70px_rgba(255,69,0,0.6)] !text-base"
            >
              ACCESS INTELLIGENCE GATEWAY <ArrowRight className="ml-3" size={20} />
            </button>
            <button 
              onClick={() => setPage('about')}
              className="px-10 py-6 border-2 border-white/20 backdrop-blur-md rounded-full text-white font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              LEARN OUR STORY
            </button>
          </div>

          <div className="pt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60">
            <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Check className="text-yellow-400" size={16} /> Built for international students
            </div>
            <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe className="text-yellow-400" size={16} /> EU-focused platform
            </div>
            <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Lock className="text-yellow-400" size={16} /> Privacy-first approach
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 1: Problem Section */}
      <ProblemSection />

      {/* Section 2: Solution Section */}
      <section className="py-24 sm:py-32 px-6 lg:px-20 relative overflow-hidden bg-[#9c183a] text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-10 sm:space-y-12">
            <div className="space-y-6">
              <div className="geometric-badge bg-yellow-400 text-black">The Solution</div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black leading-tight sm:leading-none italic uppercase tracking-tighter">Your Academic <br /><span className="text-yellow-400 underline underline-offset-8 text-4xl sm:text-6xl md:text-[61px] font-bold font-['Courier_New']">Infrastructure.</span></h2>
              <p className="text-lg sm:text-xl text-white/70 font-medium italic leading-relaxed max-w-xl">
                We don't just provide information; we build the support systems that ensure you don't just survive European academia—you master it.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { t: "Automated Gateway", d: "Dynamic route mapping through your specific university's regulations and deadlines.", i: <Zap className="text-yellow-400" /> },
                { t: "Expert In Tech & Business", d: "Direct access to experts in tech and business who have already successfully navigated the path you're on.", i: <ShieldCheck className="text-yellow-400" /> },
                { t: "Career Intel", d: "Strategic intelligence and positioning of your academic choices to maximize global employment value.", i: <Briefcase className="text-yellow-400" /> }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-8 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-yellow-400 transition-colors duration-500">
                    {item.i}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-yellow-400 transition-colors">{item.t}</h4>
                    <p className="text-white/50 text-sm font-medium italic">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-8 bg-yellow-400/10 rounded-[4rem] rotate-3 blur-3xl" />
            <div className="relative geometric-card !bg-white/5 border-white/10 p-2 overflow-hidden aspect-[4/5]">
               <ShieldVideoBackground 
                 src="https://degreegate.pl/wp-content/uploads/2026/04/ggg.mp4"
                 thumbnail="https://picsum.photos/seed/solution-vid/800/1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
                 <div className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-4">Deployment Status: READY</div>
                 <h3 className="text-4xl text-white italic font-black uppercase tracking-tighter">Gateway Active</h3>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Ladder Section */}
      <ValueLadder />

      {/* Section 3: Features (Elite Shields) */}
      <section className="bg-[#5b21b6] text-white py-32 px-6 lg:px-20 overflow-hidden relative border-b border-white/5 transition-colors duration-700">
        <div className="absolute inset-0 opacity-20 dark:opacity-5 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        <div className="max-w-7xl mx-auto w-full space-y-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-black/10 dark:border-white/10 pb-16">
            <div className="space-y-6">
              <div className="geometric-badge bg-black dark:bg-accent text-white italic tracking-[0.5em]">FEATURES</div>
              <h2 className="text-4xl sm:text-7xl md:text-8xl font-black leading-none text-slate-900 dark:text-white italic tracking-tighter">Strategic <br /> <span className="text-[#ededed] underline decoration-yellow-400">Assets.</span></h2>
            </div>
            <p className="max-w-md text-white font-bold text-lg italic border-l-4 border-white pl-6 py-2">
              Bespoke academic and professional armor. Zero failure tolerance for international careers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {[
              { 
                id: 'thesis-shield', 
                title: 'Thesis Shield', 
                price: formatPrice(131.5),
                video: 'https://degreegate.pl/wp-content/uploads/2026/04/mmkcard.mov',
                desc: 'Total milestone security for your final dissertation dissertation.',
                img: 'https://picsum.photos/seed/thesis-tactical/800/600',
                feats: ['Logic Audit', 'Source Scrape', 'Defense Drill']
              },
              { 
                id: 'internship-shield', 
                title: 'Internship Shield', 
                price: formatPrice(105), 
                video: 'https://degreegate.pl/wp-content/uploads/2026/04/caed-2.mp4',
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
                      <ShieldVideoBackground 
                        src={s.video} 
                        thumbnail={s.img}
                      />
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

      {/* Section 4: Early Access CTA */}
      <section className="py-32 px-6 lg:px-20 bg-yellow-400 relative overflow-hidden flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl w-full text-center space-y-12 relative z-10"
        >
          <div className="space-y-6">
            <div className="geometric-badge bg-black text-white">LIMITED ENROLLMENT</div>
            <h2 className="text-4xl sm:text-7xl font-black italic uppercase leading-none text-black tracking-tighter">Your Future in Europe <br /> <span className="text-blue-700 underline underline-offset-8">Starts Here.</span></h2>
            <p className="text-xl text-black font-black italic max-w-2xl mx-auto">
              Join the DegreeGate beta and get early access to our full suite of academic and career armor. Currently in Beta. 
            </p>
          </div>
          <button 
            onClick={() => setPage('degree-gateway')}
            className="geometric-button-cta !bg-black !text-white !py-6 sm:!py-8 !px-8 sm:!px-16 !text-lg sm:!text-xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all mx-auto flex items-center justify-center text-center"
          >
            <span className="flex items-center justify-center flex-wrap gap-3">
              START YOUR APPLICATION JOURNEY 
              <Zap className="fill-yellow-400 text-yellow-400 shrink-0" size={24} />
            </span>
          </button>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-[10rem] font-black text-black/[0.05] italic uppercase select-none pointer-events-none">BETA</div>
        <div className="absolute bottom-10 right-10 text-[10rem] font-black text-black/[0.05] italic uppercase select-none pointer-events-none">EARLY</div>
      </section>

      {/* Section 5: Intelligence Stats */}
      <section className="py-24 bg-black text-white overflow-hidden relative border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {[
            { l: 'System Status', v: 'ACTIVE', s: 'text-4xl sm:text-5xl lg:text-[52px]' },
            { l: 'Successful Defenses', v: '100%', s: 'text-4xl sm:text-5xl lg:text-6xl text-yellow-400' },
            { l: 'Strategic Reach', v: 'GLOBAL', s: 'text-4xl sm:text-5xl lg:text-[52px]' },
            { l: 'Operational Phase', v: 'BETA', s: 'text-4xl sm:text-5xl lg:text-[57px] text-yellow-400' }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2 border-x border-white/5">
              <div className={`${stat.s} font-display font-black italic leading-none break-words uppercase`}>{stat.v}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: FAQSection */}
      <FAQSection />

      {/* Section 7: Final Contact Hook */}
      <section className="py-24 sm:py-32 px-6 lg:px-20 bg-[#6d28d9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">
          <div className="space-y-10 flex flex-col items-center lg:items-start">
            <div className="space-y-6 text-center lg:text-left">
              <div className="geometric-badge bg-black text-white">OPEN CHANNEL</div>
              <h2 className="text-4xl sm:text-7xl md:text-[77px] font-black italic uppercase tracking-tighter text-white leading-tight text-center italic">Direct <br /> Intelligence.</h2>
              <p className="text-lg sm:text-xl text-white font-black italic max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Got a specific tactical challenge? Our mentors are ready for brief, high-impact intelligence sessions.
              </p>
            </div>
            <button 
              onClick={() => setPage('contact')}
              className="geometric-button-primary !bg-white !text-purple-600 !py-6 !px-12 !text-lg shadow-2xl border-none hover:bg-yellow-400 hover:!text-black transition-all"
            >
              NEGOTIATE ACCESS
            </button>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="relative geometric-card !bg-black/80 border-white/20 p-10 space-y-10 shadow-3xl"
          >
            <div className="text-xs font-black text-yellow-400 uppercase tracking-[0.5em] italic">COMMUNICATION_LOG</div>
            <div className="space-y-6">
               <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center text-black shrink-0 font-black text-[10px]">S1</div>
                  <div className="text-white/60 text-sm font-medium italic">"I'm confused about ECTS transfer protocols across Europe."</div>
               </div>
               <div className="flex gap-4 items-start justify-end">
                  <div className="text-yellow-400/80 text-sm font-black italic text-right">"Sector clear. Tactical session available tomorrow."</div>
                  <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white shrink-0 font-black text-[10px]">DG</div>
               </div>
               <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center text-black shrink-0 font-black text-[10px]">S2</div>
                  <div className="text-white/60 text-sm font-medium italic">"Is my CV competitive for Berlin's fintech sector?"</div>
               </div>
            </div>
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
               <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic animate-pulse">Awaiting Signal...</div>
               <Globe className="text-white/10" size={24} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const ThesisShieldView = ({ setPage, formatPrice }: { setPage: (p: PageId) => void, formatPrice: (b: number) => string }) => (
  <div className="bg-purple-600 transition-colors duration-500">
    <section className="min-h-[65vh] flex items-center justify-center px-6 lg:px-20 pt-[160px] pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 z-0 h-[65vh] lg:h-[60vh] rounded-b-[4rem] lg:rounded-b-[10rem] shadow-sm backdrop-blur-sm" />
      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <div className="geometric-badge bg-black dark:bg-white text-white dark:text-slate-900">Protocol ID: ACAD-TH-01</div>
          <h1 className="text-6xl sm:text-7xl md:text-9xl text-slate-950 dark:text-white leading-[0.8] tracking-tighter italic uppercase drop-shadow-none">Thesis <br /><span className="text-slate-900 dark:text-accent underline underline-offset-[12px]">Shield.</span></h1>
          <p className="text-xl text-slate-950 dark:text-slate-300 font-black max-w-lg italic underline decoration-slate-900/10 dark:decoration-white/30 drop-shadow-none">
            3-Month Strategic Academic Architecture. We don't write it for you; we audit the logic, scrub the sources, and prepare your defense.
          </p>
          <div className="grid grid-cols-2 gap-8 lg:gap-12 pt-4">
            <div className="space-y-2">
              <div className="text-[10px] font-black text-slate-950/50 dark:text-white/50 uppercase tracking-widest">Access Fee</div>
              <div className="text-5xl lg:text-6xl font-black text-slate-950 dark:text-white italic leading-none">{formatPrice(131.5)}</div>
            </div>
            <div className="space-y-2 border-l border-slate-950/10 dark:border-white/10 pl-8 lg:pl-12">
              <div className="text-[10px] font-black text-slate-950/50 dark:text-white/50 uppercase tracking-widest">Success Rate</div>
              <div className="text-5xl font-black text-slate-950 dark:text-white italic leading-none">100%</div>
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
              src="https://degreegate.pl/wp-content/uploads/2026/04/mmkcard.mov" 
              thumbnail="https://picsum.photos/seed/thesis-tactical/800/600"
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
  <div className="bg-yellow-400 transition-colors duration-500">
    <section className="min-h-[70vh] flex items-center justify-center px-6 lg:px-20 pt-[160px] pb-24 relative overflow-hidden text-slate-950 dark:text-white">
      <div className="absolute top-0 right-0 w-[80vw] lg:w-[50vw] h-full bg-black/5 dark:bg-white/5 -skew-x-12 z-0 backdrop-blur-sm shadow-2xl" />
      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          whileHover={{ perspective: 1000, rotateY: -10, rotateX: -5 }}
          className="relative order-2 lg:order-1"
        >
          <div className="absolute -inset-8 bg-black/5 dark:bg-white/5 rounded-[4rem] lg:rounded-[6rem] -rotate-3" />
          <div className="relative geometric-card border-none shadow-3xl rounded-[4rem] lg:rounded-[6rem] overflow-hidden aspect-[4/5] p-2 !bg-black/80 dark:!bg-black backdrop-blur-md">
            <ShieldVideoBackground 
              src="https://degreegate.pl/wp-content/uploads/2026/04/caed-2.mp4" 
              thumbnail="https://picsum.photos/seed/career-tactical/800/600"
              innerClassName="rounded-[3.5rem] lg:rounded-[5.5rem]"
            />
            <div className="absolute top-12 right-12 bg-black dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Pipeline Active</div>
          </div>
        </motion.div>
        <div className="space-y-12 order-1 lg:order-2 py-10 lg:py-0">
          <div className="space-y-6">
            <div className="geometric-badge bg-black dark:bg-white text-white dark:text-slate-900">Sector: Corporate Logistics</div>
            <h1 className="text-6xl sm:text-7xl md:text-9xl tracking-tighter leading-[0.8] italic uppercase text-slate-950 dark:text-white drop-shadow-none">Internship <br /><span className="text-slate-900 dark:text-accent underline">Shield.</span></h1>
            <p className="text-xl text-slate-950 dark:text-slate-300 font-black max-w-lg leading-relaxed italic underline decoration-slate-950/10 dark:decoration-white/30 drop-shadow-none">3-Month Professional Weaponization. We bridge the gap between your degree and the global boardroom.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-2">
              <div className="text-[10px] font-black text-slate-950/50 dark:text-white/50 uppercase tracking-widest">Entry Fee</div>
              <div className="text-5xl lg:text-6xl font-black text-slate-950 dark:text-white italic leading-none">{formatPrice(105)}</div>
            </div>
            <div className="space-y-2 border-l border-slate-950/10 dark:border-white/10 pl-8 lg:pl-12">
              <div className="text-[10px] font-black text-slate-950/50 dark:text-white/50 uppercase tracking-widest">Global Ops</div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-accent uppercase italic tracking-tighter">EU Network</div>
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
  <div className="bg-[#4c1d95] pt-[160px] pb-20 px-6 lg:px-20 min-h-screen transition-colors duration-700">
    <div className="max-w-7xl mx-auto space-y-24">
      <div className="space-y-8 max-w-4xl">
        <div className="geometric-badge bg-black dark:bg-white text-white dark:text-slate-900">Deployment Ready</div>
        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[7rem] leading-tight sm:leading-[0.8] italic uppercase text-white drop-shadow-none">Subject <br /><span className="text-white underline decoration-accent">Catalog.</span></h1>
        <p className="text-xl text-white font-black italic underline decoration-white/30 drop-shadow-none">Module-specific rescue operations. Don't let one technical failure jeopardize your entire degree.</p>
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
    <div className="bg-purple-600 pt-[160px] pb-20 px-6 lg:px-20 overflow-hidden relative transition-colors duration-500">
      <div className="absolute inset-0 bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        <div className="space-y-12 max-w-5xl">
          <button 
            onClick={() => setPage('subject-catalog')}
            className="text-[10px] font-black text-slate-950 dark:text-white/40 uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-4 group"
          >
            <div className="w-8 h-8 rounded-full border border-slate-950/20 dark:border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
              <ArrowRight className="rotate-180" size={14} />
            </div>
            Protocol Return: Inventory
          </button>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic leading-[1] uppercase tracking-tighter text-slate-950 dark:text-white max-w-4xl">
            {subject.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            className="glass-blue p-10 lg:p-16 space-y-12 flex flex-col justify-between border-none !text-white rounded-[3rem]"
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
            className="geometric-card p-10 lg:p-16 space-y-12 flex flex-col justify-between group !bg-black dark:!bg-black/40 backdrop-blur-md"
          >
            <div className="space-y-10">
              <div className="flex justify-between items-start">
                <div className="geometric-badge bg-white/10 !text-white">Oversight Hub</div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Duration</div>
                  <div className="text-xl font-black italic text-white uppercase tracking-tighter">1 Month</div>
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
          <ShieldVideoBackground 
            src="https://degreegate.pl/wp-content/uploads/2026/04/ggg.mp4" 
            thumbnail="https://picsum.photos/seed/tactical-brief/1200/600"
            innerClassName="grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
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

const ExpertAdviceView = ({ setPage, formatPrice }: { setPage: (p: PageId) => void, formatPrice: (b: number) => string }) => (
  <div className="bg-yellow-400 pt-[160px] pb-20 px-6 lg:px-20 overflow-hidden relative min-h-screen transition-colors duration-500">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/[0.03] dark:text-white/[0.02] font-black text-[30vw] leading-none pointer-events-none uppercase italic select-none">
      Elite
    </div>
    <div className="max-w-7xl mx-auto space-y-24 relative z-10">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="geometric-badge mx-auto bg-black dark:bg-accent text-white">Direct Intel Channel</div>
        <h1 className="text-4xl sm:text-7xl md:text-9xl leading-tight sm:leading-[0.8] italic uppercase text-slate-900 dark:text-white tracking-tighter drop-shadow-none">Expert <br /><span className="text-slate-950 dark:text-accent underline decoration-4 underline-offset-8 sm:underline-offset-[12px]">Advice.</span></h1>
        <p className="text-xl text-slate-950 dark:text-slate-400 font-black italic underline decoration-white/30 leading-relaxed drop-shadow-none">30 minutes of brutal, strategic honesty. The information the university doesn't want you to have.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <motion.div 
          whileHover={{ y: -20, perspective: 1000, rotateY: 5 }}
          className="geometric-card !bg-black p-1 flex flex-col justify-between group shadow-xl border-none overflow-hidden rounded-[3rem] lg:rounded-[4rem]"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-black">
            <ShieldVideoBackground 
              src="https://degreegate.pl/wp-content/uploads/2026/04/kkk.mp4" 
              thumbnail="https://picsum.photos/seed/advice-local/600/800"
              innerClassName="transition-transform duration-[2000ms] group-hover:scale-110"
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
            <button 
              onClick={() => setPage('contact')}
              className="geometric-button-primary w-full !py-8 text-xl !rounded-[2rem] shadow-2xl shadow-accent/20 italic mt-8"
            >
              Initialize Local Ops
            </button>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -20, perspective: 1000, rotateY: -5 }}
          className="geometric-card p-1 flex flex-col justify-between group border-2 border-white/5 shadow-xl relative overflow-hidden rounded-[3rem] lg:rounded-[4rem] !bg-black/40 backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative aspect-[3/4] overflow-hidden bg-black">
            <ShieldVideoBackground 
              src="https://degreegate.pl/wp-content/uploads/2026/04/ggg.mp4" 
              thumbnail="https://picsum.photos/seed/advice-global/600/800"
              innerClassName="transition-transform duration-[2000ms] group-hover:scale-110"
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
            <button 
              onClick={() => setPage('contact')}
              className="geometric-button-secondary w-full !py-8 text-xl !rounded-[2rem] border-white/10 italic mt-8 !text-white hover:!bg-white hover:!text-primary transition-all"
            >
              Initialize Global Intel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const DegreeGatewayView = ({ setPage }: { setPage: (p: PageId) => void }) => {
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
      await addDoc(collection(db, 'submissions'), {
        form_name: 'degree-gateway',
        data: formData,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setMessage('YOUR ACCESS REQUEST HAS BEEN BROADCAST. STAND BY FOR INTEL.');
    } catch (err: any) {
      console.error("Gateway signup error:", err);
      setStatus('error');
      setMessage('COMMUNICATION LINK FAILURE: SIG-99');
    }
  };

  const benefits = [
    { title: "Free webinars on real student challenges", icon: Tv, color: "bg-purple-500" },
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
    <div className="bg-yellow-500 pt-[100px] sm:pt-[140px] pb-20 sm:pb-32 px-4 sm:px-6 lg:px-20 min-h-screen transition-colors duration-700">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-32">
        {/* Hero Section */}
        <div className="text-center space-y-4 sm:space-y-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-slate-900 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] italic text-center"
          >
            PROTOCOL: GATEWAY
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter text-white leading-tight sm:leading-[0.85]"
          >
            Your Access to the <br /> <span className="text-white underline decoration-accent decoration-4 lg:decoration-8 underline-offset-4 lg:underline-offset-8">DegreeGate Inner Circle.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl text-white font-medium italic max-w-2xl mx-auto leading-relaxed"
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
              className="geometric-card p-5 sm:p-8 !rounded-[1.5rem] sm:!rounded-[2.5rem]"
            >
              <div className={`w-10 h-10 sm:w-14 sm:h-14 ${b.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6`}>
                <b.icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xs sm:text-lg font-black italic uppercase tracking-tight leading-tight">
                {b.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-24 items-start">
          <div className="space-y-8 sm:space-y-16">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-start">
                <div className="flex items-center gap-2">
                  <Star className="text-accent fill-accent shrink-0" size={16} />
                  <h2 className="text-lg sm:text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white bg-black px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-2xl shadow-xl border border-white/5 whitespace-nowrap">Protocol:</h2>
                </div>
                <h2 className="text-lg sm:text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white bg-black px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-2xl shadow-xl border border-white/5"><span className="text-accent underline decoration-white/20">Process.</span></h2>
              </div>
              <div className="w-12 sm:w-32 h-1 sm:h-2.5 bg-accent rounded-full animate-pulse mt-2" />
            </div>
            <div className="space-y-6 sm:space-y-12">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4 sm:gap-10 group items-start">
                  <div className="text-3xl sm:text-5xl md:text-6xl font-black text-white/40 group-hover:text-accent/60 transition-colors italic leading-none shrink-0">{s.n}</div>
                  <div className="pt-1 sm:pt-2">
                    <p className="text-base sm:text-xl md:text-2xl font-black italic text-white leading-tight uppercase tracking-tight max-w-sm group-hover:text-white transition-colors">{s.t}</p>
                  </div>
                </div>
              ))}
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 sm:px-10 sm:py-6 bg-black dark:bg-white text-white dark:text-slate-900 font-black italic uppercase tracking-widest text-[10px] sm:text-sm rounded-2xl shadow-xl hover:opacity-90 transition-all border-b-4 border-accent"
              >
                <Star size={16} className="fill-accent text-accent" />
                Begin Application Now
              </motion.button>
            </div>
          </div>

          {/* Signup Form */}
          <div id="signup-form" className="p-6 sm:p-10 lg:p-16 bg-white dark:bg-black border border-slate-200 dark:border-white/5 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 dark:bg-accent/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-10 sm:py-20"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-500/20">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">{message}</h3>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-accent underline font-black uppercase text-[10px] sm:text-xs tracking-widest italic"
                >
                  Apply another contact
                </button>
              </motion.div>
            ) : (
              <form data-netlify="false" onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 italic ml-4">First Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ENTER"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 dark:placeholder:text-white/10 font-bold italic uppercase text-sm"
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 italic ml-4">Last Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ENTER"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 dark:placeholder:text-white/10 font-bold italic uppercase text-sm"
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 italic ml-4">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@university.com"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 dark:placeholder:text-white/10 font-bold italic uppercase text-sm"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {/* ... other form fields ... */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 italic ml-4">University Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ENTER UNIVERSITY"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 dark:placeholder:text-white/10 font-bold italic uppercase text-sm"
                    value={formData.university}
                    onChange={e => setFormData({...formData, university: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 italic ml-4">Country</label>
                  <input 
                    required
                    type="text" 
                    placeholder="ENTER COUNTRY"
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-accent transition-colors placeholder:text-slate-300 dark:placeholder:text-white/10 font-bold italic uppercase text-sm"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                <div className="pt-4">
                  <button 
                    disabled={status === 'loading'}
                    className="w-full bg-accent hover:opacity-90 text-white font-black py-6 rounded-2xl transition-all uppercase tracking-widest italic text-sm relative overflow-hidden group disabled:opacity-50"
                  >
                    {status === 'loading' ? 'ENCRYPTING DATA...' : 'REQUEST ACCESS'}
                  </button>
                  <p className="text-[10px] text-slate-400 dark:text-white/30 text-center mt-6 uppercase tracking-widest italic font-bold">Once you join you will receive all updates and invites directly to your inbox.</p>
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

const AboutView = ({ setPage }: { setPage: (p: PageId) => void }) => (
  <div className="bg-yellow-500 pt-[160px] pb-20 px-6 lg:px-20 min-h-screen relative overflow-hidden transition-colors duration-700">
    <div className="absolute top-0 right-0 w-[80vw] lg:w-[40vw] h-full bg-black/5 dark:bg-white/5 border-l border-black/5 z-0 backdrop-blur-sm" />
    <div className="max-w-7xl mx-auto space-y-32 relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="geometric-badge bg-black dark:bg-accent text-white">Operational History</div>
            <h1 className="text-4xl sm:text-7xl md:text-[108px] leading-tight sm:leading-[0.7] italic uppercase tracking-tighter text-white drop-shadow-none">The <br /><span className="text-white underline decoration-accent decoration-4 sm:decoration-8 text-[40px] sm:text-[99px]">DegreeGate</span><br /> Narrative.</h1>
            <p className="text-xl md:text-2xl italic font-black max-w-lg border-l-[12px] border-white pl-10 text-white drop-shadow-none">We didn't start as a business. We started as students who realized the system was built to be broken, and then we mastered the cracks.</p>
          </div>
          <div className="space-y-8 text-white text-sm leading-relaxed font-black max-w-xl italic">
             <p>Founded by graduates who navigated the complex academic landscape of Europe, DegreeGate was born out of one simple truth: <strong className="text-white italic drop-shadow-none">Traditional support is slow, expensive, and fundamentally out of touch with high-impact reality.</strong></p>
             <p>Our mentors aren't just academics. They are mercenaries of the corporate world who have scaled their own careers into global powerhouses like Amazon, Google, and beyond. We don't just teach modules; we deployment career assets.</p>
          </div>
          <button 
            onClick={() => setPage('contact')}
            className="geometric-button-primary px-16 py-7 italic shadow-2xl shadow-black/10 !rounded-[2rem] bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-black/90 dark:hover:bg-white/90"
          >
            Audit Our Sector
          </button>
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
    const formPayload: Record<string, any> = {};
    formData.forEach((value, key) => {
      formPayload[key] = value;
    });

    try {
      await addDoc(collection(db, 'submissions'), {
        form_name: (formData.get('form-name') || 'contact').toString(),
        data: formPayload,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      setStatus('success');
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-purple-600 pt-[200px] min-h-screen flex items-center justify-center px-6">
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
  <div className="bg-[#4c1d95] pt-[160px] pb-20 px-6 lg:px-20 min-h-screen relative overflow-hidden transition-colors duration-700">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02),transparent)]" />
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
        <div className="space-y-16">
          <div className="space-y-8">
            <div className="geometric-badge bg-accent text-white">Direct Channel</div>
            <h1 className="text-6xl sm:text-7xl md:text-[85px] tracking-tighter leading-[0.8] italic uppercase text-white">
              Contact <br /><span className="text-white underline decoration-accent">Support.</span>
            </h1>
            <p className="text-xl text-white font-bold italic underline decoration-white/10 leading-relaxed">Get in touch with us. We are here to help you with your academic and career queries.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-10">
            {[
              { label: 'Global RE-X 424', value: '24/7 GLOBAL RESPONSE', icon: <div className="p-3 sm:p-5 bg-accent text-white rounded-2xl sm:rounded-3xl shadow-2xl"><ShieldCheck size={40} /></div> },
              { label: 'Asset Support', value: <span className="lowercase underline text-accent">help@degreegate.com</span>, icon: <div className="p-3 sm:p-5 glass-blue text-white rounded-2xl sm:rounded-3xl shadow-2xl"><GraduationCap size={40} /></div> },
            ].map((item, i) => (
              <div key={i} className="space-y-6 group cursor-pointer glass-dark p-8 md:p-12 rounded-[3rem] hover:bg-white/5 transition-all">
                <div className="flex items-center gap-6">
                  {item.icon}
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-white">{item.label}</span>
                </div>
                <div className="font-black text-xl sm:text-2xl lg:text-3xl xl:text-4xl italic tracking-tighter text-white group-hover:text-accent transition-all duration-300 transform group-hover:translate-x-2 leading-tight break-all">
                  {typeof item.value === 'string' ? <span className="uppercase text-white">{item.value}</span> : item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-16 border-t border-accent/10">
            <div className="flex gap-8">
              <button 
                onClick={() => setPage('privacy')}
                className="text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-accent transition-all"
              >
                [Privacy Policy]
              </button>
              <button 
                onClick={() => setPage('terms')}
                className="text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-accent transition-all"
              >
                [Terms of Service]
              </button>
              <button 
                onClick={() => setPage('blog')}
                className="text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-accent transition-all"
              >
                [Intelligence Blog]
              </button>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="geometric-card p-10 lg:p-20 !bg-black space-y-12 shadow-3xl rounded-[3rem] lg:rounded-[5rem] border-white/10"
        >
          <div className="space-y-4">
            <h3 className="text-5xl italic tracking-tighter text-white uppercase leading-none">Contact <br /> Us</h3>
            <p className="text-white/70 font-medium italic">Please fill out the form below to get in touch with us.</p>
          </div>
          <form 
            onSubmit={handleSubmit}
            data-netlify="true"
            name="contact"
            className="space-y-10" 
          >
            <input type="hidden" name="form-name" value="contact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-6 italic text-left block">First Name</label>
                <input name="first_name" type="text" required placeholder="Enter your first name" className="w-full bg-black/60 border border-white/20 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/40 italic" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-6 italic text-left block">Last Name</label>
                <input name="last_name" type="text" required placeholder="Enter your last name" className="w-full bg-black/60 border border-white/20 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/40 italic" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-6 italic text-left block">Email Address</label>
                <input name="email" type="email" required placeholder="Enter your email" className="w-full bg-black/60 border border-white/20 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/40 italic" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-6 italic">Subject</label>
                <input name="subject" type="text" required placeholder="Subject of message" className="w-full bg-black/60 border border-white/20 rounded-full px-10 py-6 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/40 italic" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-6 italic">Message</label>
              <textarea name="message" required placeholder="Your message..." rows={4} className="w-full bg-black/60 border border-white/20 rounded-[40px] px-10 py-8 text-sm font-bold text-white focus:border-accent focus:outline-none transition-all resize-none placeholder:text-white/40 italic" />
            </div>
            
            {status === 'error' && (
              <p className="text-red-500 text-[10px] font-black uppercase italic text-center">Something went wrong. Please try again.</p>
            )}

            <div className="flex justify-start">
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="geometric-button-primary w-full lg:w-auto lg:px-24 !py-8 text-xl italic shadow-2xl shadow-accent/20 !rounded-[2.5rem] disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Submit Signal'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  </div>
  );
};


const BlogView = ({ posts, setPage }: { posts: BlogPost[], setPage: (p: PageId, id?: string) => void }) => (
  <div className="bg-yellow-500 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen relative overflow-hidden transition-colors duration-700">
    <div className="max-w-7xl mx-auto space-y-20 relative z-10">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="geometric-badge mx-auto bg-black dark:bg-accent text-white">Intelligence Pipeline</div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase text-white tracking-tighter leading-tight sm:leading-none">Strategic <br /><span className="text-white underline decoration-accent">Intel.</span></h1>
        <p className="text-xl text-white font-bold italic border-x border-white/20 px-10">Operational briefings, system updates, and academic extraction tactics.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map(post => (
          <div 
            key={post.slug} 
            onClick={() => setPage('blog-post', post.slug)}
            className="geometric-card p-10 space-y-8 group cursor-pointer"
          >
            <div className="aspect-video bg-black/40 dark:bg-white/5 rounded-2xl overflow-hidden relative border border-white/5">
               <img src={post.featured_image || 'https://picsum.photos/seed/degreegate/800/600'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-black text-accent uppercase tracking-widest">{new Date(post.date).toLocaleDateString()}</div>
              <h3 className="text-2xl font-black italic uppercase leading-tight group-hover:text-accent transition-colors">{post.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-3">{post.description}</p>
            </div>
            <button className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center gap-3">
              Decrypt Full Story <ArrowRight size={14} />
            </button>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="text-white italic font-black text-xl uppercase tracking-widest">Signal Awaiting Data...</div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const BlogPostView = ({ post, setPage }: { post: BlogPost, setPage: (p: PageId) => void }) => (
  <div className="bg-purple-600 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen transition-colors duration-500">
    <div className="max-w-4xl mx-auto space-y-16">
      <button 
        onClick={() => setPage('blog')}
        className="text-[10px] font-black text-slate-950/40 dark:text-white/40 uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-4 group"
      >
        <div className="w-8 h-8 rounded-full border border-slate-950/20 dark:border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
          <ArrowRight className="rotate-180" size={14} />
        </div>
        Back to Intel Pipeline
      </button>

      <div className="space-y-8 text-center md:text-left">
        <div className="geometric-badge bg-black dark:bg-accent text-white">{new Date(post.date).toLocaleDateString()}</div>
        <h1 className="text-6xl md:text-8xl font-black italic uppercase text-slate-950 dark:text-white tracking-tighter leading-none">{post.title}</h1>
        <p className="text-xl text-slate-950 dark:text-blue-100/70 font-bold italic border-l-8 border-accent pl-8">{post.description}</p>
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
  <div className="bg-purple-600 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen transition-colors duration-500">
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="space-y-6">
        <div className="geometric-badge bg-black dark:bg-accent text-white">Security Protocol</div>
        <h1 className="text-6xl font-black italic uppercase text-slate-950 dark:text-white tracking-tighter">Privacy <span className="text-white underline decoration-accent">Shield.</span></h1>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-950 font-medium italic">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight italic">01. Signal Encryption</h2>
          <p>We respect your tactical data. All intelligence signals sent via DegreeGate are encrypted using enterprise-grade protocols. Your personal academic footprint is treated with the highest level of security.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight italic">02. Data Extraction</h2>
          <p>We only collect the minimum intelligence necessary to facilitate your academic protection. This includes your contact vectors and university sector details.</p>
        </section>
        <div className="p-8 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10">
          <p className="text-xs uppercase tracking-widest font-black text-slate-400 dark:text-white/40 mb-2">Update status</p>
          <p className="text-lg font-black text-slate-950 dark:text-white italic uppercase tracking-tighter">Current Revision: April 2026</p>
        </div>
      </div>
    </div>
  </div>
);

const TermsView = () => (
  <div className="bg-yellow-400 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen transition-colors duration-500">
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="space-y-6">
        <div className="geometric-badge bg-black dark:bg-accent text-white">Engagement Protocol</div>
        <h1 className="text-6xl font-black italic uppercase text-slate-950 dark:text-white tracking-tighter">Terms of <span className="text-accent">Service.</span></h1>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-950 font-medium italic">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight italic">01. Service Deployment</h2>
          <p>By initializing a signal with DegreeGate, you agree to our engagement protocols. Our shields are architectural in nature; we provide tactical guidance, not academic dishonesty.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight italic">02. Operational Limits</h2>
          <p>DegreeGate is an intelligence network. We do not guarantee specific outcomes but provide the highest level of strategic preparation possible under current global university regulations.</p>
        </section>
      </div>
    </div>
  </div>
);

const AdminPortal = ({ posts, setPage }: { posts: BlogPost[], setPage: (p: PageId, id?: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'submissions'>('posts');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(localStorage.getItem('dg_admin_token'));
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('dg_admin_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
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

  // Submissions listener
  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
        setSubmissions(subs);
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

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
        setError(data.error || 'REJECTED. Authentication signal mismatch.');
      }
    } catch (e) {
      console.error('Auth Signal Failure:', e);
      setError('REJECTED. Communication link severed.');
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
      if (editingPost) {
        await updateDoc(doc(db, 'blog_posts', editingPost.id!), {
          ...newPost,
          updatedAt: serverTimestamp()
        });
        setEditingPost(null);
      } else {
        const slug = newPost.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'briefing-' + Date.now();
        await addDoc(collection(db, 'blog_posts'), {
          ...newPost,
          slug,
          authorId: 'admin',
          createdAt: serverTimestamp()
        });
      }
      setIsCreating(false);
      setNewPost({ title: '', date: new Date().toISOString().split('T')[0], featured_image: '', description: '', body: '' });
    } catch (e) {
      console.error('Operation Failure:', e);
      alert('SIGNAL COLLISION: Operation failed.');
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

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('ERASE SUBMISSION: Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'submissions', id));
    } catch (e) {
      console.error('Submission Deletion Failure:', e);
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, status: Submission['status']) => {
    try {
      await updateDoc(doc(db, 'submissions', id), { status });
    } catch (e) {
      console.error('Status Update Failure:', e);
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
          
          <form data-netlify="false" onSubmit={handleLogin} className="space-y-6">
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
    <div className="bg-purple-600 pt-[160px] pb-32 px-6 lg:px-20 min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b-4 border-slate-900 dark:border-white pb-12">
          <div>
            <div className="geometric-badge bg-black text-white">Active Tactical Session</div>
            <h1 className="text-6xl font-black italic uppercase text-slate-950 dark:text-white tracking-tighter mt-4">Intel. <span className="text-accent underline decoration-4">Dashboard.</span></h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={downloadLogo}
              className="geometric-nav-link text-slate-400 hover:text-black !p-0 mr-4 flex items-center gap-2"
            >
              <Download size={14} /> Export PNG
            </button>
              <button 
                onClick={() => {
                  setIsCreating(!isCreating);
                  if (isCreating) setEditingPost(null);
                }}
                className="geometric-button-primary !py-4 !px-10 text-xs !rounded-full flex items-center gap-3"
              >
                {(isCreating || editingPost) ? <X size={16} /> : <Plus size={16} />}
                {(isCreating || editingPost) ? 'Abort Operation' : 'Launch New Intel'}
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
              <form data-netlify="false" onSubmit={handleCreate} className="geometric-card bg-white border-slate-200 p-12 space-y-8 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Intel Title</label>
                    <input 
                      required
                      placeholder="Title of briefing..."
                      value={newPost.title}
                      onChange={e => setNewPost({...newPost, title: e.target.value})}
                      className="w-full bg-black/5 border border-black/10 rounded-full px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mission Date</label>
                    <input 
                      type="date"
                      required
                      value={newPost.date}
                      onChange={e => setNewPost({...newPost, date: e.target.value})}
                      className="w-full bg-black/5 border border-black/10 rounded-full px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Featured Image Vector (URL)</label>
                  <input 
                    placeholder="https://images.unsplash.com/..."
                    value={newPost.featured_image}
                    onChange={e => setNewPost({...newPost, featured_image: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded-full px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Signal Abstract (Short Description)</label>
                  <textarea 
                    rows={2}
                    value={newPost.description}
                    onChange={e => setNewPost({...newPost, description: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded-3xl px-8 py-4 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all italic resize-none"
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
                    className="w-full bg-black/5 border border-black/10 rounded-[2rem] px-8 py-6 text-sm font-bold text-slate-900 focus:border-yellow-400 outline-none transition-all italic resize-none"
                    placeholder="# Writing intel... Use markdown standard."
                  />
                </div>
                <div className="flex justify-end gap-4">
                   <button type="submit" disabled={loading} className="geometric-button-primary !px-16 !py-6 !rounded-full !bg-black !text-white hover:!bg-yellow-400 hover:!text-black transition-all shadow-2xl">
                      {loading ? 'Encrypting...' : (editingPost ? 'Update Intel' : 'Publish Extraction')}
                   </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'bg-black text-white shadow-xl' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
          >
            Intelligence Briefings
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'submissions' ? 'bg-black text-white shadow-xl' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
          >
            Direct Signals {submissions.filter(s => s.status === 'unread').length > 0 && <span className="ml-2 bg-yellow-400 text-black px-1.5 py-0.5 rounded-md text-[8px]">{submissions.filter(s => s.status === 'unread').length}</span>}
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'posts' ? (
            <>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-400">Deployed Intelligence Index</h3>
              <div className="grid gap-4">
                {posts.map(post => (
                  <div key={post.id} className="geometric-card bg-white border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-black transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-14 bg-black/10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                        <img src={post.featured_image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-black italic uppercase text-slate-900 leading-none">{post.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">{new Date(post.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-8 items-center">
                      <button 
                        onClick={() => {
                          setNewPost({
                            title: post.title,
                            date: post.date,
                            featured_image: post.featured_image,
                            description: post.description,
                            body: post.body
                          });
                          setEditingPost(post);
                          setIsCreating(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-black transition-colors italic"
                      >
                        Edit Intel
                      </button>
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
            </>
          ) : (
            <>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-400">Intercepted Communications</h3>
              <div className="grid gap-6">
                {submissions.map(sub => (
                  <div key={sub.id} className={`geometric-card border-slate-200 p-8 space-y-6 transition-all ${sub.status === 'unread' ? 'bg-yellow-50 border-yellow-200' : 'bg-white opacity-80'}`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${sub.status === 'unread' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-300'}`} />
                          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Sector: {sub.form_name}</span>
                        </div>
                        <h4 className="text-xl font-black italic uppercase text-slate-900 tracking-tighter">
                          {sub.data.first_name} {sub.data.last_name || sub.data.name}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{sub.data.email}</p>
                      </div>
                      <div className="flex gap-4">
                        {sub.status === 'unread' && (
                          <button 
                            onClick={() => handleUpdateSubmissionStatus(sub.id, 'read')}
                            className="bg-black text-white px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-black/5 rounded-2xl border border-black/5">
                      <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{sub.data.message || 'No written payload detected.'}"</p>
                    </div>

                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-300 italic">
                      <div>Captured: {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleString() : 'System Time Unknown'}</div>
                      <div className="flex gap-4">
                         {sub.data.subject && <span>Objective: {sub.data.subject}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && <div className="p-20 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-200 rounded-[2rem]">Quiet on all frequencies. No incoming signals.</div>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Floating Controls Component ---

const ControlHub = ({ 
  currency, 
  setCurrency, 
  supportedCurrencies
}: { 
  currency: string; 
  setCurrency: (c: string) => void; 
  supportedCurrencies: string[]; 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
            className="mb-6 p-8 bg-black border border-white/10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] min-w-[320px] ring-1 ring-white/5 text-white"
          >
            <div className="space-y-8">
              {/* Currency Selection */}
              <div className="space-y-4">
                <p className="text-[10px] font-black italic text-white/40 uppercase tracking-widest pl-2">Pricing Protocol ({currency})</p>
                <div className="grid grid-cols-3 gap-2">
                  {supportedCurrencies.map(c => (
                    <button 
                      key={c}
                      onClick={() => { setCurrency(c); localStorage.setItem('dg-currency', c); }}
                      className={`py-3 rounded-xl text-[10px] font-black italic uppercase transition-all duration-300 ${
                        currency === c 
                          ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                          : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 group relative ${
          isOpen 
            ? 'bg-yellow-400 text-black rotate-90' 
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-white/10'
        }`}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity" />
        {isOpen ? <X size={28} /> : <Cpu size={28} className="group-hover:text-yellow-500 transition-colors" />}
        
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white dark:border-slate-900 animate-bounce" />
        )}
      </motion.button>
    </div>
  );
};

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
        // Check for manual override first
        const savedCurrency = localStorage.getItem('dg-currency');
        if (savedCurrency && supportedCurrencies.includes(savedCurrency)) {
          setCurrency(savedCurrency);
        } else {
          // 1. Detect currency by IP
          const ipResponse = await fetch('https://ipapi.co/json/').catch(() => null);
          let detectedCurrency = 'EUR';
          
          if (ipResponse && ipResponse.ok) {
            const ipData = await ipResponse.json();
            detectedCurrency = ipData.currency?.toUpperCase() || 'EUR';
          }
          
          if (detectedCurrency && supportedCurrencies.includes(detectedCurrency)) {
            setCurrency(detectedCurrency);
          } else {
            setCurrency('EUR');
          }
        }

        // 2. Fetch exchange rates (from EUR base)
        const ratesResponse = await fetch('https://open.er-api.com/v6/latest/EUR').catch(() => null);
        if (ratesResponse && ratesResponse.ok) {
          const ratesData = await ratesResponse.json();
          if (ratesData && ratesData.rates) {
            setRates({ ...ratesData.rates, EUR: 1 });
          }
        }
      } catch (error) {
        console.warn('Currency detection failed, falling back to EUR:', error);
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
      case 'expert-advice': return <ExpertAdviceView setPage={setView} formatPrice={formatPrice} />;
      case 'degree-gateway': return <DegreeGatewayView setPage={setView} />;
      case 'about': return <AboutView setPage={setView} />;
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

      <div className="geometric-container dark bg-black text-white">
      <Navbar 
        activePage={currentPage} 
        setPage={setView} 
      />
      
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

      <ControlHub 
        currency={currency}
        setCurrency={setCurrency}
        supportedCurrencies={supportedCurrencies}
      />

    <footer className="bg-[#0a0b1a] text-white py-24 px-6 md:px-10 mt-0 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -ml-48 -mb-48 opacity-30" />
        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-24">
            <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
              <div 
                className="flex items-center justify-center sm:justify-start gap-3 cursor-pointer group"
                onClick={() => setView('home')}
              >
                <div className="w-[47px] h-[44px] bg-yellow-400 rounded-2xl rotate-12 flex items-center justify-center group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-yellow-400/20 shrink-0">
                  <div className="relative">
                    <GraduationCap size={24} className="text-black" />
                    <Zap size={14} className="text-black absolute -top-2 -right-2 fill-black" />
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <div className="font-display text-xl lg:text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
                    DegreeGate<span className="text-yellow-500">.</span>
                  </div>
                  <div className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em] mt-0.5">Operational Phase: Beta</div>
                </div>
              </div>
              <p className="text-white/60 text-xs sm:text-[11px] font-medium leading-relaxed max-w-xs mx-auto sm:mx-0 italic uppercase tracking-tighter">
                DegreeGate helps international students explore study opportunities and academic pathways in Europe. Navigate the complexity of European academia with tactical precision.
              </p>
            </div>
            
            <div className="space-y-5 text-center sm:text-left">
              <h4 className="text-[9px] font-black uppercase text-white tracking-[0.2em] border-b border-white/10 pb-2">Academic Intel & Shields</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setView('thesis-shield')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Thesis Shield & Protection</button></li>
                <li><button onClick={() => setView('internship-shield')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Internship Shields Hub</button></li>
                <li><button onClick={() => setView('subject-catalog')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Subject Expert (Tech & Biz)</button></li>
                <li><button onClick={() => setView('degree-gateway')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Intelligence Gateway</button></li>
              </ul>
            </div>
            
            <div className="space-y-5 text-center sm:text-left">
              <h4 className="text-[9px] font-black uppercase text-white tracking-[0.2em] border-b border-white/10 pb-2">Expert Channels</h4>
              <ul className="space-y-3">
                <li><a href="mailto:help@degreegate.com" className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Expert Support Intel</a></li>
                <li><button onClick={() => setView('blog')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Intelligence Blogs</button></li>
                <li><button onClick={() => setView('expert-advice')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Expert In Tech Advice</button></li>
                <li><button onClick={() => setView('contact')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Contact Hub Intel</button></li>
              </ul>
            </div>

            <div className="space-y-6 text-center sm:text-left">
              <h4 className="text-[9px] font-black uppercase text-white tracking-[0.2em] border-b border-white/10 pb-2">Legal Access</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setView('privacy')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Privacy Policy</button></li>
                <li><button onClick={() => setView('terms')} className="text-[11px] font-bold text-white/70 hover:text-white transition-colors uppercase italic tracking-tighter">Terms of Service</button></li>
                <li><button onClick={() => setView('admin')} className="text-[11px] font-bold text-white/30 hover:text-white transition-colors uppercase italic tracking-tighter">Admin Portal</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic text-center sm:text-left">
              © {new Date().getFullYear()} DegreeGate Intelligence Network. All Rights Reserved.
            </div>
            <div className="flex gap-8">
              {[
                { icon: <Facebook size={18} />, title: "Facebook", href:socials[0].href },
                { icon: <X size={18} />, title: "X", href: socials[1].href },
                { icon: <Instagram size={18} />, title: "Instagram", href: socials[2].href },
                { icon: <Linkedin size={18} />, title: "LinkedIn", href: socials[3].href }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-all hover:scale-110" title={social.title}>{social.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
