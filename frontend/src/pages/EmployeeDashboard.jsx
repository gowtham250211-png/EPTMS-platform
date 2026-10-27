import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Award, CheckCircle, Zap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks')
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Failed to fetch tasks:', err));
  }, []);

  const completeTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, {
        status: 'COMPLETED',
        progress: 100,
      });
      const res = await api.get('/tasks');
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  return (
    <div className="employee-dashboard-section-01">
      <div className="employee-dashboard-section-02">
        <div>
          <h1 className="employee-dashboard-heading-01">My Workspace</h1>
          <p className="employee-dashboard-description-01">
            Welcome back, {user?.fullName} · Team: {user?.teamName || 'Core Operations'}
          </p>
        </div>
        <Link
          to="/leave"
          className="employee-dashboard-link-01"
        >
          <Calendar size={15} />
          <span>Apply for Leave</span>
        </Link>
      </div>

      <div className="employee-dashboard-section-03">
        <div className="employee-dashboard-section-04">
          <div className="employee-dashboard-section-05">
            <span className="employee-dashboard-text-01">Performance</span>
            <Zap className="employee-dashboard-zap-01" size={18} />
          </div>
          <div className="employee-dashboard-section-06">
            {user?.performanceScore ?? 87} / 100
          </div>
          <progress
            className="employee-performance-progress"
            value={user?.performanceScore ?? 87}
            max={100}
            aria-label="Performance score"
          />
        </div>

        <div className="employee-dashboard-section-04">
          <div className="employee-dashboard-section-05">
            <span className="employee-dashboard-text-01">Gamification XP</span>
            <Award className="employee-dashboard-award-01" size={18} />
          </div>
          <div className="employee-dashboard-section-09">
            {user?.xpPoints ?? 950} XP
          </div>
          <p className="employee-dashboard-description-02">Level 4 Contributor</p>
        </div>

        <div className="employee-dashboard-section-04">
          <div className="employee-dashboard-section-05">
            <span className="employee-dashboard-text-01">Active Tasks</span>
            <CheckCircle className="employee-dashboard-check-circle-01" size={18} />
          </div>
          <div className="employee-dashboard-section-09">
            {tasks.filter((t) => t.status !== 'COMPLETED').length}
          </div>
          <p className="employee-dashboard-description-03">Assigned by Team Leader</p>
        </div>

        <div className="employee-dashboard-section-04">
          <div className="employee-dashboard-section-05">
            <span className="employee-dashboard-text-01">Leave Balances</span>
            <Calendar className="employee-dashboard-calendar-01" size={18} />
          </div>
          <div className="employee-dashboard-section-10">
            <p>Casual: <strong className="employee-dashboard-emphasis-01">{user?.casualLeave ?? 12}</strong></p>
            <p>Sick: <strong className="employee-dashboard-emphasis-01">{user?.sickLeave ?? 8}</strong></p>
          </div>
        </div>
      </div>

      <div className="employee-dashboard-section-11">
        <h2 className="employee-dashboard-heading-02">My Assigned Tasks (Execution & Updates)</h2>
        {tasks.length === 0 ? (
          <p className="employee-dashboard-description-04">No tasks assigned yet.</p>
        ) : (
          <div className="employee-dashboard-section-12">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="employee-dashboard-section-13"
              >
                <div>
                  <h3 className="employee-dashboard-heading-03">{task.title}</h3>
                  <p className="employee-dashboard-description-05">{task.description}</p>
                  <div className="employee-dashboard-section-14">
                    <span className="employee-dashboard-text-02">
                      {task.priority}
                    </span>
                    <span className="employee-dashboard-text-03">
                      {task.status}
                    </span>
                  </div>
                </div>
                {task.status !== 'COMPLETED' ? (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="employee-dashboard-button-01"
                  >
                    Mark Complete (+15 XP)
                  </button>
                ) : (
                  <span className="employee-dashboard-text-04">
                    <CheckCircle size={14} /> Completed
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};