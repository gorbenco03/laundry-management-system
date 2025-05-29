import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  QrCode, 
  Search, 
  BarChart, 
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Meniu pentru angajat
  const employeeMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/employee' },
    { id: 'new-order', label: 'Comandă Nouă', icon: Plus, path: '/employee/new-order' },
    { id: 'scan', label: 'Scanare Articole', icon: QrCode, path: '/employee/scan' },
    { id: 'search', label: 'Căutare Comandă', icon: Search, path: '/employee/search' },
  ];

  // Meniu pentru administrator
  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
    { id: 'orders', label: 'Toate Comenzile', icon: Package, path: '/admin/orders' },
    { id: 'reports', label: 'Rapoarte', icon: BarChart, path: '/admin/reports' },
    { id: 'employees', label: 'Angajați', icon: Users, path: '/admin/employees' },
    { id: 'settings', label: 'Setări', icon: Settings, path: '/admin/settings' },
  ];

  const menuItems = user?.role === UserRole.ADMIN ? adminMenuItems : employeeMenuItems;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/employee' && path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <>
      {/* Overlay pentru mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">Curătătorie</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${active 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info & Logout */}
          <div className="border-t p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === UserRole.ADMIN ? 'Administrator' : 'Angajat'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Deconectare
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;