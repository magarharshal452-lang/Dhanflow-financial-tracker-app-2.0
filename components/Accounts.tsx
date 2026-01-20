
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { AccountType } from '../types';
import { formatCurrency, calculateAccountBalance } from '../utils/helpers';
import { Plus, Trash2, Edit3, Landmark, Wallet, CreditCard, Coins, X } from 'lucide-react';

const Accounts: React.FC = () => {
  const { accounts, transactions, currency, isDarkMode, addAccount, updateAccount, deleteAccount } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', type: AccountType.CASH, startingBalance: 0 });

  const totalBalance = accounts.reduce((sum, acc) => sum + calculateAccountBalance(acc, transactions), 0);

  const getIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK: return <Landmark size={20} />;
      case AccountType.CARD: return <CreditCard size={20} />;
      case AccountType.WALLET: return <Wallet size={20} />;
      case AccountType.CASH: return <Coins size={20} />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingAccount) {
      const existing = accounts.find(a => a.id === editingAccount);
      if (existing) {
        updateAccount({ ...existing, ...formData });
      }
    } else {
      addAccount(formData);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormData({ name: '', type: AccountType.CASH, startingBalance: 0 });
  };

  const startEdit = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (acc) {
      setFormData({ name: acc.name, type: acc.type, startingBalance: acc.startingBalance });
      setEditingAccount(id);
      setShowModal(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Accounts</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="text-gray-500 text-xs font-medium uppercase">Net Liquidity</div>
        <div className="text-2xl font-bold mt-1">{formatCurrency(totalBalance, currency)}</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accounts.map(acc => {
          const balance = calculateAccountBalance(acc, transactions);
          return (
            <div key={acc.id} className={`p-4 rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'} flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-blue-500`}>
                  {getIcon(acc.type)}
                </div>
                <div>
                  <div className="font-bold text-sm">{acc.name}</div>
                  <div className="text-xs text-gray-500">{acc.type}</div>
                  <div className="text-lg font-bold mt-1 text-blue-600">{formatCurrency(balance, currency)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(acc.id)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => deleteAccount(acc.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {accounts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Landmark size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm">No accounts added yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-2xl p-6 transition-all transform animate-slide-up`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editingAccount ? 'Edit Account' : 'Add Account'}</h3>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Primary Checking"
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as AccountType })}
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {Object.values(AccountType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Balance</label>
                  <input
                    type="number"
                    required
                    value={formData.startingBalance}
                    onChange={e => setFormData({ ...formData, startingBalance: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all mt-4"
              >
                {editingAccount ? 'Save Changes' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
