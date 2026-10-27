import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Plus, CheckSquare, Layers } from 'lucide-react';

export const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tls, setTls] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const loadData = () => {
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
    api.get('/manager/my-team-leads').then((res) => setTls(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignedToId) return;
    await api.post('/tasks', {
      title,
      description,
      sector,
      priority: 'HIGH',
      estimatedHours: 16,
      dueDate,
      assignedToId: Number(assignedToId),
    });
    setShowModal(false);
    setTitle('');
    setDescription('');
    loadData();
  };

  return (
    <div className="manager-tasks-section-01">
      <div className="manager-tasks-section-02">
        <div>
          <h1 className="manager-tasks-heading-01">Project Task Delegation</h1>
          <p className="manager-tasks-description-01">Assign macro deliverables and architectural domains directly to Team Leaders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="manager-tasks-button-01"
        >
          <Plus size={15} /> Assign Task to Team Leader
        </button>
      </div>

      <div className="manager-tasks-section-03">
        <h2 className="manager-tasks-heading-02">Current Department Projects</h2>
        {tasks.map((t) => (
          <div key={t.id} className="manager-tasks-section-04">
            <div>
              <div className="manager-tasks-section-05">
                <span className="manager-tasks-text-01">{t.sector}</span>
                <h3 className="manager-tasks-heading-03">{t.title}</h3>
              </div>
              <p className="manager-tasks-description-02">{t.description}</p>
              <p className="manager-tasks-description-03">Lead: <strong className="manager-tasks-emphasis-01">{t.assignedTo?.fullName}</strong> | Due: {t.dueDate}</p>
            </div>
            <span className="manager-tasks-text-02">{t.status}</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="manager-tasks-section-06">
          <form onSubmit={handleAssign} className="manager-tasks-form-01">
            <h3 className="manager-tasks-heading-04">Delegate Project Task to TL</h3>
            <div>
              <label className="manager-tasks-label-01">Project Deliverable Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="manager-tasks-input-01" />
            </div>
            <div>
              <label className="manager-tasks-label-01">Sector Domain</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="manager-tasks-select-01">
                <option value="Core Architecture">Core Architecture</option>
                <option value="Fintech API & Payments">Fintech API & Payments</option>
                <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                <option value="Frontend UI/UX">Frontend UI/UX</option>
                <option value="Security & Compliance">Security & Compliance</option>
              </select>
            </div>
            <div>
              <label className="manager-tasks-label-01">Assign to Team Leader</label>
              <select required value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className="manager-tasks-select-01">
                <option value="">Select a Team Leader</option>
                {tls.map((tl) => <option key={tl.id} value={tl.id}>{tl.fullName} ({tl.email})</option>)}
              </select>
            </div>
            <div>
              <label className="manager-tasks-label-01">Due Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="manager-tasks-input-02" />
            </div>
            <div>
              <label className="manager-tasks-label-01">Task Scope & Architecture</label>
              <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="manager-tasks-textarea-01" />
            </div>
            <div className="manager-tasks-section-07">
              <button type="button" onClick={() => setShowModal(false)} className="manager-tasks-button-02">Cancel</button>
              <button type="submit" className="manager-tasks-button-03">Assign to TL</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};