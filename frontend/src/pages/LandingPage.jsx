import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit3, FiPieChart, FiTarget } from 'react-icons/fi';
import PublicNavbar from '../components/PublicNavbar';
import MockChart from '../components/ui/MockChart';

const LandingPage = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300
                    bg-gray-900 [html:not(.dark)_&]:bg-white">
      <PublicNavbar />
      
      <main className="flex-1 overflow-hidden">
        
        {/* 1. Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 text-center">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10">
            <motion.div variants={fadeUp} className="inline-block mb-4 px-4 py-1.5 rounded-full border font-semibold text-sm text-orange-500
                                                      bg-gray-800/50 border-gray-700
                                                      [html:not(.dark)_&]:bg-orange-50 [html:not(.dark)_&]:border-orange-200">
              v2.0 is now live 🚀
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight
                                                     text-white [html:not(.dark)_&]:text-slate-900">
              Journal your trades.<br />
              <span className="text-orange-500">Master your psychology.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-xl mx-auto mb-10
                                                    text-gray-400 [html:not(.dark)_&]:text-slate-500">
              The ultimate trading journal built for serious traders. Log setups, analyze your performance, track your mistakes, and build a profitable edge.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all shadow-lg shadow-orange-500/20 hover:scale-105"
              >
                Start Journaling Free
              </Link>
              <Link
                to="/gallery"
                className="font-bold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105 border
                           bg-gray-800 hover:bg-gray-700 text-white border-gray-700
                           [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:hover:bg-slate-200 [html:not(.dark)_&]:text-slate-800 [html:not(.dark)_&]:border-slate-200"
              >
                View Public Gallery
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. Dashboard Mockup */}
        <section className="w-full pb-24 pt-12 relative z-10 transition-colors duration-300
                            bg-gray-900 [html:not(.dark)_&]:bg-slate-50">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="rounded-2xl shadow-2xl border overflow-hidden flex flex-col
                            bg-gray-800 border-gray-700 shadow-black/60
                            [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-slate-300/60">
              {/* Window Header */}
              <div className="border-b p-3 flex items-center gap-2
                              bg-gray-900 border-gray-700 [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:border-slate-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="mx-auto rounded px-4 py-1 text-xs
                                bg-gray-800 text-gray-500 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:text-slate-400">app.tradejournal.com</div>
              </div>
              {/* Mockup Body */}
              <div className="flex h-[500px] bg-gray-900 [html:not(.dark)_&]:bg-slate-50">
                {/* Sidebar */}
                <div className="w-16 border-r border-gray-700 flex-col items-center py-6 gap-6 hidden sm:flex
                                [html:not(.dark)_&]:border-slate-200">
                  <div className="w-8 h-8 rounded bg-gray-800 mb-4 [html:not(.dark)_&]:bg-slate-200"></div>
                  <div className="w-8 h-8 rounded bg-orange-600/20 border border-orange-600/50 flex items-center justify-center"></div>
                  <div className="w-8 h-8 rounded bg-gray-800 [html:not(.dark)_&]:bg-slate-200"></div>
                  <div className="w-8 h-8 rounded bg-gray-800 [html:not(.dark)_&]:bg-slate-200"></div>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                  {/* Metrics */}
                  <div className="flex gap-4">
                    <div className="flex-1 h-24 rounded-xl flex flex-col justify-center px-6 shadow-sm border
                                    bg-gray-800 border-gray-700 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
                      <span className="text-gray-400 text-sm mb-1 [html:not(.dark)_&]:text-slate-500">Win Rate</span>
                      <span className="text-2xl font-bold text-white [html:not(.dark)_&]:text-slate-900">68.5%</span>
                    </div>
                    <div className="flex-1 h-24 rounded-xl flex flex-col justify-center px-6 shadow-sm border
                                    bg-gray-800 border-gray-700 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
                      <span className="text-gray-400 text-sm mb-1 [html:not(.dark)_&]:text-slate-500">Profit Factor</span>
                      <span className="text-2xl font-bold text-green-500">2.14</span>
                    </div>
                    <div className="flex-1 h-24 rounded-xl flex-col justify-center px-6 hidden md:flex shadow-sm border
                                    bg-gray-800 border-gray-700 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
                      <span className="text-gray-400 text-sm mb-1 [html:not(.dark)_&]:text-slate-500">Total PnL</span>
                      <span className="text-2xl font-bold text-white [html:not(.dark)_&]:text-slate-900">$14,250</span>
                    </div>
                  </div>

                  {/* Chart and Activity */}
                  <div className="flex gap-6 flex-1 min-h-0">
                    <div className="flex-[2] rounded-xl border relative overflow-hidden flex flex-col shadow-sm
                                    bg-gray-900 border-gray-700 [html:not(.dark)_&]:bg-slate-100 [html:not(.dark)_&]:border-slate-200">
                      <MockChart />
                    </div>
                    <div className="flex-1 rounded-xl p-5 hidden lg:flex flex-col gap-5 shadow-sm border
                                    bg-gray-800 border-gray-700 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
                      <div className="w-24 h-4 rounded mb-2 bg-gray-700 [html:not(.dark)_&]:bg-slate-200"></div>
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded border flex justify-center items-center ${i === 2 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                            <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          </div>
                          <div className="flex-1">
                            <div className="w-full h-2.5 rounded mb-2 bg-gray-600 [html:not(.dark)_&]:bg-slate-200"></div>
                            <div className="w-1/2 h-2 rounded bg-gray-700 [html:not(.dark)_&]:bg-slate-100"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. How It Works */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white [html:not(.dark)_&]:text-slate-900">How it works</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 [html:not(.dark)_&]:text-slate-500">A simple, repeatable workflow to turn your data into a profitable trading edge.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { icon: <FiEdit3 size={36} />, title: 'Log Your Edge', desc: 'Record your entries, exits, emotions, and upload TradingView screenshots to visualize the exact setup.' },
              { icon: <FiPieChart size={36} />, title: 'Analyze the Data', desc: 'Let the platform automatically calculate your Win Rate, Average R:R, and Profit Factor for every strategy.' },
              { icon: <FiTarget size={36} />, title: 'Master Psychology', desc: 'Review your Mistake Library and Learning Notes to ensure you never repeat the same errors twice.' },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                className="relative z-10 text-center p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2
                           bg-gray-800/50 border-gray-700 hover:bg-gray-800 shadow-black/60
                           [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:hover:bg-slate-50 [html:not(.dark)_&]:shadow-slate-200/80 shadow-xl">
                <motion.div variants={fadeUp} className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner border text-orange-500
                                                          bg-gray-900 border-gray-700 [html:not(.dark)_&]:bg-orange-50 [html:not(.dark)_&]:border-orange-100">
                  {item.icon}
                </motion.div>
                <motion.h3 variants={fadeUp} className="text-xl font-bold mb-3 text-white [html:not(.dark)_&]:text-slate-900">{item.title}</motion.h3>
                <motion.p variants={fadeUp} className="text-sm leading-relaxed text-gray-400 [html:not(.dark)_&]:text-slate-500">{item.desc}</motion.p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Feature Highlights */}
        <section className="py-24 border-t border-b transition-colors duration-300
                            bg-gray-800 border-gray-700 [html:not(.dark)_&]:bg-slate-50 [html:not(.dark)_&]:border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {[
                { img: '/images/feature_analytics_1786261722240.png', title: 'Deep Analytics', desc: 'Automatically calculate your win rate, profit factor, and average R:R based on specific sessions and strategies. Know exactly what works.' },
                { img: '/images/feature_mistakes_1786261738029.png', title: 'Mistake Library', desc: 'Stop repeating the same errors. Catalog your mistakes, track their frequency, and build actionable solutions to avoid them in the future.' },
                { img: '/images/feature_knowledge_1786261754482.png', title: 'Knowledge Base', desc: 'Keep all your trading education, setups, and notes organized in one Notion-style library. Attach screenshots directly to your notes.' },
              ].map((feat, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="rounded-2xl border hover:border-orange-500/50 transition-colors group overflow-hidden flex flex-col
                             bg-gray-900 border-gray-800 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
                  <div className="h-48 w-full relative overflow-hidden">
                    <img src={feat.img} alt={feat.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent [html:not(.dark)_&]:from-white/80 [html:not(.dark)_&]:via-transparent"></div>
                  </div>
                  <div className="p-8 pt-2">
                    <h3 className="text-2xl font-bold mb-3 text-white [html:not(.dark)_&]:text-slate-900">{feat.title}</h3>
                    <p className="leading-relaxed text-gray-400 [html:not(.dark)_&]:text-slate-500">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 6. Final CTA */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white [html:not(.dark)_&]:text-slate-900">Ready to find your edge?</h2>
            <p className="text-xl mb-10 text-gray-400 [html:not(.dark)_&]:text-slate-500">Join serious traders who are mastering their psychology and improving their profitability with TradeJournal.</p>
            <Link
              to="/register"
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all shadow-xl shadow-orange-500/20 hover:scale-105"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>

      </main>
      
      <footer className="py-8 text-center border-t mt-auto transition-colors duration-300
                         bg-gray-900 border-gray-800 [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
        <p className="text-gray-500 [html:not(.dark)_&]:text-slate-400">&copy; {new Date().getFullYear()} TradeJournal. Built for serious traders.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
