import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { TransactionType, Category, Transaction } from '../types';
import { X, Calendar, Wallet, Tag, AlignLeft } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  editTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editTransaction }) => {
  const { accounts, isDarkMode, addTransaction, updateTransaction } = useAppContext();
  
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    title: editTransaction?.title || '',
    amount: editTransaction?.amount || 0,
    type: editTransaction?.type || TransactionType.EXPENSE,
    category: editTransaction?.category || Category.FOOD,
    accountId: editTransaction?.accountId || (accounts[0]?.id || ''),
    date: editTransaction?.date || new Date().toISOString().split('T')[0],
    notes: editTransaction?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.amount <= 0 || !formData.accountId) {
      alert("Please ensure all fields are correctly filled. Amount must be greater than 0 and an account must be selected.");
      return;
    }

    if (editTransaction) {
      updateTransaction({ ...formData, id: editTransaction.id });
    } else {
      addTransaction(formData);
    }
    onClose();
  };

  const categories = Object.values(Category);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-2xl p-6 transition-all transform animate-slide-up max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black">{editTransaction ? 'Edit' : 'New'} Transaction</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: TransactionType.EXPENSE, category: Category.FOOD })}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                formData.type === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-600 shadow-sm text-red-500' : 'text-gray-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: TransactionType.INCOME, category: Category.INCOME })}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                formData.type === TransactionType.INCOME ? 'bg-white dark:bg-gray-600 shadow-sm text-green-500' : 'text-gray-500'
              }`}
            >
              Income
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount</label>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-black mr-2 opacity-30">$</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  autoFocus
                  value={formData.amount || ''}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full text-4xl font-black bg-transparent border-none focus:outline-none focus:ring-0 text-center py-4 placeholder-gray-300"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-2">
                <AlignLeft size={14} /> Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="What was it for?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-2">
                  <Tag size={14} /> Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {formData.type === TransactionType.INCOME ? (
                      <option value={Category.INCOME}>Income Source</option>
                  ) : (
                      categories.filter(c => c !== Category.INCOME).map(c => <option key={c} value={c}>{c}</option>)
                  )}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-2">
                  <Wallet size={14} /> Account
                </label>
                <select
                  required
                  value={formData.accountId}
                  onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {accounts.length > 0 ? (
                    accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))
                  ) : (
                    <option value="">Create an account first</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-2">
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                placeholder="Add more details..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={accounts.length === 0}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all mt-4 text-white disabled:opacity-50 disabled:cursor-not-allowed ${
              formData.type === TransactionType.INCOME ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {editTransaction ? 'Save Changes' : 'Add Transaction'}
          </button>
          
          {accounts.length === 0 && (
            <p className="text-[10px] text-center text-red-500 font-bold">
              You must add an account in the Accounts tab before creating a transaction.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;