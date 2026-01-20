import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { TabType } from './types';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Insights from './components/Insights';
import Settings from './components/Settings';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import TransactionForm from './components/TransactionForm';
import { Plus, Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isDarkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAddModal, setShowAddModal] = useState(false);

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home setActiveTab={setActiveTab} />;
      case 'accounts': return <Accounts />;
      case 'transactions': return <Transactions />;
      case 'budgets': return <Budgets />;
      case 'insights': return <Insights />;
      case 'settings': return <Settings setActiveTab={setActiveTab} />;
      case 'admin': return <AdminDashboard />;
      default: return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'} flex flex-col transition-colors duration-300`}>
      <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-inherit z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter">Dhanflow</h1>
          {user.isAdmin && <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Admin Control</span>}
        </div>
        <div className="flex items-center gap-4">
            <button className={`p-2 rounded-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'} relative`}>
                <Bell size={20} className="text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-inherit" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-200">
                {user.name.charAt(0).toUpperCase()}
            </div>
        </div>
      </header>

      <main className="flex-1 pb-32 overflow-x-hidden">
        <div className="max-w-md mx-auto px-6">
          {renderContent()}
        </div>
      </main>

      {/* Primary Action */}
      {activeTab !== 'settings' && activeTab !== 'admin' && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-28 right-6 w-16 h-16 bg-indigo-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-300 flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 z-20"
        >
          <Plus size={32} />
        </button>
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {showAddModal && (
        <TransactionForm onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;