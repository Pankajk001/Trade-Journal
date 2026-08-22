import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdSlot = ({ adUnitId, width, height }) => {
  const { user } = useContext(AuthContext);

  // If user is premium, don't show the ad slot
  if (user?.isPremium) {
    return null;
  }

  // Placeholder for development / before ad integration
  return (
    <div 
      style={{ width, height }} 
      className="bg-[#1c1c1c]/30 border border-gray-700 border-dashed rounded flex flex-col items-center justify-center text-gray-500 text-xs shadow-inner"
    >
      <span className="font-semibold text-gray-400 mb-1">Advertisement Space</span>
      <span>{width} x {height}</span>
    </div>
  );
};

export default AdSlot;
