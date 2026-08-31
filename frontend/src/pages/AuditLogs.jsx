import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { ShieldAlert } from 'lucide-react';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit-logs')
      .then((res) => {
        setLogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">System Audit Trail</h1>
        <p className="text-xs font-medium text-slate-500">
          Tamper-evident security logs, role transfers, and organizational changes
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-extrabold text-xs text-slate-800 uppercase tracking-wider bg-slate-50/50 flex items-center gap-2">
          <ShieldAlert size={16} className="text-blue-600" />
          Recorded Organization Activity
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Change Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    {loading ? 'Loading audit records...' : 'No audit log entries recorded yet.'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                    </td>
                    <td className="p-4 font-bold text-slate-900">{log.performedBy}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{log.entityTarget}</td>
                    <td className="p-4 text-slate-600">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};