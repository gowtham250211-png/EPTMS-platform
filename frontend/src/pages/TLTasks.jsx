import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, CheckSquare } from 'lucide-react';

export const TLTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
    api.get('/tl/my-team').then((res) => setTeamMembers(Array.isArray(res.data) ? res.data : []));
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
          <h1 className="text-2xl font-black text-slate-900">Sprint Kanban & Task Assignment</h1>
          <p className="text-xs font-medium text-slate-500">Assign deliverables to team members and oversee the sprint workflow</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} /> Assign Task to Employee
        </button>
      </div>

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
                  <div key={task.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      {task.sector || 'Core'}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900">{task.title}</h3>
                    <p className="text-[11px] text-slate-500">{task.description}</p>
                    <p className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200/60">
                      Assignee: <strong className="text-slate-700">{task.assignedTo?.fullName || 'Unassigned'}</strong>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateTask} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Assign Work Item to Employee</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sector Domain</label>
              <input type="text" required value={sector} onChange={(e) => setSector(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign to Employee</label>
              <select required value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                <option value="">Select Employee</option>
                {teamMembers.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea required rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Assign Deliverable</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};