import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, Calendar } from 'lucide-react';

export const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const loadLeaves = () => {
    api.get('/leave/my-leaves').then((res) => setLeaves(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    await api.post('/leave/apply', { leaveType, startDate, endDate, reason });
    setShowApplyModal(false);
    loadLeaves();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Leave Applications</h1>
          <p className="text-xs font-medium text-slate-500">Submit requests to your Team Leader and track balance deductions</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-extrabold text-xs text-slate-800 uppercase tracking-wider bg-slate-50/50">
          Application History
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-bold">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Dates</th>
              <th className="p-4">Days</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {leaves.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No leave requests submitted yet.</td></tr>
            ) : (
              leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{l.leaveType}</td>
                  <td className="p-4">{l.startDate} to {l.endDate}</td>
                  <td className="p-4 font-bold">{l.numberOfDays}</td>
                  <td className="p-4 text-slate-500">{l.reason}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      l.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{l.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleApply} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Submit Leave Application</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Leave Category</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
              <textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowApplyModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs">Submit to Team Leader</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};