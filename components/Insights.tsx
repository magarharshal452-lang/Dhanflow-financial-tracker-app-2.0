
import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { formatCurrency, exportToCSV } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { TransactionType } from '../types';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

const Insights: React.FC = () => {
  const { transactions, currency, isDarkMode } = useAppContext();

  const chartData = useMemo(() => {
    const months: Record<string, { month: string; income: number; expense: number }> = {};
    const last6Months = [...Array(6)].map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toISOString().slice(0, 7);
    }).reverse();

    last6Months.forEach(m => {
      months[m] = { month: m.split('-')[1], income: 0, expense: 0 };
    });

    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (months[m]) {
        if (t.type === TransactionType.INCOME) months[m].income += t.amount;
        else months[m].expense += t.amount;
      }
    });

    return Object.values(months);
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const categories: Record<string, number> = {};
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Insights & Reports</h2>
        <button
          onClick={() => exportToCSV(transactions)}
          className="flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <h3 className="text-sm font-bold mb-6">Income vs Expenses (Last 6 Months)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: isDarkMode ? '#374151' : '#F3F4F6' }} />
              <Legend verticalAlign="top" height={36} />
              <Bar name="Income" dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar name="Expense" dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <h3 className="text-sm font-bold mb-6">Category Distribution (All Time)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseByCategory}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <h3 className="text-sm font-bold mb-6">Spending Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="expense" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <FileText size={24} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-blue-900">Financial Summary</h4>
          <p className="text-xs text-blue-700">You've saved {formatCurrency(chartData.reduce((s, m) => s + (m.income - m.expense), 0), currency)} over the last 6 months.</p>
        </div>
      </div>
    </div>
  );
};

export default Insights;
