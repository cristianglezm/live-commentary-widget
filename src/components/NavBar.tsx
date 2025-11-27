import React from 'react';

type SiteType = 'synergy' | 'influencer' | 'crypto' | 'football';

interface NavBarProps {
  currentSite: SiteType;
  setCurrentSite: (site: SiteType) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentSite, setCurrentSite }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/90 backdrop-blur-md border-b border-white/10 z-40 flex items-center justify-center md:justify-start px-6 space-x-2 md:pl-8">
      <span className="text-xs md:text-sm text-gray-500 font-mono uppercase mr-2 hidden md:block">Demo Selector:</span>
      
      <button 
          onClick={() => setCurrentSite('synergy')} 
          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${currentSite === 'synergy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:bg-white/5'}`}
      >
          SynergyShark
      </button>
      
      <button 
          onClick={() => setCurrentSite('influencer')} 
          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${currentSite === 'influencer' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'text-gray-400 hover:bg-white/5'}`}
      >
          InfluencerOS
      </button>
      
      <button 
          onClick={() => setCurrentSite('crypto')} 
          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all font-mono ${currentSite === 'crypto' ? 'bg-green-600 text-black shadow-lg shadow-green-500/30' : 'text-gray-400 hover:bg-white/5'}`}
      >
          DefiTofu
      </button>

      <button 
          onClick={() => setCurrentSite('football')} 
          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${currentSite === 'football' ? 'bg-white text-black shadow-lg shadow-white/30' : 'text-gray-400 hover:bg-white/5'}`}
      >
          ⚽ Football
      </button>
    </nav>
  );
};
