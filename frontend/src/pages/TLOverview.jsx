import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Users, CheckSquare, Layers, Award, Target } from 'lucide-react';

export const TLOverview = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);

  useEffect(() => {
    // Fetch team employees
    api.get('/tl/my-team')
      .then((res) => setTeamMembers(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

    // Fetch all tasks to separate parent tasks and team tasks
    api.get('/tasks')
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        // Parent tasks: Assigned to this TL by Manager
        setParentTasks(all.filter((t) => t.assignedTo?.id === user?.id));
        // Team tasks: Created by this TL for employees
        setTeamTasks(all.filter((t) => t.createdBy?.id === user?.id));
      })
      .catch(console.error);
  }, [user]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Team Leadership & Project Overview</h1>
        <p className="text-xs font-medium text-slate-500">
          Supervise team personnel, monitor performance scores, and track parent milestones assigned by Management
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Team Members</span>
            <Users size={18} className="text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{teamMembers.length}</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Manager Directives</span>
            <Target size={18} className="text-purple-600" />
          </div>
          <span className="text-2xl font-black text-purple-600">{parentTasks.length}</span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Delegations</span>
            <CheckSquare size={18} className="text-amber-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            {teamTasks.filter((t) => t.status !== 'COMPLETED').length}
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Sprint Items</span>
            <Award size={18} className="text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600">
            {teamTasks.filter((t) => t.status === 'COMPLETED').length}
          </span>
        </div>
      </div>

      {/* Parent Deliverables from Manager */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Target size={16} className="text-purple-600" />
            Parent Project Deliverables (Assigned to Me by Manager)
          </h2>
          <span className="text-xs font-bold text-slate-400">{parentTasks.length} Active Directives</span>
        </div>

        {parentTasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No parent project tasks assigned by Manager yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {parentTasks.map((task) => (
              <div key={task.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      {task.sector || 'Core Architecture'}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1">{task.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{task.description}</p>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 font-medium">
                  <span>Due: <strong className="text-slate-700">{task.dueDate || 'Sprint End'}</strong></span>
                  <span>Lead by: {task.createdBy?.fullName || 'Manager'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Staff Directory */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-extrabold text-xs text-slate-800 uppercase tracking-wider bg-slate-50/50 flex items-center gap-2">
          <Users size={16} className="text-blue-600" />
          Direct Team Members Directory
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-bold">
            <tr>
              <th className="p-4">Member Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Performance Score</th>
              <th className="p-4">XP Points</th>
              <th className="p-4">Active Tasks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {teamMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">No team members mapped yet.</td>
              </tr>
            ) : (
              teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">{m.fullName}</td>
                  <td className="p-4">{m.email}</td>
                  <td className="p-4 font-extrabold text-emerald-600">{m.performanceScore ?? 85}%</td>
                  <td className="p-4 font-bold text-indigo-600">{m.xpPoints ?? 0} XP</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-bold text-[11px] border border-blue-200">
                      {teamTasks.filter((t) => t.assignedTo?.id === m.id && t.status !== 'COMPLETED').length} Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
