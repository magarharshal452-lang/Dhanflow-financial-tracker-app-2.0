
import React from 'react';
import { useAppContext } from '../AppContext';
import { Users, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { registeredUsers, isDarkMode } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-blue-600" /> Admin Portal
        </h2>
        <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          System Overview
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
          <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Total Users</p>
          <p className="text-2xl font-black">{registeredUsers.length}</p>
        </div>
        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
          <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Status</p>
          <p className="text-lg font-black text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active
          </p>
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-4 border-b border-inherit bg-gray-50 dark:bg-gray-700/30">
          <h3 className="text-sm font-bold">User Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-[10px] uppercase font-bold text-gray-400 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <tr>
                <th className="px-4 py-3">User Details</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {registeredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs">{user.name}</p>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium flex items-center gap-1">
                      <Phone size={10} className="text-gray-400" /> {user.phone}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={10} /> {user.joinedAt}
                    </p>
                  </td>
                </tr>
              ))}
              {registeredUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-gray-400 italic">
                    No users registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 p-4 rounded-xl">
        <p className="text-[10px] text-yellow-700 dark:text-yellow-400 font-bold uppercase mb-1">Developer Note</p>
        <p className="text-xs text-yellow-600 dark:text-yellow-500">
          In a production environment, this data would be stored in a secure cloud database (Firebase, Supabase, PostgreSQL). Currently, it is stored in the browser's LocalStorage for demonstration.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
