import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FiEdit3, FiPieChart, FiTarget, FiArrowRight, 
  FiActivity, FiBookOpen, FiAlertTriangle, FiTrendingUp 
} from 'react-icons/fi';
import PublicNavbar from '../components/PublicNavbar';
import MockChart from '../components/ui/MockChart';

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
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-24 overflow-hidden">
          {/* Animated Background Gradients */}
          <motion.div 
            style={{ y: yPosAnim, opacity: opacityAnim }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
          />
          <motion.div 
            style={{ y: yPosAnim, opacity: opacityAnim }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              

              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white [html:not(.dark)_&]:text-slate-900 tracking-tight mb-6 leading-[1.1] max-w-5xl">
                Elevate Your <br className="hidden md:block"/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500">
                  Trading Edge.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg md:text-xl text-gray-400 [html:not(.dark)_&]:text-slate-600 mx-auto mb-10 leading-relaxed">
                The ultimate trading journal built for serious traders. Log setups, analyze your performance, track your psychology, and stop repeating the same mistakes.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                <Link
                  to="/register"
                  className="group relative flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:shadow-[0_0_60px_rgba(234,88,12,0.5)] hover:-translate-y-1"
                >
                  Start Journaling Free
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/gallery"
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:hover:bg-slate-50 [html:not(.dark)_&]:text-slate-900 [html:not(.dark)_&]:border-slate-300 font-medium py-4 px-8 rounded-xl text-lg transition-all duration-300 backdrop-blur-sm hover:-translate-y-1"
                >
                  View Public Gallery
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= 3D DASHBOARD PREVIEW ================= */}
        <section className="relative z-20 pb-32 px-4 sm:px-6 lg:px-8 mt-10 perspective-[2000px]">
          <motion.div 
            initial={{ opacity: 0, rotateX: 20, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="max-w-6xl mx-auto"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-[#141414] [html:not(.dark)_&]:bg-white rounded-2xl border border-gray-800 [html:not(.dark)_&]:border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] [html:not(.dark)_&]:shadow-xl overflow-hidden flex flex-col relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none">
              
              {/* Window Header */}
              <div className="bg-[#1c1c1c] [html:not(.dark)_&]:bg-slate-100 border-b border-gray-800 [html:not(.dark)_&]:border-slate-200 p-4 flex items-center gap-2 relative z-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 [html:not(.dark)_&]:bg-white border border-gray-800 [html:not(.dark)_&]:border-slate-200 rounded-md px-4 py-1.5 text-xs text-gray-400 [html:not(.dark)_&]:text-slate-600 font-medium font-mono">
                  app.tradejournal.com
                </div>
              </div>

              {/* Mockup Body */}
              <div className="flex bg-[#060606] [html:not(.dark)_&]:bg-slate-50 h-[700px] relative z-10">
                {/* Sidebar */}
                <div className="w-20 border-r border-gray-800 [html:not(.dark)_&]:border-slate-200 flex-col items-center py-6 gap-6 hidden sm:flex bg-[#141414] [html:not(.dark)_&]:bg-white">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold mb-6 shadow-lg shadow-orange-500/20">TJ</div>
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
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <span className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-sm font-medium mb-2 flex items-center gap-2"><FiPieChart className="text-orange-400"/> Profit Factor</span>
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

        {/* ================= BENTO BOX FEATURES ================= */}
        <section className="py-24 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-t border-gray-800/50 [html:not(.dark)_&]:border-slate-200 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-6">Everything you need.<br/>Nothing you don't.</h2>
              <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg max-w-2xl mx-auto">A unified suite of tools designed to remove emotion from your trading and focus purely on data-driven execution.</p>
            </div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]"
            >
              {/* Box 1: Analytics (Large) */}
              <motion.div variants={fadeUp} className="md:col-span-2 md:row-span-2 bg-[#222222] [html:not(.dark)_&]:bg-white rounded-3xl p-8 border border-gray-800/60 [html:not(.dark)_&]:border-slate-200 hover:border-orange-500/30 [html:not(.dark)_&]:hover:border-orange-300 transition-all duration-300 group relative overflow-hidden flex flex-col shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] -mr-20 -mt-20 transition-all duration-500"></div>
                
                <div className="flex-1 relative z-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] group-hover:scale-110 transition-transform duration-300">
                        <FiTrendingUp size={28} />
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        +14.2% Return
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-white [html:not(.dark)_&]:text-slate-900 mb-4 tracking-tight">Deep Analytics</h3>
                    <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg leading-relaxed max-w-md">
                      Visualize your edge over time. Track equity curves, analyze win rates by session, and identify exactly which setups print money.
                    </p>
                  </div>
                  
                  {/* Highly attractive animated decorative chart */}
                  <div className="mt-12 flex gap-3 w-full h-40 items-end relative">
                    {/* Floating tooltip simulation */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                      className="absolute top-0 right-4 bg-[#1c1c1c] [html:not(.dark)_&]:bg-white border border-gray-700 [html:not(.dark)_&]:border-slate-200 px-4 py-2 rounded-xl text-white [html:not(.dark)_&]:text-slate-900 text-sm font-bold shadow-2xl z-20 flex flex-col hidden sm:flex"
                    >
                      <span className="text-gray-400 [html:not(.dark)_&]:text-slate-500 text-xs font-normal mb-1">Highest Profit Day</span>
                      <span className="text-green-400">+$2,450.00</span>
                    </motion.div>
                    
                    {[30, 50, 40, 70, 55, 85, 65, 100].map((h, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                        className="flex-1 bg-gradient-to-t from-orange-600/80 to-orange-400/80 rounded-t-lg relative overflow-hidden transition-colors border-t border-orange-300/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                      >
                         <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-lg"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Box 2: Mistakes (Medium) */}
              <motion.div variants={fadeUp} className="md:col-span-2 bg-[#222222] [html:not(.dark)_&]:bg-white rounded-3xl p-8 border border-gray-800/60 [html:not(.dark)_&]:border-slate-200 hover:border-red-500/30 transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 mb-4">
                    <FiAlertTriangle size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-2">Mistake Library</h3>
                  <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 mb-6">Stop repeating the same errors. Catalog your mistakes and build actionable solutions.</p>
                  
                  <div className="mt-auto flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium">FOMO Entry</span>
                    <span className="px-3 py-1.5 bg-gray-800 [html:not(.dark)_&]:bg-slate-100 text-gray-400 [html:not(.dark)_&]:text-slate-600 border border-gray-700 [html:not(.dark)_&]:border-slate-300 rounded-lg text-sm font-medium">Revenge Trading</span>
                    <span className="px-3 py-1.5 bg-gray-800 [html:not(.dark)_&]:bg-slate-100 text-gray-400 [html:not(.dark)_&]:text-slate-600 border border-gray-700 [html:not(.dark)_&]:border-slate-300 rounded-lg text-sm font-medium">Moved Stop Loss</span>
                  </div>
                </div>
              </motion.div>

              {/* Box 3: Psychology (Small) */}
              <motion.div variants={fadeUp} className="md:col-span-1 bg-[#222222] [html:not(.dark)_&]:bg-white rounded-3xl p-8 border border-gray-800/60 [html:not(.dark)_&]:border-slate-200 hover:border-purple-500/30 transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                    <FiTarget size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-2">Psychology</h3>
                  <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm">Track your mental state for every trade you take.</p>
                </div>
              </motion.div>

              {/* Box 4: Knowledge Base (Medium) */}
              <motion.div variants={fadeUp} className="md:col-span-1 bg-[#222222] [html:not(.dark)_&]:bg-white rounded-3xl p-8 border border-gray-800/60 [html:not(.dark)_&]:border-slate-200 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                    <FiBookOpen size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-2">Playbooks</h3>
                  <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm">Document your strategies and attach chart screenshots.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= MULTI-TIMEFRAME FEATURE ================= */}
        <section className="py-24 bg-[#141414] [html:not(.dark)_&]:bg-white border-t border-gray-800/50 [html:not(.dark)_&]:border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Text Content */}
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-6">Master the bigger picture with Multi-Timeframe Analysis.</h2>
                <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-lg mb-8 leading-relaxed">
                  A single timeframe never tells the whole story. TradeJournal allows you to attach HTF (High Time Frame), MTF (Medium Time Frame), and LTF (Low Time Frame) screenshots to every single trade.
                </p>
                <ul className="space-y-6">
                  {[
                    { title: "High Time Frame (HTF)", desc: "Identify the macro trend and major liquidity levels." },
                    { title: "Medium Time Frame (MTF)", desc: "Spot the structural shifts and setup formations." },
                    { title: "Low Time Frame (LTF)", desc: "Pinpoint your exact entry trigger and risk management." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      </div>
                      <div>
                        <h4 className="text-white [html:not(.dark)_&]:text-slate-900 font-bold text-lg">{item.title}</h4>
                        <p className="text-gray-400 [html:not(.dark)_&]:text-slate-500">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Mockups: 2 Above, 1 Below Layout with Angles */}
              <div className="relative mt-12 lg:mt-0 flex flex-col items-center gap-8 w-full max-w-xl mx-auto perspective-[1000px]">
                
                {/* Top Row: HTF & MTF */}
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

                {/* Bottom Row: LTF */}
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
        <section className="py-24 bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-t border-gray-800/50 [html:not(.dark)_&]:border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-4">A simple, profitable workflow</h2>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 [html:not(.dark)_&]:bg-slate-300 -translate-y-1/2 hidden md:block z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                
                {[
                  { icon: FiEdit3, title: "1. Log Your Edge", desc: "Record your setups, emotions, and upload TradingView screenshots to visualize the exact price action." },
                  { icon: FiPieChart, title: "2. Analyze Data", desc: "Let the platform automatically calculate your Win Rate, Average R:R, and Profit Factor for every strategy." },
                  { icon: FiTarget, title: "3. Master Psychology", desc: "Review your Mistake Library and Learning Notes to ensure you never repeat the same errors twice." }
                ].map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2, duration: 0.6 }}
                    className="flex flex-col items-center text-center bg-[#060606] [html:not(.dark)_&]:bg-white p-8 rounded-3xl border border-gray-800/50 [html:not(.dark)_&]:border-slate-200 hover:border-orange-500/30 transition-all group"
                  >
                    <div className="w-16 h-16 bg-[#1c1c1c] [html:not(.dark)_&]:bg-slate-50 border-2 border-gray-700 [html:not(.dark)_&]:border-slate-200 text-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300">
                      <step.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white [html:not(.dark)_&]:text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-gray-400 [html:not(.dark)_&]:text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}

              </div>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-32 relative overflow-hidden bg-[#060606] [html:not(.dark)_&]:bg-slate-50 border-t border-gray-800/50 [html:not(.dark)_&]:border-slate-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold text-white [html:not(.dark)_&]:text-slate-900 mb-6">Ready to find your edge?</h2>
            <p className="text-xl text-gray-400 [html:not(.dark)_&]:text-slate-600 mb-10 leading-relaxed">Join serious traders who are mastering their psychology and improving their profitability with data-driven insights.</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-3 bg-white [html:not(.dark)_&]:bg-orange-600 text-black [html:not(.dark)_&]:text-white hover:bg-gray-200 [html:not(.dark)_&]:hover:bg-orange-500 font-bold py-5 px-10 rounded-2xl text-xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1"
            >
              Create Your Free Account
              <FiArrowRight />
            </Link>
          </div>
        </section>

      </main>
      
      <footer className="bg-[#060606] [html:not(.dark)_&]:bg-slate-100 pt-16 pb-8 text-center border-t border-gray-900 [html:not(.dark)_&]:border-slate-200 mt-auto overflow-hidden">
        <div className="mb-12 w-full flex flex-col items-center">
          <Link to="/" className="w-full flex flex-col hover:opacity-80 transition-opacity px-4 sm:px-8">
            <div className="flex justify-between w-full select-none items-end">
              {"TRADE JOURNAL".split('').map((char, i) => (
                char === ' ' 
                  ? <div key={i} className="w-[4vw]"></div> 
                  : <span key={i} className="text-white [html:not(.dark)_&]:text-slate-900 text-[13vw] leading-[0.75] uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", transform: "scaleY(1.1)" }}>{char}</span>
              ))}
            </div>
          </Link>
        </div>
        <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} TradeJournal. Built for serious traders.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
