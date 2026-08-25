import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#1c1c1c] dark:bg-[#1c1c1c] border-b border-gray-800/80 dark:border-gray-800/80
                    light:bg-white light:border-slate-200 h-16 flex items-center justify-between px-6
                    transition-colors duration-300
                    [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200 [html:not(.dark)_&]:shadow-sm">
      <div className="flex items-center">
        <Link to="/" className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity mt-1">
          <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">TRADE</span>
          <div className="w-[110%] h-[3px] bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)] my-[3px] rounded-full"></div>
          <span className="text-white [html:not(.dark)_&]:text-slate-900 font-black text-lg leading-none tracking-widest uppercase">JOURNAL</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
