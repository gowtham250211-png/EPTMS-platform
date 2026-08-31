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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shadow-xs select-none">
      <div>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 tracking-wide text-sm">EPTMS Platform</h1>
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{user?.role?.replace('ROLE_', '')}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          {getNavLinks().map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active 
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName}</p>
            <p className="text-[11px] font-medium text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all border border-red-100 cursor-pointer"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};