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
    <div className="admin-leaves-section-01">
      <div>
        <h1 className="admin-leaves-heading-01">Manager Leave Authorizations</h1>
        <p className="admin-leaves-description-01">Review and authorize executive leave applications submitted by Department Managers</p>
      </div>

      <div className="admin-leaves-section-02">
        <div className="admin-leaves-section-03">
          Pending Manager Applications
        </div>
        <table className="admin-leaves-table-01">
          <thead className="admin-leaves-thead-01">
            <tr>
              <th className="admin-leaves-table-heading-01">Manager</th>
              <th className="admin-leaves-table-heading-01">Category</th>
              <th className="admin-leaves-table-heading-01">Duration</th>
              <th className="admin-leaves-table-heading-01">Days</th>
              <th className="admin-leaves-table-heading-01">Reason</th>
              <th className="admin-leaves-table-heading-01">Decision</th>
            </tr>
          </thead>
          <tbody className="admin-leaves-tbody-01">
            {managerLeaves.length === 0 ? (
              <tr><td colSpan={6} className="admin-leaves-table-cell-01">No manager leave requests pending approval.</td></tr>
            ) : (
              managerLeaves.map((l) => (
                <tr key={l.id} className="admin-leaves-table-row-01">
                  <td className="admin-leaves-table-cell-02">{l.employee?.fullName}</td>
                  <td className="admin-leaves-table-cell-03">{l.leaveType}</td>
                  <td className="admin-leaves-table-cell-04">{l.startDate} to {l.endDate}</td>
                  <td className="admin-leaves-table-cell-05">{l.numberOfDays}</td>
                  <td className="admin-leaves-table-cell-06">{l.reason}</td>
                  <td className="admin-leaves-table-cell-07">
                    <button onClick={() => handleAction(l.id, true)} className="admin-leaves-button-01">
                      <Check size={13} /> Authorize
                    </button>
                    <button onClick={() => handleAction(l.id, false)} className="admin-leaves-button-02">
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