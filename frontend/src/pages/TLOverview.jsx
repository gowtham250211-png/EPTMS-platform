import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Users, CheckSquare, Layers, Award, Target } from 'lucide-react';

export const TLOverview = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);

  useEffect(() => {
    // Fetch team employees
    api.get('/tl/my-team')
      .then((res) => setTeamMembers(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);

    // Fetch all tasks to separate parent tasks and team tasks
    api.get('/tasks')
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        // Parent tasks: Assigned to this TL by Manager
        setParentTasks(all.filter((t) => t.assignedTo?.id === user?.id));
        // Team tasks: Created by this TL for employees
        setTeamTasks(all.filter((t) => t.createdBy?.id === user?.id));
      })
      .catch(console.error);
  }, [user]);

  return (
    <div className="tloverview-section-01">
      <div>
        <h1 className="tloverview-heading-01">Team Leadership & Project Overview</h1>
        <p className="tloverview-description-01">
          Supervise team personnel, monitor performance scores, and track parent milestones assigned by Management
        </p>
      </div>

      {/* Metric Cards */}
      <div className="tloverview-section-02">
        <div className="tloverview-section-03">
          <div className="tloverview-section-04">
            <span className="tloverview-text-01">Team Members</span>
            <Users size={18} className="tloverview-users-01" />
          </div>
          <span className="tloverview-text-02">{teamMembers.length}</span>
        </div>

        <div className="tloverview-section-03">
          <div className="tloverview-section-04">
            <span className="tloverview-text-01">Manager Directives</span>
            <Target size={18} className="tloverview-target-01" />
          </div>
          <span className="tloverview-text-03">{parentTasks.length}</span>
        </div>

        <div className="tloverview-section-03">
          <div className="tloverview-section-04">
            <span className="tloverview-text-01">Active Delegations</span>
            <CheckSquare size={18} className="tloverview-check-square-01" />
          </div>
          <span className="tloverview-text-02">
            {teamTasks.filter((t) => t.status !== 'COMPLETED').length}
          </span>
        </div>

        <div className="tloverview-section-03">
          <div className="tloverview-section-04">
            <span className="tloverview-text-01">Completed Sprint Items</span>
            <Award size={18} className="tloverview-award-01" />
          </div>
          <span className="tloverview-text-04">
            {teamTasks.filter((t) => t.status === 'COMPLETED').length}
          </span>
        </div>
      </div>

      {/* Parent Deliverables from Manager */}
      <div className="tloverview-section-05">
        <div className="tloverview-section-06">
          <h2 className="tloverview-heading-02">
            <Target size={16} className="tloverview-target-01" />
            Parent Project Deliverables (Assigned to Me by Manager)
          </h2>
          <span className="tloverview-text-05">{parentTasks.length} Active Directives</span>
        </div>

        {parentTasks.length === 0 ? (
          <p className="tloverview-description-02">No parent project tasks assigned by Manager yet.</p>
        ) : (
          <div className="tloverview-section-07">
            {parentTasks.map((task) => (
              <div key={task.id} className="tloverview-section-08">
                <div className="tloverview-section-09">
                  <div>
                    <span className="tloverview-text-06">
                      {task.sector || 'Core Architecture'}
                    </span>
                    <h3 className="tloverview-heading-03">{task.title}</h3>
                  </div>
                  <span className="tloverview-text-07">
                    {task.status}
                  </span>
                </div>
                <p className="tloverview-description-03">{task.description}</p>
                <div className="tloverview-section-10">
                  <span>Due: <strong className="tloverview-emphasis-01">{task.dueDate || 'Sprint End'}</strong></span>
                  <span>Lead by: {task.createdBy?.fullName || 'Manager'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Staff Directory */}
      <div className="tloverview-section-11">
        <div className="tloverview-section-12">
          <Users size={16} className="tloverview-users-01" />
          Direct Team Members Directory
        </div>
        <table className="tloverview-table-01">
          <thead className="tloverview-thead-01">
            <tr>
              <th className="tloverview-table-heading-01">Member Name</th>
              <th className="tloverview-table-heading-01">Email</th>
              <th className="tloverview-table-heading-01">Performance Score</th>
              <th className="tloverview-table-heading-01">XP Points</th>
              <th className="tloverview-table-heading-01">Active Tasks</th>
            </tr>
          </thead>
          <tbody className="tloverview-tbody-01">
            {teamMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="tloverview-table-cell-01">No team members mapped yet.</td>
              </tr>
            ) : (
              teamMembers.map((m) => (
                <tr key={m.id} className="tloverview-table-row-01">
                  <td className="tloverview-table-cell-02">{m.fullName}</td>
                  <td className="tloverview-table-cell-03">{m.email}</td>
                  <td className="tloverview-table-cell-04">{m.performanceScore ?? 85}%</td>
                  <td className="tloverview-table-cell-05">{m.xpPoints ?? 0} XP</td>
                  <td className="tloverview-table-cell-03">
                    <span className="tloverview-text-08">
                      {teamTasks.filter((t) => t.assignedTo?.id === m.id && t.status !== 'COMPLETED').length} Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
