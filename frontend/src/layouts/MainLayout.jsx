import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdSlot from '../components/ui/AdSlot';

const MainLayout = () => {
  // Toggle this to true when you are ready to display ads
  const ADS_ENABLED = false;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Left Navigation */}
        <Sidebar />
        
        {/* Center Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <Outlet />
        </main>
        
        {/* Right Ad Rail (Visible on extra large screens) */}
        {ADS_ENABLED && (
          <aside className="hidden xl:block w-[340px] bg-gray-800/20 border-l border-gray-800 p-6">
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
