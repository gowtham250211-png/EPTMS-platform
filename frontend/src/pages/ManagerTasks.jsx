import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, CheckSquare, Layers } from 'lucide-react';

export const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tls, setTls] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
    api.get('/manager/my-team-leads').then((res) => setTls(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignedToId) return;
    await api.post('/tasks', {
      title,
      description,
      sector,
      priority: 'HIGH',
      estimatedHours: 16,
      dueDate,
      assignedToId: Number(assignedToId),
    });
    setShowModal(false);
    setTitle('');
    setDescription('');
    loadData();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Project Task Delegation</h1>
          <p className="text-xs font-medium text-slate-500">Assign macro deliverables and architectural domains directly to Team Leaders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={15} /> Assign Task to Team Leader
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Current Department Projects</h2>
        {tasks.map((t) => (
          <div key={t.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">{t.sector}</span>
                <h3 className="text-sm font-extrabold text-slate-900">{t.title}</h3>
              </div>
              <p className="text-xs text-slate-500">{t.description}</p>
              <p className="text-[11px] text-slate-400 mt-1">Lead: <strong className="text-slate-700">{t.assignedTo?.fullName}</strong> | Due: {t.dueDate}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">{t.status}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAssign} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Delegate Project Task to TL</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Deliverable Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sector Domain</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                <option value="Core Architecture">Core Architecture</option>
                <option value="Fintech API & Payments">Fintech API & Payments</option>
                <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                <option value="Frontend UI/UX">Frontend UI/UX</option>
                <option value="Security & Compliance">Security & Compliance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign to Team Leader</label>
              <select required value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                <option value="">Select a Team Leader</option>
                {tls.map((tl) => <option key={tl.id} value={tl.id}>{tl.fullName} ({tl.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Task Scope & Architecture</label>
              <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer">Assign to TL</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};