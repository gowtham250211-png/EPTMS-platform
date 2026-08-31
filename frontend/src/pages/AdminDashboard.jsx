import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Users, UserCheck, ShieldCheck, CheckCircle2, Eye, CheckSquare } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  const [selectedUser, setSelectedUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [newRole, setNewRole] = useState('ROLE_EMPLOYEE');

  const fetchData = () => {
    api.get('/admin/stats').then((res) => setStats(res.data)).catch(console.error);
    api.get('/admin/users').then((res) => setUsers(Array.isArray(res.data) ? res.data : [])).catch(console.error);
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : [])).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    await api.post('/admin/change-role', { userId: selectedUser.id, newRole });
    setSelectedUser(null);
    fetchData();
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Organization Governance</h1>
        <p className="text-xs font-medium text-slate-500">Monitor all 3 roles, reassign positions, and inspect staff profiles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Employees</span>
            <Users size={18} className="text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalEmployees ?? 0}</span>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Team Leaders</span>
            <UserCheck size={18} className="text-amber-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalTLs ?? 0}</span>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Managers</span>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalManagers ?? 0}</span>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Tasks</span>
            <CheckCircle2 size={18} className="text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.completedTasks ?? 0}</span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={15} /> All Personnel Directory
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare size={15} /> Task Activity Monitor
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Performance</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">{u.fullName}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      u.role === 'ROLE_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      u.role === 'ROLE_MANAGER' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      u.role === 'ROLE_TL' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-emerald-600">{u.performanceScore ?? 85}%</td>
                  <td className="p-4 flex items-center gap-2">
                    <button
                      onClick={() => setProfileUser(u)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Eye size={13} /> View Profile
                    </button>
                    {u.role !== 'ROLE_ADMIN' && (
                      <button
                        onClick={() => { setSelectedUser(u); setNewRole(u.role); }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Change Position
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Organization Task Activity & Delegation</h2>
          {tasks.map((task) => (
            <div key={task.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">{task.sector || 'Core'}</span>
                  <h3 className="text-sm font-extrabold text-slate-900">{task.title}</h3>
                </div>
                <p className="text-xs text-slate-500">{task.description}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Assigned to: <strong className="text-slate-700">{task.assignedTo?.fullName}</strong> by <strong className="text-slate-700">{task.createdBy?.fullName}</strong>
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">{task.status}</span>
            </div>
          ))}
        </div>
      )}

      {profileUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                {profileUser.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{profileUser.fullName}</h3>
                <p className="text-xs text-slate-500 font-medium">{profileUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-semibold">Position</span>
                <span className="text-slate-800 font-bold">{profileUser.role.replace('ROLE_', '')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-semibold">Performance</span>
                <span className="text-emerald-600 font-bold">{profileUser.performanceScore}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-semibold">XP Accrued</span>
                <span className="text-indigo-600 font-bold">{profileUser.xpPoints ?? 0} XP</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-semibold">Leave Balances</span>
                <span className="text-slate-800 font-bold">Casual: {profileUser.casualLeaveBalance ?? 12} | Sick: {profileUser.sickLeaveBalance ?? 8}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setProfileUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Reassign Position: {selectedUser.fullName}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ROLE_EMPLOYEE">Employee (Worker)</option>
                <option value="ROLE_TL">Team Leader (TL)</option>
                <option value="ROLE_MANAGER">Department Manager</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSelectedUser(null)} className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button onClick={handleRoleChange} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs">Confirm Role Change</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};