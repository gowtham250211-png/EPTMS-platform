import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { CheckCircle2, Clock, Check, Layers } from 'lucide-react';

export const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = () => {
    setLoading(true);
    api.get('/tasks')
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateProgress = async (taskId, progress) => {
    const status = progress === 100 ? 'COMPLETED' : 'IN_PROGRESS';
    await api.patch(`/tasks/${taskId}/status`, { status, progress });
    loadTasks();
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Assigned Deliverables</h1>
        <p className="text-xs font-medium text-slate-500">
          Track sprint tasks, update progress milestones, and complete deliverables for XP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {tasks.filter((t) => t.status !== 'COMPLETED').length}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {tasks.filter((t) => t.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Work Items</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{tasks.length}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Active Work Items</h2>
        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading deliverables...</p>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No deliverables assigned yet.</p>
        ) : (
          <div className="space-y-3.5">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-md">
                        {task.sector || 'Core Architecture'}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        {task.priority}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900">{task.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600">{task.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                      Due: <strong className="text-slate-700">{task.dueDate || 'Flexible'}</strong> · Estimated: {task.estimatedHours || 8} hrs
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {task.status !== 'COMPLETED' ? (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">Set Progress:</span>
                      {[25, 50, 75].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => updateProgress(task.id, pct)}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-xs rounded-lg hover:bg-slate-100 font-bold text-slate-700 cursor-pointer transition-all"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => updateProgress(task.id, 100)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
                    >
                      <Check size={14} /> Mark Complete (+15 XP)
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={14} /> Deliverable Completed & XP Added
                    </span>
                    <span className="text-slate-400 font-medium">Status: Archived</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};