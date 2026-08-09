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
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <PublicNavbar />
      
      <main className="flex-1 overflow-hidden">
        
        {/* 1. Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24 text-center">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10">
            <motion.div variants={fadeUp} className="inline-block mb-4 px-4 py-1.5 rounded-full shadow-2xl shadow-black/60 border border-transparent bg-gray-800/50 text-orange-500 font-semibold text-sm">
              v2.0 is now live 🚀
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Journal your trades.<br />
              <span className="text-orange-500">Master your psychology.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto mb-10">
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
                className="bg-gray-800 hover:bg-gray-700 text-white shadow-2xl shadow-black/60 border border-transparent font-bold py-4 px-8 rounded-lg text-lg transition-all hover:scale-105"
              >
                View Public Gallery
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. Dashboard Mockup / Visualizer */}
        <section className="w-full bg-gray-900 pb-24 pt-12 relative z-10">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-black/60 border border-transparent overflow-hidden flex flex-col">
            {/* Window Header */}
            <div className="bg-gray-900 border-b border-gray-700 p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="mx-auto bg-gray-800 rounded px-4 py-1 text-xs text-gray-500">app.tradejournal.com</div>
            </div>
            {/* Mockup Body */}
            <div className="flex bg-gray-900 h-[500px]">
              {/* Sidebar */}
              <div className="w-16 border-r border-gray-700 flex-col items-center py-6 gap-6 hidden sm:flex">
                <div className="w-8 h-8 rounded bg-gray-800 mb-4"></div>
                <div className="w-8 h-8 rounded bg-orange-600/20 border border-orange-600/50 flex items-center justify-center"></div>
                <div className="w-8 h-8 rounded bg-gray-800"></div>
                <div className="w-8 h-8 rounded bg-gray-800"></div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                {/* Metrics */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-800 h-24 rounded-xl shadow-2xl shadow-black/60 border border-transparent flex flex-col justify-center px-6 shadow-sm">
                    <span className="text-gray-400 text-sm mb-1">Win Rate</span>
                    <span className="text-2xl font-bold text-white">68.5%</span>
                  </div>
                  <div className="flex-1 bg-gray-800 h-24 rounded-xl shadow-2xl shadow-black/60 border border-transparent flex flex-col justify-center px-6 shadow-sm">
                    <span className="text-gray-400 text-sm mb-1">Profit Factor</span>
                    <span className="text-2xl font-bold text-green-500">2.14</span>
                  </div>
                  <div className="flex-1 bg-gray-800 h-24 rounded-xl shadow-2xl shadow-black/60 border border-transparent flex-col justify-center px-6 hidden md:flex shadow-sm">
                    <span className="text-gray-400 text-sm mb-1">Total PnL</span>
                    <span className="text-2xl font-bold text-white">$14,250</span>
                  </div>
                </div>

                {/* Chart and Activity */}
                <div className="flex gap-6 flex-1 min-h-0">
                  {/* Chart */}
                  <div className="flex-[2] bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden flex flex-col shadow-sm">
                    {/* Real Candlestick Chart */}
                    <MockChart />
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="flex-1 bg-gray-800 rounded-xl shadow-2xl shadow-black/60 border border-transparent p-5 hidden lg:flex flex-col gap-5 shadow-sm">
                    <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex justify-center items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1">
                        <div className="w-full h-2.5 bg-gray-600 rounded mb-2"></div>
                        <div className="w-1/2 h-2 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-500/10 border border-red-500/30 flex justify-center items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      </div>
                      <div className="flex-1">
                        <div className="w-3/4 h-2.5 bg-gray-600 rounded mb-2"></div>
                        <div className="w-1/3 h-2 bg-gray-700 rounded"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-green-500/10 border border-green-500/30 flex justify-center items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1">
                        <div className="w-full h-2.5 bg-gray-600 rounded mb-2"></div>
                        <div className="w-1/2 h-2 bg-gray-700 rounded"></div>
                      </div>
                    </div>
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
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">A simple, repeatable workflow to turn your data into a profitable trading edge.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-10 text-center bg-gray-800/50 p-8 rounded-2xl shadow-2xl shadow-black/60 border border-transparent hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:bg-gray-800 transition-all duration-300">
              <motion.div variants={fadeUp} className="w-20 h-20 mx-auto bg-gray-900 border border-gray-700 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <FiEdit3 size={36} />
              </motion.div>
              <motion.h3 variants={fadeUp} className="text-xl font-bold text-white mb-3">Log Your Edge</motion.h3>
              <motion.p variants={fadeUp} className="text-gray-400 text-sm leading-relaxed">Record your entries, exits, emotions, and upload TradingView screenshots to visual the exact setup.</motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-10 text-center bg-gray-800/50 p-8 rounded-2xl shadow-2xl shadow-black/60 border border-transparent hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:bg-gray-800 transition-all duration-300">
              <motion.div variants={fadeUp} className="w-20 h-20 mx-auto bg-gray-900 border border-gray-700 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <FiPieChart size={36} />
              </motion.div>
              <motion.h3 variants={fadeUp} className="text-xl font-bold text-white mb-3">Analyze the Data</motion.h3>
              <motion.p variants={fadeUp} className="text-gray-400 text-sm leading-relaxed">Let the platform automatically calculate your Win Rate, Average R:R, and Profit Factor for every strategy.</motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-10 text-center bg-gray-800/50 p-8 rounded-2xl shadow-2xl shadow-black/60 border border-transparent hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:bg-gray-800 transition-all duration-300">
              <motion.div variants={fadeUp} className="w-20 h-20 mx-auto bg-gray-900 border border-gray-700 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <FiTarget size={36} />
              </motion.div>
              <motion.h3 variants={fadeUp} className="text-xl font-bold text-white mb-3">Master Psychology</motion.h3>
              <motion.p variants={fadeUp} className="text-gray-400 text-sm leading-relaxed">Review your Mistake Library and Learning Notes to ensure you never repeat the same errors twice.</motion.p>
            </motion.div>
          </div>
        </section>

        {/* 5. Feature Highlights */}
        <section className="bg-gray-800 py-24 border-t border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <motion.div variants={fadeUp} className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors group overflow-hidden flex flex-col">
                <div className="h-48 w-full relative overflow-hidden">
                  <img src="/images/feature_analytics_1786261722240.png" alt="Deep Analytics" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>
                <div className="p-8 pt-2">
                  <h3 className="text-2xl font-bold text-white mb-3">Deep Analytics</h3>
                  <p className="text-gray-400 leading-relaxed">Automatically calculate your win rate, profit factor, and average R:R based on specific sessions and strategies. Know exactly what works.</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUp} className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors group overflow-hidden flex flex-col">
                <div className="h-48 w-full relative overflow-hidden">
                  <img src="/images/feature_mistakes_1786261738029.png" alt="Mistake Library" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>
                <div className="p-8 pt-2">
                  <h3 className="text-2xl font-bold text-white mb-3">Mistake Library</h3>
                  <p className="text-gray-400 leading-relaxed">Stop repeating the same errors. Catalog your mistakes, track their frequency, and build actionable solutions to avoid them in the future.</p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUp} className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-colors group overflow-hidden flex flex-col">
                <div className="h-48 w-full relative overflow-hidden">
                  <img src="/images/feature_knowledge_1786261754482.png" alt="Knowledge Base" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>
                <div className="p-8 pt-2">
                  <h3 className="text-2xl font-bold text-white mb-3">Knowledge Base</h3>
                  <p className="text-gray-400 leading-relaxed">Keep all your trading education, setups, and notes organized in one Notion-style library. Attach screenshots directly to your notes.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 6. Final CTA */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Ready to find your edge?</h2>
            <p className="text-xl text-gray-400 mb-10">Join serious traders who are mastering their psychology and improving their profitability with TradeJournal.</p>
            <Link
              to="/register"
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all shadow-xl shadow-orange-500/20 hover:scale-105"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>

      </main>
      
      <footer className="bg-gray-900 py-8 text-center border-t border-gray-800 mt-auto">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} TradeJournal. Built for serious traders.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
