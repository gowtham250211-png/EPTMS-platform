import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { CheckCircle2, Clock, Check, Layers } from 'lucide-react';

export const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = () => {
    setLoading(true);
    api.get('/tasks')
      .then((res) => setTasks(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateProgress = async (taskId, progress) => {
    const status = progress === 100 ? 'COMPLETED' : 'IN_PROGRESS';
    await api.patch(`/tasks/${taskId}/status`, { status, progress });
    loadTasks();
  };

  return (
    <div className="employee-tasks-section-01">
      <div>
        <h1 className="employee-tasks-heading-01">My Assigned Deliverables</h1>
        <p className="employee-tasks-description-01">
          Track sprint tasks, update progress milestones, and complete deliverables for XP
        </p>
      </div>

      <div className="employee-tasks-section-02">
        <div className="employee-tasks-section-03">
          <span className="employee-tasks-text-01">In Progress</span>
          <p className="employee-tasks-description-02">
            {tasks.filter((t) => t.status !== 'COMPLETED').length}
          </p>
        </div>
        <div className="employee-tasks-section-03">
          <span className="employee-tasks-text-01">Completed</span>
          <p className="employee-tasks-description-03">
            {tasks.filter((t) => t.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="employee-tasks-section-03">
          <span className="employee-tasks-text-01">Total Work Items</span>
          <p className="employee-tasks-description-04">{tasks.length}</p>
        </div>
      </div>

      <div className="employee-tasks-section-04">
        <h2 className="employee-tasks-heading-02">Active Work Items</h2>
        {loading ? (
          <p className="employee-tasks-description-05">Loading deliverables...</p>
        ) : tasks.length === 0 ? (
          <p className="employee-tasks-description-05">No deliverables assigned yet.</p>
        ) : (
          <div className="employee-tasks-section-05">
            {tasks.map((task) => (
              <div key={task.id} className="employee-tasks-section-06">
                <div className="employee-tasks-section-07">
                  <div>
                    <div className="employee-tasks-section-08">
                      <span className="employee-tasks-text-02">
                        {task.sector || 'Core Architecture'}
                      </span>
                      <span className="employee-tasks-text-03">
                        {task.priority}
                      </span>
                      <h3 className="employee-tasks-heading-03">{task.title}</h3>
                    </div>
                    <p className="employee-tasks-description-06">{task.description}</p>
                    <p className="employee-tasks-description-07">
                      Due: <strong className="employee-tasks-emphasis-01">{task.dueDate || 'Flexible'}</strong> · Estimated: {task.estimatedHours || 8} hrs
                    </p>
                  </div>
                  <span
                    className={`employee-tasks-text-04 ${
                      task.status === 'COMPLETED'
                        ? 'employee-tasks-text-05'
                        : 'employee-tasks-text-06'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {task.status !== 'COMPLETED' ? (
                  <div className="employee-tasks-section-09">
                    <div className="employee-tasks-section-10">
                      <span className="employee-tasks-text-07">Set Progress:</span>
                      {[25, 50, 75].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => updateProgress(task.id, pct)}
                          className="employee-tasks-button-01"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => updateProgress(task.id, 100)}
                      className="employee-tasks-button-02"
                    >
                      <Check size={14} /> Mark Complete (+15 XP)
                    </button>
                  </div>
                ) : (
                  <div className="employee-tasks-section-11">
                    <span className="employee-tasks-text-08">
                      <CheckCircle2 size={14} /> Deliverable Completed & XP Added
                    </span>
                    <span className="employee-tasks-text-09">Status: Archived</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};