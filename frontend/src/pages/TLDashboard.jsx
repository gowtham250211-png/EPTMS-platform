import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Users, Plus, CheckSquare, Layers, Award } from 'lucide-react';

export const TLDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Task assignment form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    api.get('/tasks')
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

    api.get('/tl/my-team')
      .then((res) => setTeamMembers(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!assignedToId) return;
    await api.post('/tasks', {
      title,
      description: desc,
      sector,
      priority: 'HIGH',
      estimatedHours: 8,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      assignedToId: Number(assignedToId),
    });
    setTitle('');
    setDesc('');
    setShowModal(false);
    loadData();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Team Leader Command</h1>
          <p className="text-xs font-medium text-slate-500">
            Monitor direct reports, assign sprint deliverables, and track velocity
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} /> Assign Task to Employee
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={15} /> Team Overview
        </button>
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'kanban' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare size={15} /> Sprint Kanban Board
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Members</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{teamMembers.length}</p>
            </div>
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Deliverables</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {tasks.filter((t) => t.status !== 'COMPLETED').length}
              </p>
            </div>
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sprint Velocity</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">94.8%</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 font-extrabold text-xs text-slate-800 uppercase tracking-wider bg-slate-50/50">
              Assigned Team Personnel Directory
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Performance Score</th>
                  <th className="p-4">XP Points</th>
                  <th className="p-4">Active Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {teamMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-bold text-slate-900">{m.fullName}</td>
                    <td className="p-4">{m.email}</td>
                    <td className="p-4 font-extrabold text-emerald-600">{m.performanceScore ?? 85}%</td>
                    <td className="p-4 font-bold text-indigo-600">{m.xpPoints ?? 0} XP</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold text-[11px] border border-blue-200">
                        {tasks.filter((t) => t.assignedTo?.id === m.id && t.status !== 'COMPLETED').length} Tasks
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['ASSIGNED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'].map((status) => (
            <div key={status} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                {status.replace('_', ' ')}
              </h2>
              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <div key={task.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                        {task.sector || 'Core'}
                      </span>
                      <h3 className="text-xs font-extrabold text-slate-900 mt-1.5">{task.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-1">{task.description}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-semibold">
                        Assignee: <strong className="text-slate-700">{task.assignedTo?.fullName}</strong>
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Delegation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateTask} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Assign Work Item to Employee</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Domain Sector</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign to Employee</label>
              <select
                required
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="">Select Employee</option>
                {teamMembers.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                required
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Assign Deliverable
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};