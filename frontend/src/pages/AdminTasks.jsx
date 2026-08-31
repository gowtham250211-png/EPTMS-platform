import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { CheckSquare, Filter } from 'lucide-react';

export const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Organization Task Activity Monitor</h1>
        <p className="text-xs font-medium text-slate-500">Global audit of all deliverables across every sector and department</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">{task.sector || 'Core'}</span>
                <h3 className="text-sm font-extrabold text-slate-900">{task.title}</h3>
              </div>
              <p className="text-xs text-slate-500">{task.description}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Assignee: <strong className="text-slate-700">{task.assignedTo?.fullName}</strong> | Created By: <strong className="text-slate-700">{task.createdBy?.fullName}</strong>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};