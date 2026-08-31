import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Award, CheckCircle, Zap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks')
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Failed to fetch tasks:', err));
  }, []);

  const completeTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, {
        status: 'COMPLETED',
        progress: 100,
      });
      const res = await api.get('/tasks');
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Workspace</h1>
          <p className="text-xs text-slate-500">
            Welcome back, {user?.fullName} · Team: {user?.teamName || 'Core Operations'}
          </p>
        </div>
        <Link
          to="/leave"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Calendar size={15} />
          <span>Apply for Leave</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Performance</span>
            <Zap className="text-amber-500" size={18} />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mb-2">
            {user?.performanceScore ?? 87} / 100
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${user?.performanceScore ?? 87}%` }}
            ></div>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Gamification XP</span>
            <Award className="text-indigo-600" size={18} />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {user?.xpPoints ?? 950} XP
          </div>
          <p className="text-xs text-indigo-600 font-semibold mt-1">Level 4 Contributor</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Tasks</span>
            <CheckCircle className="text-blue-600" size={18} />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {tasks.filter((t) => t.status !== 'COMPLETED').length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Assigned by Team Leader</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Leave Balances</span>
            <Calendar className="text-emerald-600" size={18} />
          </div>
          <div className="text-xs font-medium text-slate-700 space-y-1">
            <p>Casual: <strong className="text-slate-900">{user?.casualLeave ?? 12}</strong></p>
            <p>Sick: <strong className="text-slate-900">{user?.sickLeave ?? 8}</strong></p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 mb-4">My Assigned Tasks (Execution & Updates)</h2>
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No tasks assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      {task.status}
                    </span>
                  </div>
                </div>
                {task.status !== 'COMPLETED' ? (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    Mark Complete (+15 XP)
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle size={14} /> Completed
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};