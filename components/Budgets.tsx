
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { Category, Budget } from '../types';
import { formatCurrency } from '../utils/helpers';
import { Plus, X, Trash2, Edit3, AlertCircle } from 'lucide-react';

const Budgets: React.FC = () => {
  const { budgets, transactions, currency, isDarkMode, addBudget, updateBudget, deleteBudget } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const [formData, setFormData] = useState({
    category: Category.FOOD,
    limit: 0,
    month: currentMonth
  });

  const budgetProgress = useMemo(() => {
    return budgets.map(b => {
      const spent = transactions
        .filter(t => t.category === b.category && t.date.startsWith(b.month) && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      const percent = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      return { ...b, spent, percent };
    });
  }, [budgets, transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBudget({ ...formData, id: editingId });
    } else {
      addBudget(formData);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ category: Category.FOOD, limit: 0, month: currentMonth });
  };

  const startEdit = (b: Budget) => {
    setFormData({ category: b.category, limit: b.limit, month: b.month });
    setEditingId(b.id);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Monthly Budgets</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> New Budget
        </button>
      </div>

      <div className="space-y-4">
        {budgetProgress.map(b => (
          <div key={b.id} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-sm">{b.category}</h4>
                <p className="text-[10px] text-gray-500 uppercase">{b.month}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(b)} className="p-1.5 text-gray-400 hover:text-blue-500">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => deleteBudget(b.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-end mb-1">
              <div className="text-xs">
                <span className="font-bold">{formatCurrency(b.spent, currency)}</span>
                <span className="text-gray-400"> of {formatCurrency(b.limit, currency)}</span>
              </div>
              <div className={`text-xs font-bold ${b.percent >= 100 ? 'text-red-500' : b.percent >= 80 ? 'text-orange-500' : 'text-blue-500'}`}>
                {b.percent.toFixed(0)}%
              </div>
            </div>

            <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} overflow-hidden`}>
              <div
                className={`h-full transition-all duration-500 ${b.percent >= 100 ? 'bg-red-500' : b.percent >= 80 ? 'bg-orange-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(b.percent, 100)}%` }}
              />
            </div>

            {b.percent >= 80 && (
              <div className={`mt-3 flex items-center gap-2 p-2 rounded-lg text-[10px] font-medium ${b.percent >= 100 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                <AlertCircle size={14} />
                {b.percent >= 100 ? 'Budget exceeded!' : 'Almost there (80%+)'}
              </div>
            )}
          </div>
        ))}

        {budgetProgress.length === 0 && (
          <div className="text-center py-20 opacity-30 italic text-sm">No budgets set for this month</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-2xl p-6 transition-all transform animate-slide-up`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Budget' : 'Add Budget'}</h3>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {Object.values(Category).filter(c => c !== Category.INCOME).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Limit</label>
                  <input
                    type="number"
                    required
                    value={formData.limit}
                    onChange={e => setFormData({ ...formData, limit: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Month</label>
                  <input
                    type="month"
                    required
                    value={formData.month}
                    onChange={e => setFormData({ ...formData, month: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all mt-4"
              >
                {editingId ? 'Update Budget' : 'Create Budget'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
