
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { TransactionType, Category } from '../types';
import { formatCurrency } from '../utils/helpers';
import { Filter, Search, ChevronDown, Calendar, Wallet, Tag } from 'lucide-react';

const Transactions: React.FC = () => {
  const { transactions, accounts, currency, isDarkMode } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [catFilter, setCatFilter] = useState<'ALL' | Category>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
      const matchesCat = catFilter === 'ALL' || t.category === catFilter;
      return matchesSearch && matchesType && matchesCat;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, typeFilter, catFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sticky top-[72px] bg-inherit pb-2 z-10">
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-full border text-xs font-semibold whitespace-nowrap ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} focus:outline-none`}
          >
            <option value="ALL">All Types</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expenses</option>
          </select>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-full border text-xs font-semibold whitespace-nowrap ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} focus:outline-none`}
          >
            <option value="ALL">All Categories</option>
            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.map(tx => {
          const account = accounts.find(a => a.id === tx.accountId);
          return (
            <div key={tx.id} className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {tx.type === 'INCOME' ? <Tag size={18} /> : <Tag size={18} />}
                </div>
                <div>
                  <div className="text-sm font-bold truncate max-w-[120px]">{tx.title}</div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Calendar size={10} /> {tx.date} • <Wallet size={10} /> {account?.name || 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${tx.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                </div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{tx.category}</div>
              </div>
            </div>
          );
        })}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <Search size={48} className="mx-auto mb-4" />
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
