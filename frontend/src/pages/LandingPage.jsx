import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  FiEdit3, FiPieChart, FiTarget, FiArrowRight, 
  FiActivity, FiBookOpen, FiAlertTriangle, FiTrendingUp,
  FiImage, FiStar, FiShield, FiGithub, FiTwitter
} from 'react-icons/fi';
import PublicNavbar from '../components/PublicNavbar';
import MockChart from '../components/ui/MockChart';

// ─── Animated counter hook ───
const useAnimatedCounter = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView || !inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration, startOnView]);

  return { count, ref };
};

// ─── Stat counter component ───
const StatCounter = ({ value, suffix = '', prefix = '', label }) => {
  const { count, ref } = useAnimatedCounter(value, 2200);
  return (
    <div ref={ref} className="flex flex-col items-center px-4 sm:px-8">
      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white [html:not(.dark)_&]:text-slate-900 tabular-nums tracking-tight">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
      <span className="text-gray-500 [html:not(.dark)_&]:text-slate-500 text-sm font-medium mt-2 tracking-wide uppercase">{label}</span>
    </div>
  );
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const yPosAnim = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityAnim = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] [html:not(.dark)_&]:bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <PublicNavbar />
      
      <main className="flex-1">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden dot-grid-bg">
          {/* Animated Background Gradients */}
          <motion.div 
            style={{ y: yPosAnim, opacity: opacityAnim }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/15 [html:not(.dark)_&]:bg-violet-400/10 rounded-full blur-[120px] mix-blend-screen [html:not(.dark)_&]:mix-blend-multiply pointer-events-none"
          />
          <motion.div 
            style={{ y: yPosAnim, opacity: opacityAnim }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/8 [html:not(.dark)_&]:bg-purple-400/8 rounded-full blur-[150px] mix-blend-screen [html:not(.dark)_&]:mix-blend-multiply pointer-events-none"
          />
          {/* Removed heavy crosshair grid to match soft light theme */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              
              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white [html:not(.dark)_&]:text-slate-900 tracking-tight mb-8 leading-[1.1] max-w-4xl">
                Elevate Your <br className="hidden md:block"/>
                <span className="text-violet-500 [html:not(.dark)_&]:text-violet-600">Trading Edge.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="mt-2 max-w-2xl text-lg md:text-xl font-medium text-gray-400 [html:not(.dark)_&]:text-slate-800 mx-auto mb-12 leading-relaxed">
                The ultimate trading journal built for serious traders. Log setups, analyze your performance, track your psychology, and stop repeating the same mistakes.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
                <Link
                  to="/register"
                  className="group relative flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 text-white font-bold py-3.5 px-8 rounded-full text-lg transition-all duration-300 shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5"
                >
                  Start Journaling Free
                </Link>
                <Link
                  to="/gallery"
                  className="group flex items-center justify-center gap-2 bg-transparent text-gray-300 border border-gray-600 hover:border-gray-400 hover:text-white [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:text-slate-900 [html:not(.dark)_&]:border-slate-300 [html:not(.dark)_&]:hover:border-slate-400 font-bold py-3.5 px-8 rounded-full text-lg transition-all duration-300 hover:-translate-y-0.5 [html:not(.dark)_&]:shadow-sm"
                >
                  View Public Gallery
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Animated Stats Row */}
              <motion.div 
                variants={fadeUp}
                className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-0 sm:divide-x divide-gray-800 [html:not(.dark)_&]:divide-slate-300"
              >
                <StatCounter value={12450} suffix="+" label="Trades Logged" />
                <StatCounter value={68} suffix="%" label="Avg Win Rate" />
                <StatCounter value={2} suffix=".1 R" label="Avg R-Multiple" />
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ================= 3D DASHBOARD PREVIEW ================= */}
        <section className="relative z-20 pb-32 px-4 sm:px-6 lg:px-8 mt-4 perspective-[2000px]">
          <motion.div 
            initial={{ opacity: 0, rotateX: 20, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="max-w-6xl mx-auto reflection"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-[#141414] [html:not(.dark)_&]:bg-white rounded-2xl border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] [html:not(.dark)_&]:shadow-xl overflow-hidden flex flex-col relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent [html:not(.dark)_&]:before:from-transparent before:pointer-events-none">
              
              {/* Window Header */}
              <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-slate-100 border-b border-gray-800 [html:not(.dark)_&]:border-slate-200 p-4 flex items-center gap-2 relative z-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 [html:not(.dark)_&]:bg-white border border-gray-800 [html:not(.dark)_&]:border-slate-200 rounded-md px-4 py-1.5 text-xs text-gray-400 [html:not(.dark)_&]:text-slate-600 font-medium font-mono">
                  <FiShield className="w-3 h-3 text-green-500" />
                  app.tradejournal.com
                </div>
              </div>

              {/* Mockup Body */}
              <div className="flex bg-[#060606] [html:not(.dark)_&]:bg-slate-50 h-[700px] relative z-10">
                {/* Sidebar */}
                <div className="w-20 border-r border-gray-800 [html:not(.dark)_&]:border-slate-200 flex-col items-center py-6 gap-6 hidden sm:flex bg-[#141414] [html:not(.dark)_&]:bg-white">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold mb-6 shadow-lg shadow-violet-500/20">TJ</div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 [html:not(.dark)_&]:bg-slate-100 flex items-center justify-center text-white [html:not(.dark)_&]:text-slate-900"><FiActivity size={20} /></div>
                  <div className="w-10 h-10 rounded-xl text-gray-500 flex items-center justify-center"><FiEdit3 size={20} /></div>
                  <div className="w-10 h-10 rounded-xl text-gray-500 flex items-center justify-center"><FiBookOpen size={20} /></div>
                </div>
                
                {/* Main Content Area */}
                <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-1">Performance Overview</h2>
                      <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm">Your trading analytics for the last 30 days.</p>
                    </div>
                  </div>

                  {/* Top Metrics */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white border border-gray-800 [html:not(.dark)_&]:border-slate-200 p-4 rounded-2xl flex flex-col justify-center relative overflow-hidden group [html:not(.dark)_&]:shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <span className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-sm font-medium mb-2 flex items-center gap-2"><FiTarget className="text-green-400"/> Win Rate</span>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-black text-white [html:not(.dark)_&]:text-slate-900">68.5%</span>
                        <span className="text-green-400 text-sm font-medium mb-1">+2.4%</span>
                      </div>
                    </div>
                    <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white border border-gray-800 [html:not(.dark)_&]:border-slate-200 p-4 rounded-2xl flex flex-col justify-center relative overflow-hidden [html:not(.dark)_&]:shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <span className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-sm font-medium mb-2 flex items-center gap-2"><FiPieChart className="text-violet-400"/> Profit Factor</span>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-black text-white [html:not(.dark)_&]:text-slate-900">2.14</span>
                      </div>
                    </div>
                    <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white border border-gray-800 [html:not(.dark)_&]:border-slate-200 p-4 rounded-2xl flex-col justify-center hidden md:flex relative overflow-hidden [html:not(.dark)_&]:shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <span className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-sm font-medium mb-2 flex items-center gap-2"><FiTrendingUp className="text-blue-400"/> Total PnL</span>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-black text-white [html:not(.dark)_&]:text-slate-900">$14,250</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white border border-gray-800 [html:not(.dark)_&]:border-slate-200 rounded-2xl relative overflow-hidden shadow-inner flex flex-col p-1">
                     <MockChart />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================= TRUST STRIP ================= */}
        <section className="py-12 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-t border-b border-gray-800/30 [html:not(.dark)_&]:border-slate-200/50 relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 [html:not(.dark)_&]:text-slate-400 text-sm font-medium uppercase tracking-widest mb-8">Trusted by traders using</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {['TradingView', 'MetaTrader 4', 'NinjaTrader', 'Thinkorswim', 'Interactive Brokers', 'Sierra Chart'].map((name) => (
                <span key={name} className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-base sm:text-lg font-bold tracking-wide opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default select-none">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES GRID ================= */}
        <section id="features" className="py-24 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-t border-gray-800 [html:not(.dark)_&]:border-slate-200 relative z-10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="inline-block text-violet-500 text-sm font-bold uppercase tracking-widest mb-4">Powerful Features</span>
                <h2 className="text-4xl md:text-5xl font-black text-white [html:not(.dark)_&]:text-slate-900 mb-6 tracking-tight">Everything you need.</h2>
                <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg max-w-xl mx-auto">Data-driven execution without the emotion.</p>
              </motion.div>
            </div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: FiEdit3,
                  title: "Comprehensive Trade Logging",
                  desc: "Multi-step form to capture every detail — entry, exit, setup, sizing, and emotions. Never forget what happened.",
                  color: "violet",
                  accent: "from-violet-500 to-purple-500",
                  iconBg: "bg-violet-500/10 border-violet-500/20",
                  iconColor: "text-violet-500",
                  hoverBorder: "hover:border-violet-500/40",
                  hoverShadow: "hover:shadow-[0_8px_40px_-12px_rgba(139,92,246,0.2)]",
                  visual: (
                    <div className="flex gap-1.5 mt-4">
                      {['Basic Info', 'Setup', 'Results'].map((s, i) => (
                        <div key={i} className={`h-1.5 rounded-full flex-1 ${i === 0 ? 'bg-violet-500' : i === 1 ? 'bg-violet-500/50' : 'bg-gray-700 [html:not(.dark)_&]:bg-slate-200'}`} />
                      ))}
                    </div>
                  )
                },
                {
                  icon: FiTrendingUp,
                  title: "Performance Analytics",
                  desc: "Automatically calculates Win Rate, Average R:R, Profit Factor, and equity curves across all your strategies.",
                  color: "green",
                  accent: "from-emerald-500 to-green-500",
                  iconBg: "bg-emerald-500/10 border-emerald-500/20",
                  iconColor: "text-emerald-500",
                  hoverBorder: "hover:border-emerald-500/40",
                  hoverShadow: "hover:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.2)]",
                  visual: (
                    <div className="flex items-end gap-1 mt-4 h-10">
                      {[35, 50, 40, 65, 45, 80, 60, 90, 70, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-emerald-500/60 rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  )
                },
                {
                  icon: FiAlertTriangle,
                  title: "Mistake Library",
                  desc: "Catalog your recurring errors — FOMO entries, revenge trading, moving stops. Build solutions, not excuses.",
                  color: "red",
                  accent: "from-red-500 to-rose-500",
                  iconBg: "bg-red-500/10 border-red-500/20",
                  iconColor: "text-red-500",
                  hoverBorder: "hover:border-red-500/40",
                  hoverShadow: "hover:shadow-[0_8px_40px_-12px_rgba(239,68,68,0.2)]",
                  visual: (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {['FOMO', 'Revenge', 'Stop Loss'].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-400 [html:not(.dark)_&]:text-red-500 border border-red-500/20 rounded text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                  )
                },
                {
                  icon: FiTarget,
                  title: "Psychology Tracking",
                  desc: "Rate your confidence, discipline, and emotional state for every trade. Spot patterns your mind hides from you.",
                  color: "purple",
                  accent: "from-purple-500 to-violet-500",
                  iconBg: "bg-purple-500/10 border-purple-500/20",
                  iconColor: "text-purple-400",
                  hoverBorder: "hover:border-purple-500/40",
                  hoverShadow: "hover:shadow-[0_8px_40px_-12px_rgba(168,85,247,0.2)]",
                  visual: (
                    <div className="flex items-center gap-3 mt-4">
                      {['😤', '😐', '😊', '🧘'].map((emoji, i) => (
                        <span key={i} className={`text-lg ${i === 3 ? 'opacity-100 scale-110' : 'opacity-40'} transition-all`}>{emoji}</span>
                      ))}
                    </div>
                  )
                },
                {
                  icon: FiBookOpen,
                  title: "Strategy Playbooks",
                  desc: "Document each setup with rules, conditions, and win rates. Build a personal trading encyclopedia over time.",
                  color: "blue",
                  accent: "from-blue-500 to-purple-500",
                  iconBg: "bg-blue-500/10 border-blue-500/20",
                  iconColor: "text-blue-400",
                  hoverBorder: "hover:border-blue-500/40",
                  hoverShadow: "hover:shadow-[0_8px_40px_-12px_rgba(59,130,246,0.2)]",
                  visual: (
                    <div className="flex items-center gap-2 mt-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/60 to-transparent"></div>
                      <span className="text-xs font-bold text-blue-400 tabular-nums">68.5% WR</span>
                    </div>
                  )
                },
                {
                  icon: FiImage,
                  title: "Chart Screenshots",
                  desc: "Upload before-entry, during-trade, and after-exit screenshots directly to Cloudinary. Visual proof for every trade.",
                  color: "purple",
                  accent: "from-purple-500 to-yellow-500",
                  iconBg: "bg-purple-500/10 border-purple-500/20",
                  iconColor: "text-purple-500",
                  hoverBorder: "hover:border-purple-500/40",
                  hoverShadow: "hover:shadow-[0_8px_40px_-12px_rgba(245,158,11,0.2)]",
                  visual: (
                    <div className="flex gap-2 mt-4">
                      {['HTF', 'MTF', 'LTF'].map((tf, i) => (
                        <div key={i} className="flex-1 h-8 bg-purple-500/10 [html:not(.dark)_&]:bg-purple-50 border border-purple-500/20 [html:not(.dark)_&]:border-purple-200 rounded flex items-center justify-center">
                          <span className="text-[10px] font-bold text-purple-500/70 [html:not(.dark)_&]:text-purple-600 uppercase">{tf}</span>
                        </div>
                      ))}
                    </div>
                  )
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`bg-[#1c1c1c] [html:not(.dark)_&]:bg-white rounded-2xl p-7 border border-gray-800 [html:not(.dark)_&]:border-slate-200 ${feature.hoverBorder} [html:not(.dark)_&]:hover:border-violet-200 transition-all duration-500 group relative overflow-hidden ${feature.hoverShadow} [html:not(.dark)_&]:hover:shadow-lg`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Subtle glow */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/[0.02] [html:not(.dark)_&]:from-slate-100/50 to-transparent rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 ${feature.iconBg} border rounded-xl flex items-center justify-center ${feature.iconColor} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                    {feature.visual}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= MULTI-TIMEFRAME FEATURE ================= */}
        <section className="py-24 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white border-t border-gray-800 [html:not(.dark)_&]:border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Text Content */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <span className="inline-block text-violet-500 text-sm font-bold uppercase tracking-widest mb-4">Multi-Timeframe Analysis</span>
                <h2 className="text-3xl md:text-5xl font-black text-white [html:not(.dark)_&]:text-slate-900 mb-6 tracking-tight">Master the bigger picture.</h2>
                <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg mb-8 leading-relaxed">
                  Attach multi-timeframe screenshots to align every entry with the macro trend.
                </p>
                <ul className="space-y-6">
                  {[
                    { title: "High Time Frame (HTF)", desc: "Identify the macro trend and major liquidity levels." },
                    { title: "Medium Time Frame (MTF)", desc: "Spot the structural shifts and setup formations." },
                    { title: "Low Time Frame (LTF)", desc: "Pinpoint your exact entry trigger and risk management." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                      </div>
                      <div>
                        <h4 className="text-white [html:not(.dark)_&]:text-slate-900 font-bold text-lg">{item.title}</h4>
                        <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Visual Mockups */}
              <div className="relative mt-12 lg:mt-0 flex flex-col items-center gap-8 w-full max-w-xl mx-auto perspective-[1000px]">
                
                <div className="flex flex-col sm:flex-row w-full gap-8 justify-center items-center">
                  {/* HTF Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30, y: -30, rotate: -15 }}
                    whileInView={{ opacity: 1, x: 0, y: 0, rotate: -6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full sm:w-[320px] shrink-0 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white rounded-xl border border-gray-800 [html:not(.dark)_&]:border-slate-300 shadow-xl p-3 flex flex-col transform-gpu"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-400 [html:not(.dark)_&]:text-slate-500 uppercase tracking-wider">HTF</span>
                    </div>
                    <div className="w-full aspect-[16/10] bg-black [html:not(.dark)_&]:bg-slate-50 rounded-lg border border-gray-700 [html:not(.dark)_&]:border-slate-200 overflow-hidden relative pointer-events-none opacity-80">
                      <MockChart className="w-full h-full" />
                    </div>
                  </motion.div>

                  {/* MTF Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30, y: -30, rotate: 15 }}
                    whileInView={{ opacity: 1, x: 0, y: 0, rotate: 6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full sm:w-[320px] shrink-0 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white rounded-xl border border-gray-800 [html:not(.dark)_&]:border-slate-300 shadow-xl p-3 flex flex-col transform-gpu"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-300 [html:not(.dark)_&]:text-slate-600 uppercase tracking-wider">MTF</span>
                    </div>
                    <div className="w-full aspect-[16/10] bg-black [html:not(.dark)_&]:bg-slate-50 rounded-lg border border-gray-700 [html:not(.dark)_&]:border-slate-200 overflow-hidden relative pointer-events-none opacity-90">
                      <MockChart className="w-full h-full" />
                    </div>
                  </motion.div>
                </div>

                {/* LTF Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 50, rotate: -10 }}
                  whileInView={{ opacity: 1, y: -20, rotate: -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="w-full sm:w-[320px] shrink-0 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white rounded-xl border border-gray-700 [html:not(.dark)_&]:border-slate-300 shadow-2xl p-3 flex flex-col relative group transform-gpu z-10"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-100 [html:not(.dark)_&]:text-slate-800 uppercase tracking-wider">LTF</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  </div>
                  <div className="w-full aspect-[16/10] bg-black [html:not(.dark)_&]:bg-slate-50 rounded-lg border border-gray-600 [html:not(.dark)_&]:border-slate-300 overflow-hidden relative">
                    <div className="w-full h-full pointer-events-none">
                      <MockChart className="w-full h-full" />
                    </div>
                  </div>
                </motion.div>
                
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS (STEPPER) ================= */}
        <section id="how-it-works" className="py-24 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-t border-gray-800 [html:not(.dark)_&]:border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="inline-block text-violet-500 text-sm font-bold uppercase tracking-widest mb-4">How It Works</span>
                <h2 className="text-3xl md:text-5xl font-black text-white [html:not(.dark)_&]:text-slate-900 mb-4 tracking-tight">A simple, profitable workflow</h2>
                <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg max-w-xl mx-auto">Three steps to transform your trading from emotional gambling to systematic execution.</p>
              </motion.div>
            </div>

            <div className="relative">
              {/* Connecting Line with gradient */}
              <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 hidden md:block z-0">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                
                {[
                  { icon: FiEdit3, title: "Log Your Edge", desc: "Record your setups, emotions, and upload TradingView screenshots to visualize the exact price action.", step: "01" },
                  { icon: FiPieChart, title: "Analyze Data", desc: "Let the platform automatically calculate your Win Rate, Average R:R, and Profit Factor for every strategy.", step: "02" },
                  { icon: FiTarget, title: "Master Psychology", desc: "Review your Mistake Library and Learning Notes to ensure you never repeat the same errors twice.", step: "03" }
                ].map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2, duration: 0.6 }}
                    className="flex flex-col items-center text-center bg-[#1c1c1c] [html:not(.dark)_&]:bg-white p-10 rounded-3xl border border-gray-800 [html:not(.dark)_&]:border-slate-200 hover:border-violet-500/30 transition-all duration-500 group relative overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.1)]"
                  >
                    {/* Step number */}
                    <div className="absolute top-4 right-5 text-white/5 [html:not(.dark)_&]:text-slate-900/5 text-6xl font-black select-none">{step.step}</div>
                    
                    <div className="w-16 h-16 bg-[#1c1c1c] [html:not(.dark)_&]:bg-slate-50 border-2 border-gray-700 [html:not(.dark)_&]:border-slate-200 text-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all duration-300 relative z-10">
                      <step.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-3 relative z-10">{step.title}</h3>
                    <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm leading-relaxed relative z-10">{step.desc}</p>
                  </motion.div>
                ))}

              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section id="testimonials" className="py-24 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white border-t border-gray-800 [html:not(.dark)_&]:border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="inline-block text-violet-500 text-sm font-bold uppercase tracking-widest mb-4">Testimonials</span>
                <h2 className="text-3xl md:text-5xl font-black text-white [html:not(.dark)_&]:text-slate-900 mb-4 tracking-tight">Loved by traders worldwide</h2>
                <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg max-w-xl mx-auto">See what real traders have to say about their experience.</p>
              </motion.div>
            </div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  name: "Alex Chen",
                  role: "Day Trader · 5yr",
                  quote: "This journal completely changed my approach to post-market review. The mistake library alone saved me from my worst habit — revenge trading after a loss.",
                  stars: 5,
                  avatar: "AC"
                },
                {
                  name: "Sarah Mitchell",
                  role: "Swing Trader · 3yr",
                  quote: "The multi-timeframe screenshot feature is a game changer. I can finally see the full picture of every trade I take, from HTF bias to LTF entry.",
                  stars: 5,
                  avatar: "SM"
                },
                {
                  name: "Raj Patel",
                  role: "Futures Trader · 7yr",
                  quote: "After trying 4 different journals, this is the one that stuck. The dark UI is beautiful and the analytics actually help me refine my edge over time.",
                  stars: 5,
                  avatar: "RP"
                }
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-white rounded-3xl p-8 border border-gray-800/60 [html:not(.dark)_&]:border-slate-200 relative overflow-hidden group hover:border-violet-500/20 transition-all duration-500 gradient-border hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.08)]"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-[60px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-violet-500 fill-violet-500" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-300 [html:not(.dark)_&]:text-slate-700 text-base leading-relaxed mb-8 relative z-10">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4 mt-auto relative z-10">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-white [html:not(.dark)_&]:text-slate-900 font-bold text-sm">{testimonial.name}</p>
                      <p className="text-gray-500 [html:not(.dark)_&]:text-slate-400 text-xs font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-32 relative overflow-hidden bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-t border-gray-800 [html:not(.dark)_&]:border-slate-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/10 [html:not(.dark)_&]:bg-violet-400/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
          
          {/* Floating decorative candlesticks */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-[10%] w-3 h-16 bg-green-500/10 rounded-sm animate-float"></div>
            <div className="absolute top-32 left-[12%] w-[1px] h-24 bg-green-500/10"></div>
            <div className="absolute bottom-20 right-[15%] w-3 h-12 bg-red-500/10 rounded-sm animate-float-delay"></div>
            <div className="absolute bottom-16 right-[16%] w-[1px] h-20 bg-red-500/10"></div>
            <div className="absolute top-40 right-[25%] w-3 h-20 bg-green-500/8 rounded-sm animate-float-delay-2"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-5xl md:text-6xl font-black text-white [html:not(.dark)_&]:text-slate-900 mb-6 tracking-tight">Ready to find your edge?</h2>
              <p className="text-xl text-gray-400 [html:not(.dark)_&]:text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">Join serious traders who are mastering their psychology and improving their profitability with data-driven insights.</p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-bold py-5 px-10 rounded-2xl text-xl transition-all duration-300 shadow-[0_0_50px_rgba(139,92,246,0.3)] hover:shadow-[0_0_70px_rgba(139,92,246,0.5)] hover:-translate-y-1 btn-shimmer cta-pulse"
              >
                Create Your Free Account
                <FiArrowRight />
              </Link>
              <p className="mt-6 text-gray-600 [html:not(.dark)_&]:text-slate-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-violet-500 hover:text-violet-400 font-medium transition-colors underline underline-offset-2">Log in</Link>
              </p>
            </motion.div>
          </div>
        </section>

      </main>
      
      {/* ================= FOOTER ================= */}
      <footer className="bg-[#060606] [html:not(.dark)_&]:bg-slate-100 border-t border-gray-900 [html:not(.dark)_&]:border-slate-200 mt-auto overflow-hidden">
        
        {/* Footer Columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex flex-col items-start mb-4">
                <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-base leading-none tracking-widest uppercase">TRADE</span>
                <div className="w-16 h-[3px] bg-violet-500 heartbeat-line my-[3px] rounded-full"></div>
                <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-base leading-none tracking-widest uppercase">JOURNAL</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed mt-3">The premium trading journal for serious traders. Built for performance, designed for focus.</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-gray-300 [html:not(.dark)_&]:text-slate-800 font-bold text-sm uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Features</button></li>
                <li><Link to="/gallery" className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Public Gallery</Link></li>
                <li><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">How It Works</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-gray-300 [html:not(.dark)_&]:text-slate-800 font-bold text-sm uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link to="/register" className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Login</Link></li>
                <li><button onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Testimonials</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-gray-300 [html:not(.dark)_&]:text-slate-800 font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><span className="text-gray-500 text-sm cursor-default">Privacy Policy</span></li>
                <li><span className="text-gray-500 text-sm cursor-default">Terms of Service</span></li>
                <li><span className="text-gray-500 text-sm cursor-default">Disclaimer</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant Brand Text */}
        <div className="w-full flex flex-col items-center px-4 sm:px-8 pb-4">
          <Link to="/" className="w-full flex flex-col hover:opacity-80 transition-opacity">
            <div className="flex justify-between w-full select-none items-end">
              {"TRADE JOURNAL".split('').map((char, i) => (
                char === ' ' 
                  ? <div key={i} className="w-[4vw]"></div> 
                  : <span key={i} className="text-white/[0.15] [html:not(.dark)_&]:text-slate-900/[0.10] text-[13vw] leading-[0.75] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", transform: "scaleY(1.1)" }}>{char}</span>
              ))}
            </div>
          </Link>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-900 [html:not(.dark)_&]:border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 [html:not(.dark)_&]:text-slate-400 text-sm">&copy; {new Date().getFullYear()} TradeJournal. Built for serious traders.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-400 [html:not(.dark)_&]:text-slate-400 [html:not(.dark)_&]:hover:text-slate-600 transition-colors">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-400 [html:not(.dark)_&]:text-slate-400 [html:not(.dark)_&]:hover:text-slate-600 transition-colors">
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
