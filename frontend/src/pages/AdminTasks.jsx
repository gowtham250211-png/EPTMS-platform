import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { CheckSquare, Filter } from 'lucide-react';

export const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <div className="admin-tasks-section-01">
      <div>
        <h1 className="admin-tasks-heading-01">Organization Task Activity Monitor</h1>
        <p className="admin-tasks-description-01">Global audit of all deliverables across every sector and department</p>
      </div>

      <div className="admin-tasks-section-02">
        {tasks.map((task) => (
          <div key={task.id} className="admin-tasks-section-03">
            <div>
              <div className="admin-tasks-section-04">
                <span className="admin-tasks-text-01">{task.sector || 'Core'}</span>
                <h3 className="admin-tasks-heading-02">{task.title}</h3>
              </div>
              <p className="admin-tasks-description-02">{task.description}</p>
              <p className="admin-tasks-description-03">
                Assignee: <strong className="admin-tasks-emphasis-01">{task.assignedTo?.fullName}</strong> | Created By: <strong className="admin-tasks-emphasis-01">{task.createdBy?.fullName}</strong>
              </p>
            </div>
            <span className="admin-tasks-text-02">{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};