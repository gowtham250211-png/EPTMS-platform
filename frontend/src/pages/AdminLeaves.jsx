import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Check, X, Calendar } from 'lucide-react';

export const AdminLeaves = () => {
  const [managerLeaves, setManagerLeaves] = useState([]);

  const loadLeaves = () => {
    api.get('/leave/pending-approvals').then((res) => setManagerLeaves(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleAction = async (id, approved) => {
    await api.patch(`/leave/${id}/action`, {
      approved,
      comments: approved ? 'Authorized by System Administrator' : 'Rejected by System Administrator'
    });
    loadLeaves();
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Manager Leave Authorizations</h1>
        <p className="text-xs font-medium text-slate-500">Review and authorize executive leave applications submitted by Department Managers</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-extrabold text-xs text-slate-800 uppercase tracking-wider bg-slate-50/50">
          Pending Manager Applications
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-bold">
            <tr>
              <th className="p-4">Manager</th>
              <th className="p-4">Category</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Days</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {managerLeaves.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">No manager leave requests pending approval.</td></tr>
            ) : (
              managerLeaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{l.employee?.fullName}</td>
                  <td className="p-4 font-bold text-blue-700">{l.leaveType}</td>
                  <td className="p-4">{l.startDate} to {l.endDate}</td>
                  <td className="p-4 font-extrabold">{l.numberOfDays}</td>
                  <td className="p-4 text-slate-500">{l.reason}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleAction(l.id, true)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1">
                      <Check size={13} /> Authorize
                    </button>
                    <button onClick={() => handleAction(l.id, false)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1">
                      <X size={13} /> Reject
                    </button>
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