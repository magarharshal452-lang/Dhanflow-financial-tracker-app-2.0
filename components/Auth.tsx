import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { IndianRupee, Phone, AlertCircle, Zap } from 'lucide-react';

const Auth: React.FC = () => {
  const { login } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', name: '', password: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.email.toLowerCase() === 'admin@dhanflow.in') {
      if (formData.password !== 'admin123') {
        setError('Invalid admin password. (Hint: admin123)');
        return;
      }
    }

    if (formData.email) {
      login(formData.email, formData.name || 'User', formData.phone || 'N/A');
    }
  };

  return (
    <div className="min-h-screen mesh-gradient flex flex-col items-center justify-center p-8 text-white">
      <div className="mb-12 text-center animate-scale-in">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20">
          <IndianRupee size={48} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter">Dhanflow</h1>
        <p className="text-indigo-100 mt-2 font-medium tracking-wide uppercase text-[10px]">Your Wealth, Your Flow</p>
      </div>

      <div className="w-full max-w-md glass rounded-[2.5rem] p-10 text-slate-900 shadow-2xl animate-slide-up">
        <h2 className="text-2xl font-extrabold mb-8 text-center dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Wealth Account'}
        </h2>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:text-white transition-all"
                placeholder="Aarav Sharma"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:text-white transition-all"
              placeholder="aarav@dhanflow.in"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:text-white transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:text-white transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {isLogin ? 'Unlock My Flow' : 'Start My Flow'} <Zap size={18} fill="currentColor" />
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="w-full mt-8 text-xs text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest"
        >
          {isLogin ? "Join the Flow" : "Existing Member"}
        </button>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Admin Access</p>
          <p className="text-[9px] text-slate-300">admin@dhanflow.in • admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;