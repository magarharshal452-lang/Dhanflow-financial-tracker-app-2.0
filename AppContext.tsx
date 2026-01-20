import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, User, Account, Transaction, Budget } from './types';

interface AppContextType extends AppState {
  login: (email: string, name: string, phone: string) => void;
  logout: () => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  setCurrency: (currency: string) => void;
  toggleDarkMode: () => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('dhanflow_state');
    const globalUsers = localStorage.getItem('dhanflow_global_users');
    
    const initialState = saved ? JSON.parse(saved) : {
      user: null,
      accounts: [],
      transactions: [],
      budgets: [],
      currency: 'INR',
      isDarkMode: false,
    };

    return {
      ...initialState,
      registeredUsers: globalUsers ? JSON.parse(globalUsers) : []
    };
  });

  useEffect(() => {
    const { registeredUsers, ...localState } = state;
    localStorage.setItem('dhanflow_state', JSON.stringify(localState));
    localStorage.setItem('dhanflow_global_users', JSON.stringify(state.registeredUsers));
  }, [state]);

  const login = (email: string, name: string, phone: string) => {
    const isAdmin = email.toLowerCase() === 'admin@dhanflow.in';
    const newUser: User = { 
      id: Date.now().toString(), 
      email, 
      name, 
      phone, 
      joinedAt: new Date().toLocaleDateString('en-IN'),
      isAdmin 
    };

    setState(prev => {
      const userExists = prev.registeredUsers.find(u => u.email === email);
      const updatedUsers = userExists 
        ? prev.registeredUsers.map(u => u.email === email ? { ...u, name, phone } : u)
        : [...prev.registeredUsers, newUser];

      return { 
        ...prev, 
        user: newUser,
        registeredUsers: updatedUsers
      };
    });
  };

  const logout = () => {
    setState(prev => ({ ...prev, user: null }));
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    setState(prev => ({
      ...prev,
      accounts: [...prev.accounts, { ...acc, id: Math.random().toString(36).substr(2, 9) }]
    }));
  };

  const updateAccount = (acc: Account) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(a => a.id === acc.id ? acc : a)
    }));
  };

  const deleteAccount = (id: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(a => a.id !== id),
      transactions: prev.transactions.filter(t => t.accountId !== id)
    }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, { ...tx, id: Math.random().toString(36).substr(2, 9) }]
    }));
  };

  const updateTransaction = (tx: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === tx.id ? tx : t)
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addBudget = (b: Omit<Budget, 'id'>) => {
    setState(prev => ({
      ...prev,
      budgets: [...prev.budgets, { ...b, id: Math.random().toString(36).substr(2, 9) }]
    }));
  };

  const updateBudget = (b: Budget) => {
    setState(prev => ({
      ...prev,
      budgets: prev.budgets.map(i => i.id === b.id ? b : i)
    }));
  };

  const deleteBudget = (id: string) => {
    setState(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.id !== id)
    }));
  };

  const setCurrency = (currency: string) => setState(prev => ({ ...prev, currency }));
  const toggleDarkMode = () => setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  const resetData = () => {
    setState(prev => ({
      ...prev,
      accounts: [],
      transactions: [],
      budgets: [],
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login, logout, addAccount, updateAccount, deleteAccount,
      addTransaction, updateTransaction, deleteTransaction,
      addBudget, updateBudget, deleteBudget,
      setCurrency, toggleDarkMode, resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};