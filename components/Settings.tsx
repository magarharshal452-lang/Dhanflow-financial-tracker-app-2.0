
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { TabType } from '../types';
import { Moon, Sun, DollarSign, LogOut, RotateCcw, Shield, ShieldCheck, ChevronRight } from 'lucide-react';

interface SettingsProps {
  setActiveTab: (tab: TabType) => void;
}

const Settings: React.FC<SettingsProps> = ({ setActiveTab }) => {
  const { user, currency, setCurrency, isDarkMode, toggleDarkMode, resetData, logout } = useAppContext();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>

      {user?.isAdmin && (
        <button
          onClick={() => setActiveTab('admin')}
          className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <ShieldCheck size={20} />
            </div>
            <div className="text-left">
              <span className="text-sm font-bold block">Admin Control Panel</span>
              <span className="text-[10px] text-blue-100">View all registered users & system data</span>
            </div>
          </div>
          <ChevronRight size={18} />
        </button>
      )}

      <div className={`rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'} overflow-hidden`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preferences</h3>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className="text-sm font-medium">Dark Mode</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
          </div>
        </button>

        <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <DollarSign size={20} />
            </div>
            <span className="text-sm font-medium">Currency</span>
          </div>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className={`text-sm font-bold bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
              <Shield size={20} />
            </div>
            <span className="text-sm font-medium">App Lock (PIN)</span>
          </div>
          <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase">Pro</span>
        </button>
      </div>

      <div className={`rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'} overflow-hidden`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</h3>
        </div>

        <div className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
            <div className="text-[10px] text-gray-400">{user?.phone}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors border-t border-gray-100 dark:border-gray-700"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>

      <div className="pt-4">
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full flex items-center justify-center gap-2 p-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw size={16} />
            <span className="text-xs font-medium">Reset All App Data</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 animate-pulse-once">
            <p className="text-xs text-red-600 font-bold text-center mb-3">Are you sure? This will delete all accounts, transactions, and budgets permanently.</p>
            <div className="flex gap-2">
              <button
                onClick={() => { resetData(); setShowConfirmReset(false); }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 bg-white text-gray-600 rounded-lg text-xs font-bold border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-gray-400 font-medium">FinTrack Pro v1.0.0 • Made with ❤️ for your Wallet</p>
    </div>
  );
};

export default Settings;
