import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Users, Plus, CheckSquare, Layers, Award } from 'lucide-react';

export const TLDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Task assignment form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    api.get('/tasks')
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

    api.get('/tl/my-team')
      .then((res) => setTeamMembers(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!assignedToId) return;
    await api.post('/tasks', {
      title,
      description: desc,
      sector,
      priority: 'HIGH',
      estimatedHours: 8,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      assignedToId: Number(assignedToId),
    });
    setTitle('');
    setDesc('');
    setShowModal(false);
    loadData();
  };

  return (
    <div className="tldashboard-section-01">
      <div className="tldashboard-section-02">
        <div>
          <h1 className="tldashboard-heading-01">Team Leader Command</h1>
          <p className="tldashboard-description-01">
            Monitor direct reports, assign sprint deliverables, and track velocity
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="tldashboard-button-01"
        >
          <Plus size={16} /> Assign Task to Employee
        </button>
      </div>

      {/* Tabs */}
      <div className="tldashboard-section-03">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tldashboard-button-02 ${
            activeTab === 'overview' ? 'tldashboard-button-03' : 'tldashboard-button-04'
          }`}
        >
          <Users size={15} /> Team Overview
        </button>
        <button
          onClick={() => setActiveTab('kanban')}
          className={`tldashboard-button-02 ${
            activeTab === 'kanban' ? 'tldashboard-button-03' : 'tldashboard-button-04'
          }`}
        >
          <CheckSquare size={15} /> Sprint Kanban Board
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="tldashboard-section-04">
          <div className="tldashboard-section-05">
            <div className="tldashboard-section-06">
              <span className="tldashboard-text-01">Direct Members</span>
              <p className="tldashboard-description-02">{teamMembers.length}</p>
            </div>
            <div className="tldashboard-section-06">
              <span className="tldashboard-text-01">Active Deliverables</span>
              <p className="tldashboard-description-03">
                {tasks.filter((t) => t.status !== 'COMPLETED').length}
              </p>
            </div>
            <div className="tldashboard-section-06">
              <span className="tldashboard-text-01">Sprint Velocity</span>
              <p className="tldashboard-description-04">94.8%</p>
            </div>
          </div>

          <div className="tldashboard-section-07">
            <div className="tldashboard-section-08">
              Assigned Team Personnel Directory
            </div>
            <table className="tldashboard-table-01">
              <thead className="tldashboard-thead-01">
                <tr>
                  <th className="tldashboard-table-heading-01">Staff Member</th>
                  <th className="tldashboard-table-heading-01">Email</th>
                  <th className="tldashboard-table-heading-01">Performance Score</th>
                  <th className="tldashboard-table-heading-01">XP Points</th>
                  <th className="tldashboard-table-heading-01">Active Tasks</th>
                </tr>
              </thead>
              <tbody className="tldashboard-tbody-01">
                {teamMembers.map((m) => (
                  <tr key={m.id} className="tldashboard-table-row-01">
                    <td className="tldashboard-table-cell-01">{m.fullName}</td>
                    <td className="tldashboard-table-cell-02">{m.email}</td>
                    <td className="tldashboard-table-cell-03">{m.performanceScore ?? 85}%</td>
                    <td className="tldashboard-table-cell-04">{m.xpPoints ?? 0} XP</td>
                    <td className="tldashboard-table-cell-02">
                      <span className="tldashboard-text-02">
                        {tasks.filter((t) => t.assignedTo?.id === m.id && t.status !== 'COMPLETED').length} Tasks
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="tldashboard-section-09">
          {['ASSIGNED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'].map((status) => (
            <div key={status} className="tldashboard-section-10">
              <h2 className="tldashboard-heading-02">
                {status.replace('_', ' ')}
              </h2>
              <div className="tldashboard-section-11">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <div key={task.id} className="tldashboard-section-12">
                      <span className="tldashboard-text-03">
                        {task.sector || 'Core'}
                      </span>
                      <h3 className="tldashboard-heading-03">{task.title}</h3>
                      <p className="tldashboard-description-05">{task.description}</p>
                      <p className="tldashboard-description-06">
                        Assignee: <strong className="tldashboard-emphasis-01">{task.assignedTo?.fullName}</strong>
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Delegation Modal */}
      {showModal && (
        <div className="tldashboard-section-13">
          <form onSubmit={handleCreateTask} className="tldashboard-form-01">
            <h3 className="tldashboard-heading-04">Assign Work Item to Employee</h3>
            <div>
              <label className="tldashboard-label-01">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="tldashboard-input-01"
              />
            </div>
            <div>
              <label className="tldashboard-label-01">Domain Sector</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="tldashboard-input-01"
              />
            </div>
            <div>
              <label className="tldashboard-label-01">Assign to Employee</label>
              <select
                required
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="tldashboard-select-01"
              >
                <option value="">Select Employee</option>
                {teamMembers.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="tldashboard-label-01">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="tldashboard-input-01"
              />
            </div>
            <div>
              <label className="tldashboard-label-01">Description</label>
              <textarea
                required
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="tldashboard-textarea-01"
              />
            </div>
            <div className="tldashboard-section-14">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="tldashboard-button-05"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="tldashboard-button-06"
              >
                Assign Deliverable
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};