import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Users, UserCheck, ShieldCheck, CheckCircle2, Eye, CheckSquare } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  const [selectedUser, setSelectedUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [newRole, setNewRole] = useState('ROLE_EMPLOYEE');

  const fetchData = () => {
    api.get('/admin/stats').then((res) => setStats(res.data)).catch(console.error);
    api.get('/admin/users').then((res) => setUsers(Array.isArray(res.data) ? res.data : [])).catch(console.error);
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : [])).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    await api.post('/admin/change-role', { userId: selectedUser.id, newRole });
    setSelectedUser(null);
    fetchData();
  };

  return (
    <div className="admin-dashboard-section-01">
      <div>
        <h1 className="admin-dashboard-heading-01">Organization Governance</h1>
        <p className="admin-dashboard-description-01">Monitor all 3 roles, reassign positions, and inspect staff profiles</p>
      </div>

      <div className="admin-dashboard-section-02">
        <div className="admin-dashboard-section-03">
          <div className="admin-dashboard-section-04">
            <span className="admin-dashboard-text-01">Employees</span>
            <Users size={18} className="admin-dashboard-users-01" />
          </div>
          <span className="admin-dashboard-text-02">{stats.totalEmployees ?? 0}</span>
        </div>
        <div className="admin-dashboard-section-03">
          <div className="admin-dashboard-section-04">
            <span className="admin-dashboard-text-01">Team Leaders</span>
            <UserCheck size={18} className="admin-dashboard-user-check-01" />
          </div>
          <span className="admin-dashboard-text-02">{stats.totalTLs ?? 0}</span>
        </div>
        <div className="admin-dashboard-section-03">
          <div className="admin-dashboard-section-04">
            <span className="admin-dashboard-text-01">Managers</span>
            <ShieldCheck size={18} className="admin-dashboard-shield-check-01" />
          </div>
          <span className="admin-dashboard-text-02">{stats.totalManagers ?? 0}</span>
        </div>
        <div className="admin-dashboard-section-03">
          <div className="admin-dashboard-section-04">
            <span className="admin-dashboard-text-01">Completed Tasks</span>
            <CheckCircle2 size={18} className="admin-dashboard-check-circle2-01" />
          </div>
          <span className="admin-dashboard-text-02">{stats.completedTasks ?? 0}</span>
        </div>
      </div>

      <div className="admin-dashboard-section-05">
        <button
          onClick={() => setActiveTab('users')}
          className={`admin-dashboard-button-01 ${
            activeTab === 'users' ? 'admin-dashboard-button-02' : 'admin-dashboard-button-03'
          }`}
        >
          <Users size={15} /> All Personnel Directory
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`admin-dashboard-button-01 ${
            activeTab === 'tasks' ? 'admin-dashboard-button-02' : 'admin-dashboard-button-03'
          }`}
        >
          <CheckSquare size={15} /> Task Activity Monitor
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="admin-dashboard-section-06">
          <table className="admin-dashboard-table-01">
            <thead className="admin-dashboard-thead-01">
              <tr>
                <th className="admin-dashboard-table-heading-01">Name</th>
                <th className="admin-dashboard-table-heading-01">Email</th>
                <th className="admin-dashboard-table-heading-01">Role</th>
                <th className="admin-dashboard-table-heading-01">Performance</th>
                <th className="admin-dashboard-table-heading-01">Actions</th>
              </tr>
            </thead>
            <tbody className="admin-dashboard-tbody-01">
              {users.map((u) => (
                <tr key={u.id} className="admin-dashboard-table-row-01">
                  <td className="admin-dashboard-table-cell-01">{u.fullName}</td>
                  <td className="admin-dashboard-table-cell-02">{u.email}</td>
                  <td className="admin-dashboard-table-cell-02">
                    <span className={`admin-dashboard-text-03 ${
                      u.role === 'ROLE_ADMIN' ? 'admin-dashboard-text-04' :
                      u.role === 'ROLE_MANAGER' ? 'admin-dashboard-text-05' :
                      u.role === 'ROLE_TL' ? 'admin-dashboard-text-06' : 'admin-dashboard-text-07'
                    }`}>
                      {u.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="admin-dashboard-table-cell-03">{u.performanceScore ?? 85}%</td>
                  <td className="admin-dashboard-table-cell-04">
                    <button
                      onClick={() => setProfileUser(u)}
                      className="admin-dashboard-button-04"
                    >
                      <Eye size={13} /> View Profile
                    </button>
                    {u.role !== 'ROLE_ADMIN' && (
                      <button
                        onClick={() => { setSelectedUser(u); setNewRole(u.role); }}
                        className="admin-dashboard-button-05"
                      >
                        Change Position
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-dashboard-section-07">
          <h2 className="admin-dashboard-heading-02">Organization Task Activity & Delegation</h2>
          {tasks.map((task) => (
            <div key={task.id} className="admin-dashboard-section-08">
              <div>
                <div className="admin-dashboard-section-09">
                  <span className="admin-dashboard-text-08">{task.sector || 'Core'}</span>
                  <h3 className="admin-dashboard-heading-03">{task.title}</h3>
                </div>
                <p className="admin-dashboard-description-02">{task.description}</p>
                <p className="admin-dashboard-description-03">
                  Assigned to: <strong className="admin-dashboard-emphasis-01">{task.assignedTo?.fullName}</strong> by <strong className="admin-dashboard-emphasis-01">{task.createdBy?.fullName}</strong>
                </p>
              </div>
              <span className="admin-dashboard-text-09">{task.status}</span>
            </div>
          ))}
        </div>
      )}

      {profileUser && (
        <div className="admin-dashboard-section-10">
          <div className="admin-dashboard-section-11">
            <div className="admin-dashboard-section-12">
              <div className="admin-dashboard-section-13">
                {profileUser.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="admin-dashboard-heading-04">{profileUser.fullName}</h3>
                <p className="admin-dashboard-description-04">{profileUser.email}</p>
              </div>
            </div>
            <div className="admin-dashboard-section-14">
              <div className="admin-dashboard-section-15">
                <span className="admin-dashboard-text-10">Position</span>
                <span className="admin-dashboard-text-11">{profileUser.role.replace('ROLE_', '')}</span>
              </div>
              <div className="admin-dashboard-section-15">
                <span className="admin-dashboard-text-10">Performance</span>
                <span className="admin-dashboard-text-12">{profileUser.performanceScore}%</span>
              </div>
              <div className="admin-dashboard-section-15">
                <span className="admin-dashboard-text-10">XP Accrued</span>
                <span className="admin-dashboard-text-13">{profileUser.xpPoints ?? 0} XP</span>
              </div>
              <div className="admin-dashboard-section-15">
                <span className="admin-dashboard-text-10">Leave Balances</span>
                <span className="admin-dashboard-text-11">Casual: {profileUser.casualLeaveBalance ?? 12} | Sick: {profileUser.sickLeaveBalance ?? 8}</span>
              </div>
            </div>
            <div className="admin-dashboard-section-16">
              <button
                onClick={() => setProfileUser(null)}
                className="admin-dashboard-button-06"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="admin-dashboard-section-10">
          <div className="admin-dashboard-section-17">
            <h3 className="admin-dashboard-heading-05">Reassign Position: {selectedUser.fullName}</h3>
            <div>
              <label className="admin-dashboard-label-01">Select New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="admin-dashboard-select-01"
              >
                <option value="ROLE_EMPLOYEE">Employee (Worker)</option>
                <option value="ROLE_TL">Team Leader (TL)</option>
                <option value="ROLE_MANAGER">Department Manager</option>
              </select>
            </div>
            <div className="admin-dashboard-section-18">
              <button onClick={() => setSelectedUser(null)} className="admin-dashboard-button-07">Cancel</button>
              <button onClick={handleRoleChange} className="admin-dashboard-button-08">Confirm Role Change</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};