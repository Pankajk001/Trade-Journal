import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#060606] [html:not(.dark)_&]:bg-slate-100 border-t border-gray-900 [html:not(.dark)_&]:border-slate-200 mt-auto overflow-hidden">
      
      {/* Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
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
              <li><a href="/#features" className="cursor-pointer text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Features</a></li>
              <li><Link to="/gallery" className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Public Gallery</Link></li>
              <li><a href="/#how-it-works" className="cursor-pointer text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-gray-300 [html:not(.dark)_&]:text-slate-800 font-bold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link to="/register" className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Login</Link></li>
              <li><a href="/#testimonials" className="cursor-pointer text-gray-500 hover:text-gray-300 [html:not(.dark)_&]:text-slate-500 [html:not(.dark)_&]:hover:text-slate-700 text-sm transition-colors">Testimonials</a></li>
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
      <div className="border-t border-gray-900 [html:not(.dark)_&]:border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 [html:not(.dark)_&]:text-slate-400 text-sm">&copy; {new Date().getFullYear()} TradeJournal. Built for serious traders.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="cursor-pointer text-gray-600 hover:text-gray-400 [html:not(.dark)_&]:text-slate-400 [html:not(.dark)_&]:hover:text-slate-600 transition-colors">
              <FiTwitter className="w-4 h-4" />
            </a>
            <a href="#" className="cursor-pointer text-gray-600 hover:text-gray-400 [html:not(.dark)_&]:text-slate-400 [html:not(.dark)_&]:hover:text-slate-600 transition-colors">
              <FiGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
