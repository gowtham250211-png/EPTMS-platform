import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, CheckSquare } from 'lucide-react';

export const TLTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
    api.get('/tl/my-team').then((res) => setTeamMembers(Array.isArray(res.data) ? res.data : []));
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
    <div className="tltasks-section-01">
      <div className="tltasks-section-02">
        <div>
          <h1 className="tltasks-heading-01">Sprint Kanban & Task Assignment</h1>
          <p className="tltasks-description-01">Assign deliverables to team members and oversee the sprint workflow</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="tltasks-button-01"
        >
          <Plus size={16} /> Assign Task to Employee
        </button>
      </div>

      <div className="tltasks-section-03">
        {['ASSIGNED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'].map((status) => (
          <div key={status} className="tltasks-section-04">
            <h2 className="tltasks-heading-02">
              {status.replace('_', ' ')}
            </h2>
            <div className="tltasks-section-05">
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div key={task.id} className="tltasks-section-06">
                    <span className="tltasks-text-01">
                      {task.sector || 'Core'}
                    </span>
                    <h3 className="tltasks-heading-03">{task.title}</h3>
                    <p className="tltasks-description-02">{task.description}</p>
                    <p className="tltasks-description-03">
                      Assignee: <strong className="tltasks-emphasis-01">{task.assignedTo?.fullName || 'Unassigned'}</strong>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="tltasks-section-07">
          <form onSubmit={handleCreateTask} className="tltasks-form-01">
            <h3 className="tltasks-heading-04">Assign Work Item to Employee</h3>
            <div>
              <label className="tltasks-label-01">Task Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="tltasks-input-01" />
            </div>
            <div>
              <label className="tltasks-label-01">Sector Domain</label>
              <input type="text" required value={sector} onChange={(e) => setSector(e.target.value)} className="tltasks-input-01" />
            </div>
            <div>
              <label className="tltasks-label-01">Assign to Employee</label>
              <select required value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className="tltasks-select-01">
                <option value="">Select Employee</option>
                {teamMembers.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="tltasks-label-01">Due Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="tltasks-input-01" />
            </div>
            <div>
              <label className="tltasks-label-01">Description</label>
              <textarea required rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} className="tltasks-textarea-01" />
            </div>
            <div className="tltasks-section-08">
              <button type="button" onClick={() => setShowModal(false)} className="tltasks-button-02">Cancel</button>
              <button type="submit" className="tltasks-button-03">Assign Deliverable</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};