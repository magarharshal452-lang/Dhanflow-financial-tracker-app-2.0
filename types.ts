
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum AccountType {
  CASH = 'CASH',
  BANK = 'BANK',
  WALLET = 'WALLET',
  CARD = 'CARD'
}

export enum Category {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  BILLS = 'Bills',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  ENTERTAINMENT = 'Entertainment',
  INCOME = 'Income Source',
  OTHER = 'Other'
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  startingBalance: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: Category;
  accountId: string;
  date: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  month: string; // YYYY-MM format
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  joinedAt: string;
  isAdmin?: boolean;
}

export type TabType = 'home' | 'accounts' | 'transactions' | 'budgets' | 'insights' | 'settings' | 'admin';

export interface AppState {
  user: User | null;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  currency: string;
  isDarkMode: boolean;
  registeredUsers: User[]; // Mock backend user list
}
