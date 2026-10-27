import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Check, X, Plus, Calendar } from 'lucide-react';

export const TLLeaves = () => {
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const loadData = () => {
    api.get('/leave/pending-approvals').then((res) => setEmployeeLeaves(Array.isArray(res.data) ? res.data : []));
    api.get('/leave/my-leaves').then((res) => setMyLeaves(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id, approved) => {
    await api.patch(`/leave/${id}/action`, {
      approved,
      comments: approved ? 'Approved by Team Leader' : 'Rejected by Team Leader'
    });
    loadData();
  };

  const handleApply = async (e) => {
    e.preventDefault();
    await api.post('/leave/apply', { leaveType, startDate, endDate, reason });
    setShowApplyModal(false);
    loadData();
  };

  return (
    <div className="tlleaves-section-01">
      <div className="tlleaves-section-02">
        <div>
          <h1 className="tlleaves-heading-01">Team Leader Leave Portal</h1>
          <p className="tlleaves-description-01">Approve employee leave applications and apply for your own TL leave</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="tlleaves-button-01"
        >
          <Plus size={16} /> Apply for TL Leave
        </button>
      </div>

      {/* Employee Leaves to Approve */}
      <div className="tlleaves-section-03">
        <div className="tlleaves-section-04">
          Team Employee Leave Requests
        </div>
        <table className="tlleaves-table-01">
          <thead className="tlleaves-thead-01">
            <tr>
              <th className="tlleaves-table-heading-01">Employee</th>
              <th className="tlleaves-table-heading-01">Category</th>
              <th className="tlleaves-table-heading-01">Dates</th>
              <th className="tlleaves-table-heading-01">Days</th>
              <th className="tlleaves-table-heading-01">Reason</th>
              <th className="tlleaves-table-heading-01">Decision</th>
            </tr>
          </thead>
          <tbody className="tlleaves-tbody-01">
            {employeeLeaves.length === 0 ? (
              <tr><td colSpan={6} className="tlleaves-table-cell-01">No employee leave requests pending.</td></tr>
            ) : (
              employeeLeaves.map((l) => (
                <tr key={l.id} className="tlleaves-table-row-01">
                  <td className="tlleaves-table-cell-02">{l.employee?.fullName}</td>
                  <td className="tlleaves-table-cell-03">{l.leaveType}</td>
                  <td className="tlleaves-table-cell-04">{l.startDate} to {l.endDate}</td>
                  <td className="tlleaves-table-cell-05">{l.numberOfDays}</td>
                  <td className="tlleaves-table-cell-06">{l.reason}</td>
                  <td className="tlleaves-table-cell-07">
                    <button onClick={() => handleAction(l.id, true)} className="tlleaves-button-02">
                      <Check size={13} /> Approve
                    </button>
                    <button onClick={() => handleAction(l.id, false)} className="tlleaves-button-03">
                      <X size={13} /> Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* My TL Submitted Leaves */}
      <div className="tlleaves-section-05">
        <div className="tlleaves-section-04">
          My Submitted Leave Applications (Reviewed by Manager)
        </div>
        <table className="tlleaves-table-01">
          <thead className="tlleaves-thead-01">
            <tr>
              <th className="tlleaves-table-heading-01">Type</th>
              <th className="tlleaves-table-heading-01">Dates</th>
              <th className="tlleaves-table-heading-01">Days</th>
              <th className="tlleaves-table-heading-01">Reason</th>
              <th className="tlleaves-table-heading-01">Status</th>
            </tr>
          </thead>
          <tbody className="tlleaves-tbody-01">
            {myLeaves.length === 0 ? (
              <tr><td colSpan={5} className="tlleaves-table-cell-01">No leaves submitted yet.</td></tr>
            ) : (
              myLeaves.map((l) => (
                <tr key={l.id} className="tlleaves-table-row-01">
                  <td className="tlleaves-table-cell-02">{l.leaveType}</td>
                  <td className="tlleaves-table-cell-04">{l.startDate} to {l.endDate}</td>
                  <td className="tlleaves-table-cell-05">{l.numberOfDays}</td>
                  <td className="tlleaves-table-cell-06">{l.reason}</td>
                  <td className="tlleaves-table-cell-04">
                    <span className={`tlleaves-text-01 ${
                      l.status === 'APPROVED' ? 'tlleaves-text-02' :
                      l.status === 'REJECTED' ? 'tlleaves-text-03' : 'tlleaves-text-04'
                    }`}>{l.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showApplyModal && (
        <div className="tlleaves-section-06">
          <form onSubmit={handleApply} className="tlleaves-form-01">
            <h3 className="tlleaves-heading-02">Apply for Team Leader Leave</h3>
            <div>
              <label className="tlleaves-label-01">Leave Category</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="tlleaves-select-01">
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>
            <div className="tlleaves-section-07">
              <div>
                <label className="tlleaves-label-01">Start Date</label>
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="tlleaves-input-01" />
              </div>
              <div>
                <label className="tlleaves-label-01">End Date</label>
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="tlleaves-input-01" />
              </div>
            </div>
            <div>
              <label className="tlleaves-label-01">Reason</label>
              <textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="tlleaves-textarea-01" />
            </div>
            <div className="tlleaves-section-08">
              <button type="button" onClick={() => setShowApplyModal(false)} className="tlleaves-button-04">Cancel</button>
              <button type="submit" className="tlleaves-button-05">Submit to Manager</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
