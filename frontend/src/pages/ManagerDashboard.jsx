import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Users, Plus, CheckSquare, Layers } from 'lucide-react';

export const ManagerDashboard = () => {
  const [tls, setTls] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ROLE_EMPLOYEE');

  const loadData = () => {
    api.get('/manager/my-team-leads').then((res) => setTls(Array.isArray(res.data) ? res.data : []));
    api.get('/manager/my-staff').then((res) => setStaff(Array.isArray(res.data) ? res.data : []));
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignTLTask = async (e) => {
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
    setShowTaskModal(false);
    setTitle('');
    setDescription('');
    loadData();
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    await api.post('/manager/create-worker', { fullName, email, role });
    setShowWorkerModal(false);
    setFullName('');
    setEmail('');
    loadData();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manager Department View</h1>
          <p className="text-xs font-medium text-slate-500">Oversee TLs, delegate project sectors, and onboard department staff</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowWorkerModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus size={15} /> Add Team Member / TL
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Plus size={15} /> Delegate Task to TL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Users size={16} className="text-blue-600" /> Direct Team Leaders
            </h2>
            <span className="text-xs font-bold text-slate-400">{tls.length} Active TLs</span>
          </div>
          <div className="space-y-3">
            {tls.map((tl) => (
              <div key={tl.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{tl.fullName}</p>
                  <p className="text-xs text-slate-500">{tl.email}</p>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {tl.performanceScore}% Score
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers size={16} className="text-indigo-600" /> Department Personnel
            </h2>
            <span className="text-xs font-bold text-slate-400">{staff.length} Total Members</span>
          </div>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {staff.map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{s.fullName}</span>
                  <span className="text-slate-400">{s.email}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-200 text-slate-700">
                  {s.role.replace('ROLE_', '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare size={16} className="text-blue-600" /> Sector Tasks & Deliverables Under Management
        </h2>
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

      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAssignTLTask} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Delegate Project Task to TL</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Deliverable Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sector / Department Domain</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Task Scope</label>
              <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">Assign to TL</button>
            </div>
          </form>
        </div>
      )}

      {showWorkerModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateWorker} className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Onboard Department Staff</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Designation</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                <option value="ROLE_EMPLOYEE">Worker (Employee)</option>
                <option value="ROLE_TL">Team Leader (TL)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowWorkerModal(false)} className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer">Onboard</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};