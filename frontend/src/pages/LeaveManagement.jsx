import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Plus, Check, X } from 'lucide-react';

export const LeaveManagement = () => {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const loadLeaves = () => {
    if (user?.role !== 'ROLE_ADMIN') {
      api.get('/leave/my-leaves').then((res) => setMyLeaves(Array.isArray(res.data) ? res.data : []));
    }
    if (user?.role !== 'ROLE_EMPLOYEE') {
      api.get('/leave/pending-approvals').then((res) => setPendingApprovals(Array.isArray(res.data) ? res.data : []));
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
    await api.post('/leave/apply', { leaveType, startDate, endDate, reason });
    setShowApplyModal(false);
    loadLeaves();
  };

  const handleLeaveAction = async (id, approved) => {
    await api.patch(`/leave/${id}/action`, {
      approved,
      comments: approved ? 'Approved by supervisor' : 'Rejected by supervisor',
    });
    loadLeaves();
  };

  return (
    <div className="leave-management-section-01">
      <div className="leave-management-section-02">
        <div>
          <h1 className="leave-management-heading-01">Leave Management</h1>
          <p className="leave-management-description-01">
            {user?.role === 'ROLE_ADMIN' ? 'Review & authorize Manager leave applications' :
             user?.role === 'ROLE_MANAGER' ? 'Approve Team Leader leaves and submit department requests' :
             user?.role === 'ROLE_TL' ? 'Approve Team member leaves and submit TL requests' :
             'Submit and track your personal leave requests'}
          </p>
        </div>
        {user?.role !== 'ROLE_ADMIN' && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="leave-management-button-01"
          >
            <Plus size={16} /> Apply for Leave
          </button>
        )}
      </div>

      {user?.role !== 'ROLE_EMPLOYEE' && (
        <div className="leave-management-section-03">
          <div className="leave-management-section-04">
            {user?.role === 'ROLE_ADMIN' ? 'Manager Leave Requests Requiring Authorization' :
             user?.role === 'ROLE_MANAGER' ? 'Team Leader Leave Applications' : 'Team Employee Leave Requests'}
          </div>
          <table className="leave-management-table-01">
            <thead className="leave-management-thead-01">
              <tr>
                <th className="leave-management-table-heading-01">Applicant</th>
                <th className="leave-management-table-heading-01">Position</th>
                <th className="leave-management-table-heading-01">Category</th>
                <th className="leave-management-table-heading-01">Dates</th>
                <th className="leave-management-table-heading-01">Days</th>
                <th className="leave-management-table-heading-01">Reason</th>
                <th className="leave-management-table-heading-01">Action</th>
              </tr>
            </thead>
            <tbody className="leave-management-tbody-01">
              {pendingApprovals.length === 0 ? (
                <tr><td colSpan={7} className="leave-management-table-cell-01">No pending leave applications.</td></tr>
              ) : (
                pendingApprovals.map((l) => (
                  <tr key={l.id} className="leave-management-table-row-01">
                    <td className="leave-management-table-cell-02">{l.employee?.fullName}</td>
                    <td className="leave-management-table-cell-03">{l.employee?.role?.replace('ROLE_', '')}</td>
                    <td className="leave-management-table-cell-04">{l.leaveType}</td>
                    <td className="leave-management-table-cell-03">{l.startDate} to {l.endDate}</td>
                    <td className="leave-management-table-cell-05">{l.numberOfDays}</td>
                    <td className="leave-management-table-cell-06">{l.reason}</td>
                    <td className="leave-management-table-cell-07">
                      <button onClick={() => handleLeaveAction(l.id, true)} className="leave-management-button-02">
                        <Check size={13} /> Approve
                      </button>
                      <button onClick={() => handleLeaveAction(l.id, false)} className="leave-management-button-03">
                        <X size={13} /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {user?.role !== 'ROLE_ADMIN' && (
        <div className="leave-management-section-05">
          <div className="leave-management-section-04">
            My Submitted Leave Applications
          </div>
          <table className="leave-management-table-01">
            <thead className="leave-management-thead-01">
              <tr>
                <th className="leave-management-table-heading-01">Type</th>
                <th className="leave-management-table-heading-01">Dates</th>
                <th className="leave-management-table-heading-01">Days</th>
                <th className="leave-management-table-heading-01">Reason</th>
                <th className="leave-management-table-heading-01">Status</th>
              </tr>
            </thead>
            <tbody className="leave-management-tbody-01">
              {myLeaves.length === 0 ? (
                <tr><td colSpan={5} className="leave-management-table-cell-01">No leaves submitted yet.</td></tr>
              ) : (
                myLeaves.map((l) => (
                  <tr key={l.id} className="leave-management-table-row-01">
                    <td className="leave-management-table-cell-02">{l.leaveType}</td>
                    <td className="leave-management-table-cell-03">{l.startDate} to {l.endDate}</td>
                    <td className="leave-management-table-cell-05">{l.numberOfDays}</td>
                    <td className="leave-management-table-cell-08">{l.reason}</td>
                    <td className="leave-management-table-cell-03">
                      <span className={`leave-management-text-01 ${
                        l.status === 'APPROVED' ? 'leave-management-text-02' :
                        l.status === 'REJECTED' ? 'leave-management-text-03' : 'leave-management-text-04'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showApplyModal && (
        <div className="leave-management-section-06">
          <form onSubmit={handleApply} className="leave-management-form-01">
            <h3 className="leave-management-heading-02">Submit Leave Application</h3>
            <div>
              <label className="leave-management-label-01">Leave Type</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="leave-management-select-01">
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>
            <div className="leave-management-section-07">
              <div>
                <label className="leave-management-label-01">Start Date</label>
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="leave-management-input-01" />
              </div>
              <div>
                <label className="leave-management-label-01">End Date</label>
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="leave-management-input-01" />
              </div>
            </div>
            <div>
              <label className="leave-management-label-01">Reason</label>
              <textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="leave-management-textarea-01" />
            </div>
            <div className="leave-management-section-08">
              <button type="button" onClick={() => setShowApplyModal(false)} className="leave-management-button-04">Cancel</button>
              <button type="submit" className="leave-management-button-05">Submit Application</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};