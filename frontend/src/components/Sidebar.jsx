import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, Calendar, ShieldAlert, LogOut, Briefcase } from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'ROLE_ADMIN':
        return [
          { name: 'Organization & Staff', path: '/admin', icon: LayoutDashboard },
          { name: 'All Tasks Monitor', path: '/admin/tasks', icon: CheckSquare },
          { name: 'Manager Leaves', path: '/admin/leaves', icon: Calendar },
          { name: 'Audit Logs', path: '/admin/audit', icon: ShieldAlert },
        ];
      case 'ROLE_MANAGER':
        return [
          { name: 'Department Overview', path: '/manager', icon: LayoutDashboard },
          { name: 'Assign Tasks to TL', path: '/manager/tasks', icon: CheckSquare },
          { name: 'Approve TL Leaves', path: '/manager/leaves', icon: Calendar },
        ];
      case 'ROLE_TL':
        return [
          { name: 'Team Sprint & Staff', path: '/tl', icon: LayoutDashboard },
          { name: 'Assign Deliverables', path: '/tl/tasks', icon: CheckSquare },
          { name: 'Approve Leaves', path: '/tl/leaves', icon: Calendar },
        ];
      default:
        return [
          { name: 'My Workspace', path: '/employee', icon: LayoutDashboard },
          { name: 'Assigned Deliverables', path: '/employee/tasks', icon: CheckSquare },
          { name: 'Apply Leave', path: '/employee/leaves', icon: Calendar },
        ];
    }
  };

  return (
    <aside className="sidebar-sidebar-01">
      <div>
        <div className="sidebar-section-01">
          <div className="sidebar-section-02">
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="sidebar-heading-01">EPTMS Platform</h1>
            <p className="sidebar-description-01">{user?.role?.replace('ROLE_', '')}</p>
          </div>
        </div>

        <nav className="sidebar-navigation-01">
          {getNavLinks().map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-link-01 ${
                  active 
                    ? 'sidebar-link-02' 
                    : 'sidebar-link-03'
                }`}
              >
                <Icon size={18} className={active ? 'sidebar-icon-01' : 'sidebar-icon-02'} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-section-03">
        <div className="sidebar-section-04">
          <div className="sidebar-section-05">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="sidebar-section-06">
            <p className="sidebar-description-02">{user?.fullName}</p>
            <p className="sidebar-description-03">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-button-01"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};