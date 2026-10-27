import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, CheckSquare, Layers } from 'lucide-react';

export const TLTaskAssignment = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
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
    <div className="tltask-assignment-section-01">
      <div className="tltask-assignment-section-02">
        <div>
          <h1 className="tltask-assignment-heading-01">Sprint Task Delegation</h1>
          <p className="tltask-assignment-description-01">
            Create, assign, and track employee sprint deliverables on the Kanban board
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="tltask-assignment-button-01"
        >
          <Plus size={16} /> Assign Deliverable to Employee
        </button>
      </div>

      {/* Kanban Board */}
      <div className="tltask-assignment-section-03">
        {['ASSIGNED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'].map((status) => (
          <div key={status} className="tltask-assignment-section-04">
            <h2 className="tltask-assignment-heading-02">
              {status.replace('_', ' ')}
            </h2>
            <div className="tltask-assignment-section-05">
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div key={task.id} className="tltask-assignment-section-06">
                    <span className="tltask-assignment-text-01">
                      {task.sector || 'Core'}
                    </span>
                    <h3 className="tltask-assignment-heading-03">{task.title}</h3>
                    <p className="tltask-assignment-description-02">{task.description}</p>
                    <p className="tltask-assignment-description-03">
                      Assignee: <strong className="tltask-assignment-emphasis-01">{task.assignedTo?.fullName || 'Unassigned'}</strong>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal */}
      {showModal && (
        <div className="tltask-assignment-section-07">
          <form onSubmit={handleCreateTask} className="tltask-assignment-form-01">
            <h3 className="tltask-assignment-heading-04">Assign Work Item to Employee</h3>
            <div>
              <label className="tltask-assignment-label-01">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="tltask-assignment-input-01"
              />
            </div>
            <div>
              <label className="tltask-assignment-label-01">Sector Domain</label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="tltask-assignment-input-01"
              />
            </div>
            <div>
              <label className="tltask-assignment-label-01">Assign to Employee</label>
              <select
                required
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="tltask-assignment-select-01"
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
              <label className="tltask-assignment-label-01">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="tltask-assignment-input-01"
              />
            </div>
            <div>
              <label className="tltask-assignment-label-01">Description</label>
              <textarea
                required
                rows={2}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="tltask-assignment-textarea-01"
              />
            </div>
            <div className="tltask-assignment-section-08">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="tltask-assignment-button-02"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="tltask-assignment-button-03"
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