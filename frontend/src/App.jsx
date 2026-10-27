import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminTasks } from './pages/AdminTasks';
import { AdminLeaves } from './pages/AdminLeaves';
import { AuditLogs } from './pages/AuditLogs';

// Manager Pages
import { ManagerDashboard } from './pages/ManagerDashboard';
import { ManagerTasks } from './pages/ManagerTasks';
import { ManagerLeaves } from './pages/ManagerLeaves';

// TL Pages
import { TLOverview } from './pages/TLOverview';
import { TLTasks } from './pages/TLTasks';
import { TLLeaves } from './pages/TLLeaves';

// Employee Pages
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeTasks } from './pages/EmployeeTasks';
import { EmployeeLeaves } from './pages/EmployeeLeaves';

const ProtectedLayout = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-section-01">
      <Sidebar />
      <main className="app-main-01">{children}</main>
    </div>
  );
};

// Smart redirect to the user's role-specific dashboard
const RoleHomeRedirect = () => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'ROLE_MANAGER') return <Navigate to="/manager" replace />;
  if (user.role === 'ROLE_TL') return <Navigate to="/tl" replace />;
  return <Navigate to="/employee" replace />;
};

// Forward generic /tasks clicks to the user's role-specific tasks page
const GenericTaskRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin/tasks" replace />;
  if (user?.role === 'ROLE_MANAGER') return <Navigate to="/manager/tasks" replace />;
  if (user?.role === 'ROLE_TL') return <Navigate to="/tl/tasks" replace />;
  return <Navigate to="/employee/tasks" replace />;
};

// Forward generic /leave clicks to the user's role-specific leave page
const GenericLeaveRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin/leaves" replace />;
  if (user?.role === 'ROLE_MANAGER') return <Navigate to="/manager/leaves" replace />;
  if (user?.role === 'ROLE_TL') return <Navigate to="/tl/leaves" replace />;
  return <Navigate to="/employee/leaves" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<RoleHomeRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedLayout><AdminDashboard /></ProtectedLayout>} />
          <Route path="/admin/tasks" element={<ProtectedLayout><AdminTasks /></ProtectedLayout>} />
          <Route path="/admin/leaves" element={<ProtectedLayout><AdminLeaves /></ProtectedLayout>} />
          <Route path="/admin/audit" element={<ProtectedLayout><AuditLogs /></ProtectedLayout>} />

          {/* Manager Routes */}
          <Route path="/manager" element={<ProtectedLayout><ManagerDashboard /></ProtectedLayout>} />
          <Route path="/manager/tasks" element={<ProtectedLayout><ManagerTasks /></ProtectedLayout>} />
          <Route path="/manager/leaves" element={<ProtectedLayout><ManagerLeaves /></ProtectedLayout>} />

          {/* Team Leader Routes */}
          <Route path="/tl" element={<ProtectedLayout><TLOverview /></ProtectedLayout>} />
          <Route path="/tl/tasks" element={<ProtectedLayout><TLTasks /></ProtectedLayout>} />
          <Route path="/tl/leaves" element={<ProtectedLayout><TLLeaves /></ProtectedLayout>} />

          {/* Employee Routes */}
          <Route path="/employee" element={<ProtectedLayout><EmployeeDashboard /></ProtectedLayout>} />
          <Route path="/employee/tasks" element={<ProtectedLayout><EmployeeTasks /></ProtectedLayout>} />
          <Route path="/employee/leaves" element={<ProtectedLayout><EmployeeLeaves /></ProtectedLayout>} />

          {/* Alias / Fallback Route Resolvers */}
          <Route path="/tasks" element={<GenericTaskRedirect />} />
          <Route path="/leave" element={<GenericLeaveRedirect />} />
          <Route path="*" element={<RoleHomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}