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
    <div className="employee-leaves-section-01">
      <div className="employee-leaves-section-02">
        <div>
          <h1 className="employee-leaves-heading-01">My Leave Applications</h1>
          <p className="employee-leaves-description-01">Submit requests to your Team Leader and track balance deductions</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="employee-leaves-button-01"
        >
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      <div className="employee-leaves-section-03">
        <div className="employee-leaves-section-04">
          Application History
        </div>
        <table className="employee-leaves-table-01">
          <thead className="employee-leaves-thead-01">
            <tr>
              <th className="employee-leaves-table-heading-01">Type</th>
              <th className="employee-leaves-table-heading-01">Dates</th>
              <th className="employee-leaves-table-heading-01">Days</th>
              <th className="employee-leaves-table-heading-01">Reason</th>
              <th className="employee-leaves-table-heading-01">Status</th>
            </tr>
          </thead>
          <tbody className="employee-leaves-tbody-01">
            {leaves.length === 0 ? (
              <tr><td colSpan={5} className="employee-leaves-table-cell-01">No leave requests submitted yet.</td></tr>
            ) : (
              leaves.map((l) => (
                <tr key={l.id} className="employee-leaves-table-row-01">
                  <td className="employee-leaves-table-cell-02">{l.leaveType}</td>
                  <td className="employee-leaves-table-cell-03">{l.startDate} to {l.endDate}</td>
                  <td className="employee-leaves-table-cell-04">{l.numberOfDays}</td>
                  <td className="employee-leaves-table-cell-05">{l.reason}</td>
                  <td className="employee-leaves-table-cell-03">
                    <span className={`employee-leaves-text-01 ${
                      l.status === 'APPROVED' ? 'employee-leaves-text-02' :
                      l.status === 'REJECTED' ? 'employee-leaves-text-03' : 'employee-leaves-text-04'
                    }`}>{l.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showApplyModal && (
        <div className="employee-leaves-section-05">
          <form onSubmit={handleApply} className="employee-leaves-form-01">
            <h3 className="employee-leaves-heading-02">Submit Leave Application</h3>
            <div>
              <label className="employee-leaves-label-01">Leave Category</label>
              <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="employee-leaves-select-01">
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EARNED">Earned Leave</option>
              </select>
            </div>
            <div className="employee-leaves-section-06">
              <div>
                <label className="employee-leaves-label-01">Start Date</label>
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="employee-leaves-input-01" />
              </div>
              <div>
                <label className="employee-leaves-label-01">End Date</label>
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="employee-leaves-input-01" />
              </div>
            </div>
            <div>
              <label className="employee-leaves-label-01">Reason</label>
              <textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="employee-leaves-textarea-01" />
            </div>
            <div className="employee-leaves-section-07">
              <button type="button" onClick={() => setShowApplyModal(false)} className="employee-leaves-button-02">Cancel</button>
              <button type="submit" className="employee-leaves-button-03">Submit to Team Leader</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};