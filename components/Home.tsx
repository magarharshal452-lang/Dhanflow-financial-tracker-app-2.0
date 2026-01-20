import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { formatCurrency, calculateTotalBalance, getMonthSummary } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TabType, TransactionType } from '../types';
import { ArrowUpCircle, ArrowDownCircle, IndianRupee, LayoutGrid, Zap } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#3b82f6'];

const Home: React.FC<{ setActiveTab: (tab: TabType) => void }> = ({ setActiveTab }) => {
  const { accounts, transactions, currency, isDarkMode } = useAppContext();

  const totalBalance = useMemo(() => calculateTotalBalance(accounts, transactions), [accounts, transactions]);
  const monthSummary = useMemo(() => getMonthSummary(transactions), [transactions]);

  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(t => {
      const isThisMonth = t.date.startsWith(new Date().toISOString().slice(0, 7));
      return t.type === 'EXPENSE' && isThisMonth;
    });
    const categories: Record<string, number> = {};
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const dailySpending = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const amount = transactions
        .filter(t => t.date.startsWith(date) && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      return { date: date.slice(8, 10), amount };
    });
  }, [transactions]);

  return (
    <div className="space-y-6 pb-4">
      {/* Wealth Mesh Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-8 mesh-gradient text-white shadow-2xl shadow-indigo-200 animate-scale-in">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <IndianRupee size={120} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold uppercase tracking-[0.2em]">
                <Zap size={14} className="text-amber-400 fill-amber-400" /> My Net Worth
            </div>
            <div className="text-5xl font-extrabold mt-3 tracking-tighter drop-shadow-lg">
                {formatCurrency(totalBalance, currency)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-black uppercase">
                        <ArrowUpCircle size={14} /> Earnings
                    </div>
                    <div className="text-lg font-bold mt-1 tracking-tight">
                        {formatCurrency(monthSummary.income, currency)}
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-1.5 text-rose-300 text-[10px] font-black uppercase">
                        <ArrowDownCircle size={14} /> Spends
                    </div>
                    <div className="text-lg font-bold mt-1 tracking-tight">
                        {formatCurrency(monthSummary.expense, currency)}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-5 rounded-[2rem] border glass animate-slide-up ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-100'}`}>
          <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
            <LayoutGrid size={12} /> Categories
          </h3>
          <div className="h-40">
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-[10px] italic">No data</div>
            )}
          </div>
        </div>

        <div className={`p-5 rounded-[2rem] border glass animate-slide-up ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'border-slate-100'}`} style={{ animationDelay: '0.1s' }}>
          <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-4">Spending Heat</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpending}>
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Tooltip cursor={{ fill: 'transparent' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Flow */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-slate-800 dark:text-white">Recent Flow</h3>
          <button onClick={() => setActiveTab('transactions')} className="text-xs text-indigo-600 font-bold px-3 py-1 bg-indigo-50 rounded-full">See All</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 4).map(tx => (
            <div key={tx.id} className={`p-4 rounded-3xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm shadow-slate-200/50'} flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {tx.type === 'INCOME' ? <ArrowUpCircle size={22} /> : <ArrowDownCircle size={22} />}
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight">{tx.title}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{tx.category} • {tx.date}</div>
                </div>
              </div>
              <div className={`text-sm font-black ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm font-medium italic bg-white rounded-3xl border border-dashed border-slate-200">Start your flow by adding a transaction</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;