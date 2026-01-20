import { Transaction, TransactionType, Account } from '../types';

export const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateAccountBalance = (account: Account, transactions: Transaction[]) => {
  const accountTransactions = transactions.filter(t => t.accountId === account.id);
  const income = accountTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = accountTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
  
  return account.startingBalance + income - expenses;
};

export const calculateTotalBalance = (accounts: Account[], transactions: Transaction[]) => {
  return accounts.reduce((total, acc) => total + calculateAccountBalance(acc, transactions), 0);
};

export const getMonthSummary = (transactions: Transaction[], monthStr?: string) => {
  const now = new Date();
  const targetMonth = monthStr || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const monthTxs = transactions.filter(t => t.date.startsWith(targetMonth));
  const income = monthTxs.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
  const expense = monthTxs.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
  
  return { income, expense, savings: income - expense };
};

export const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Notes'];
  const rows = transactions.map(t => [
    t.date,
    t.title,
    t.type,
    t.category,
    t.amount.toString(),
    t.notes || ''
  ]);
  
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `dhanflow_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};