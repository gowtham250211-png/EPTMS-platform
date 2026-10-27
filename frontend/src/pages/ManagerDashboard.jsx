import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Users, Plus, CheckSquare, Layers } from 'lucide-react';

export const ManagerDashboard = () => {
  const [tls, setTls] = useState([]);
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Core Architecture');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ROLE_EMPLOYEE');

  const loadData = () => {
    api.get('/manager/my-team-leads').then((res) => setTls(Array.isArray(res.data) ? res.data : []));
    api.get('/manager/my-staff').then((res) => setStaff(Array.isArray(res.data) ? res.data : []));
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignTLTask = async (e) => {
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
    setShowTaskModal(false);
    setTitle('');
    setDescription('');
    loadData();
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    await api.post('/manager/create-worker', { fullName, email, role });
    setShowWorkerModal(false);
    setFullName('');
    setEmail('');
    loadData();
  };

  return (
    <div className="manager-dashboard-section-01">
      <div className="manager-dashboard-section-02">
        <div>
          <h1 className="manager-dashboard-heading-01">Manager Department View</h1>
          <p className="manager-dashboard-description-01">Oversee TLs, delegate project sectors, and onboard department staff</p>
        </div>
        <div className="manager-dashboard-section-03">
          <button
            onClick={() => setShowWorkerModal(true)}
            className="manager-dashboard-button-01"
          >
            <Plus size={15} /> Add Team Member / TL
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="manager-dashboard-button-02"
          >
            <Plus size={15} /> Delegate Task to TL
          </button>
        </div>
      </div>

      <div className="manager-dashboard-section-04">
        <div className="manager-dashboard-section-05">
          <div className="manager-dashboard-section-06">
            <h2 className="manager-dashboard-heading-02">
              <Users size={16} className="manager-dashboard-users-01" /> Direct Team Leaders
            </h2>
            <span className="manager-dashboard-text-01">{tls.length} Active TLs</span>
          </div>
          <div className="manager-dashboard-section-07">
            {tls.map((tl) => (
              <div key={tl.id} className="manager-dashboard-section-08">
                <div>
                  <p className="manager-dashboard-description-02">{tl.fullName}</p>
                  <p className="manager-dashboard-description-03">{tl.email}</p>
                </div>
                <span className="manager-dashboard-text-02">
                  {tl.performanceScore}% Score
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="manager-dashboard-section-05">
          <div className="manager-dashboard-section-06">
            <h2 className="manager-dashboard-heading-02">
              <Layers size={16} className="manager-dashboard-layers-01" /> Department Personnel
            </h2>
            <span className="manager-dashboard-text-01">{staff.length} Total Members</span>
          </div>
          <div className="manager-dashboard-section-09">
            {staff.map((s) => (
              <div key={s.id} className="manager-dashboard-section-10">
                <div>
                  <span className="manager-dashboard-text-03">{s.fullName}</span>
                  <span className="manager-dashboard-text-04">{s.email}</span>
                </div>
                <span className="manager-dashboard-text-05">
                  {s.role.replace('ROLE_', '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="manager-dashboard-section-11">
        <h2 className="manager-dashboard-heading-03">
          <CheckSquare size={16} className="manager-dashboard-check-square-01" /> Sector Tasks & Deliverables Under Management
        </h2>
        {tasks.map((t) => (
          <div key={t.id} className="manager-dashboard-section-12">
            <div>
              <div className="manager-dashboard-section-13">
                <span className="manager-dashboard-text-06">{t.sector}</span>
                <h3 className="manager-dashboard-heading-04">{t.title}</h3>
              </div>
              <p className="manager-dashboard-description-03">{t.description}</p>
              <p className="manager-dashboard-description-04">Lead: <strong className="manager-dashboard-emphasis-01">{t.assignedTo?.fullName}</strong> | Due: {t.dueDate}</p>
            </div>
            <span className="manager-dashboard-text-07">{t.status}</span>
          </div>
        ))}
      </div>

      {showTaskModal && (
        <div className="manager-dashboard-section-14">
          <form onSubmit={handleAssignTLTask} className="manager-dashboard-form-01">
            <h3 className="manager-dashboard-heading-05">Delegate Project Task to TL</h3>
            <div>
              <label className="manager-dashboard-label-01">Project Deliverable Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="manager-dashboard-input-01" />
            </div>
            <div>
              <label className="manager-dashboard-label-01">Sector / Department Domain</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="manager-dashboard-select-01">
                <option value="Core Architecture">Core Architecture</option>
                <option value="Fintech API & Payments">Fintech API & Payments</option>
                <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
                <option value="Frontend UI/UX">Frontend UI/UX</option>
                <option value="Security & Compliance">Security & Compliance</option>
              </select>
            </div>
            <div>
              <label className="manager-dashboard-label-01">Assign to Team Leader</label>
              <select required value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} className="manager-dashboard-select-01">
                <option value="">Select a Team Leader</option>
                {tls.map((tl) => <option key={tl.id} value={tl.id}>{tl.fullName} ({tl.email})</option>)}
              </select>
            </div>
            <div>
              <label className="manager-dashboard-label-01">Due Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="manager-dashboard-input-01" />
            </div>
            <div>
              <label className="manager-dashboard-label-01">Task Scope</label>
              <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="manager-dashboard-textarea-01" />
            </div>
            <div className="manager-dashboard-section-15">
              <button type="button" onClick={() => setShowTaskModal(false)} className="manager-dashboard-button-03">Cancel</button>
              <button type="submit" className="manager-dashboard-button-04">Assign to TL</button>
            </div>
          </form>
        </div>
      )}

      {showWorkerModal && (
        <div className="manager-dashboard-section-14">
          <form onSubmit={handleCreateWorker} className="manager-dashboard-form-02">
            <h3 className="manager-dashboard-heading-05">Onboard Department Staff</h3>
            <div>
              <label className="manager-dashboard-label-01">Full Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="manager-dashboard-input-01" />
            </div>
            <div>
              <label className="manager-dashboard-label-01">Corporate Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="manager-dashboard-input-01" />
            </div>
            <div>
              <label className="manager-dashboard-label-01">Role Designation</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="manager-dashboard-select-01">
                <option value="ROLE_EMPLOYEE">Worker (Employee)</option>
                <option value="ROLE_TL">Team Leader (TL)</option>
              </select>
            </div>
            <div className="manager-dashboard-section-15">
              <button type="button" onClick={() => setShowWorkerModal(false)} className="manager-dashboard-button-05">Cancel</button>
              <button type="submit" className="manager-dashboard-button-06">Onboard</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};