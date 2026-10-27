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
    <div className="audit-logs-section-01">
      <div>
        <h1 className="audit-logs-heading-01">System Audit Trail</h1>
        <p className="audit-logs-description-01">
          Tamper-evident security logs, role transfers, and organizational changes
        </p>
      </div>

      <div className="audit-logs-section-02">
        <div className="audit-logs-section-03">
          <ShieldAlert size={16} className="audit-logs-shield-alert-01" />
          Recorded Organization Activity
        </div>
        <div className="audit-logs-section-04">
          <table className="audit-logs-table-01">
            <thead className="audit-logs-thead-01">
              <tr>
                <th className="audit-logs-table-heading-01">Timestamp</th>
                <th className="audit-logs-table-heading-01">Performed By</th>
                <th className="audit-logs-table-heading-01">Action Type</th>
                <th className="audit-logs-table-heading-01">Target Entity</th>
                <th className="audit-logs-table-heading-01">Change Details</th>
              </tr>
            </thead>
            <tbody className="audit-logs-tbody-01">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="audit-logs-table-cell-01">
                    {loading ? 'Loading audit records...' : 'No audit log entries recorded yet.'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="audit-logs-table-row-01">
                    <td className="audit-logs-table-cell-02">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                    </td>
                    <td className="audit-logs-table-cell-03">{log.performedBy}</td>
                    <td className="audit-logs-table-cell-04">
                      <span className="audit-logs-text-01">
                        {log.action}
                      </span>
                    </td>
                    <td className="audit-logs-table-cell-05">{log.entityTarget}</td>
                    <td className="audit-logs-table-cell-06">{log.details}</td>
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