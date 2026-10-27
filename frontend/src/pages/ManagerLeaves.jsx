import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Check, X, Plus, Calendar } from 'lucide-react';

export const ManagerLeaves = () => {
  const [tlLeaves, setTlLeaves] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const loadData = () => {
    api.get('/leave/pending-approvals').then((res) => setTlLeaves(Array.isArray(res.data) ? res.data : []));
    api.get('/leave/my-leaves').then((res) => setMyLeaves(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTLAction = async (id, approved) => {
    await api.patch(`/leave/${id}/action`, {
      approved,
      comments: approved ? 'Approved by Department Manager' : 'Rejected by Department Manager'
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
    <div className="manager-leaves-section-01">
      <div className="manager-leaves-section-02">
        <div>
          <h1 className="manager-leaves-heading-01">Manager Leave Governance</h1>
          <p className="manager-leaves-description-01">Approve Team Leader leaves and submit manager leave applications to Administrator</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="manager-leaves-button-01"
        >
          <Plus size={16} /> Apply for Manager Leave
        </button>
      </div>

      {/* Team Leader Approvals */}
      <div className="manager-leaves-section-03">
        <div className="manager-leaves-section-04">
          Pending Team Leader Applications
        </div>
        <table className="manager-leaves-table-01">
          <thead className="manager-leaves-thead-01">
            <tr>
              <th className="manager-leaves-table-heading-01">Team Leader</th>
              <th className="manager-leaves-table-heading-01">Category</th>
              <th className="manager-leaves-table-heading-01">Dates</th>
              <th className="manager-leaves-table-heading-01">Days</th>
              <th className="manager-leaves-table-heading-01">Reason</th>
              <th className="manager-leaves-table-heading-01">Action</th>
            </tr>
          </thead>
          <tbody className="manager-leaves-tbody-01">
            {tlLeaves.length === 0 ? (
              <tr><td colSpan={6} className="manager-leaves-table-cell-01">No TL leave applications pending.</td></tr>
            ) : (
              tlLeaves.map((l) => (
                <tr key={l.id} className="manager-leaves-table-row-01">
                  <td className="manager-leaves-table-cell-02">{l.employee?.fullName}</td>
                  <td className="manager-leaves-table-cell-03">{l.leaveType}</td>
                  <td className="manager-leaves-table-cell-04">{l.startDate} to {l.endDate}</td>
                  <td className="manager-leaves-table-cell-05">{l.numberOfDays}</td>
                  <td className="manager-leaves-table-cell-06">{l.reason}</td>
                  <td className="manager-leaves-table-cell-07">
                    <button onClick={() => handleTLAction(l.id, true)} className="manager-leaves-button-02">
                      <Check size={13} /> Approve
                    </button>
                    <button onClick={() => handleTLAction(l.id, false)} className="manager-leaves-button-03">
                      <X size={13} /> Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* My Submitted Leaves */}
      <div className="manager-leaves-section-05">
        <div className="manager-leaves-section-04">
          My Manager Leave Status (Reviewed by Admin)
        </div>
        <table className="manager-leaves-table-01">
          <thead className="manager-leaves-thead-01">
            <tr>
              <th className="manager-leaves-table-heading-01">Type</th>
              <th className="manager-leaves-table-heading-01">Dates</th>
              <th className="manager-leaves-table-heading-01">Days</th>
              <th className="manager-leaves-table-heading-01">Reason</th>
              <th className="manager-leaves-table-heading-01">Status</th>
            </tr>
          </thead>
          <tbody className="manager-leaves-tbody-01">
            {myLeaves.length === 0 ? (
              <tr><td colSpan={5} className="manager-leaves-table-cell-01">No leaves submitted.</td></tr>
            ) : (
              myLeaves.map((l) => (
                <tr key={l.id} className="manager-leaves-table-row-01">
                  <td className="manager-leaves-table-cell-02">{l.leaveType}</td>
                  <td className="manager-leaves-table-cell-04">{l.startDate} to {l.endDate}</td>
                  <td className="manager-leaves-table-cell-05">{l.numberOfDays}</td>
                  <td className="manager-leaves-table-cell-06">{l.reason}</td>
                  <td className="manager-leaves-table-cell-04">
                    <span className={`manager-leaves-text-01 ${
                      l.status === 'APPROVED' ? 'manager-leaves-text-02' :
                      l.status === 'REJECTED' ? 'manager-leaves-text-03' : 'manager-leaves-text-04'
                    }`}>{l.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showApplyModal && (
        <div className="manager-leaves-section-06">
          <form onSubmit={handleApply} className="manager-leaves-form-01">
            <h3 className="manager-leaves-heading-02">Apply for Manager Leave</h3>
            <div>
              <label className="manager-leaves-label-01">Leave Category</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="manager-leaves-select-01">
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>
            <div className="manager-leaves-section-07">
              <div>
                <label className="manager-leaves-label-01">Start Date</label>
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="manager-leaves-input-01" />
              </div>
              <div>
                <label className="manager-leaves-label-01">End Date</label>
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="manager-leaves-input-01" />
              </div>
            </div>
            <div>
              <label className="manager-leaves-label-01">Reason</label>
              <textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="manager-leaves-textarea-01" />
            </div>
            <div className="manager-leaves-section-08">
              <button type="button" onClick={() => setShowApplyModal(false)} className="manager-leaves-button-04">Cancel</button>
              <button type="submit" className="manager-leaves-button-05">Submit to Admin</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};