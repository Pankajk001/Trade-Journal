import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdSlot from '../components/ui/AdSlot';

const MainLayout = () => {
  // Toggle this to true when you are ready to display ads
  const ADS_ENABLED = false;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300
                    bg-gray-900
                    [html:not(.dark)_&]:bg-slate-100">
      <Navbar />
      <div className="flex flex-1">
        {/* Left Navigation */}
        <Sidebar />
        
        {/* Center Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto transition-colors duration-300
                         bg-gray-900
                         [html:not(.dark)_&]:bg-slate-100">
          <Outlet />
        </main>
        
        {/* Right Ad Rail (Visible on extra large screens) */}
        {ADS_ENABLED && (
          <aside className="hidden xl:block w-[340px] border-l p-6
                            bg-gray-800/20 border-gray-800
                            [html:not(.dark)_&]:bg-white/50 [html:not(.dark)_&]:border-slate-200">
            <div className="sticky top-6 flex flex-col gap-6">
              <AdSlot adUnitId="right-rail-top" width="300px" height="250px" />
              <AdSlot adUnitId="right-rail-bottom" width="300px" height="600px" />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
