import React from 'react';
import { Home, Wallet, History, Target, TrendingUp, Settings } from 'lucide-react';
import { TabType } from '../types';
import { useAppContext } from '../AppContext';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { isDarkMode } = useAppContext();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Dhan', icon: <Home size={22} /> },
    { id: 'accounts', label: 'Vault', icon: <Wallet size={22} /> },
    { id: 'transactions', label: 'Flow', icon: <History size={22} /> },
    { id: 'budgets', label: 'Focus', icon: <Target size={22} /> },
    { id: 'insights', label: 'Trends', icon: <TrendingUp size={22} /> },
    { id: 'settings', label: 'Admin', icon: <Settings size={22} /> },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-xl border-t px-2 pb-6 pt-3 flex justify-around items-center z-30 transition-all`}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center space-y-1.5 flex-1 transition-all relative ${
            activeTab === item.id ? 'text-indigo-600 scale-110' : isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {activeTab === item.id && (
              <span className="absolute -top-2 w-1 h-1 bg-indigo-600 rounded-full animate-pulse" />
          )}
          {item.icon}
          <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;