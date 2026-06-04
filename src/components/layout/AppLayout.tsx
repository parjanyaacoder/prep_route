import { Outlet, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Edit3, ClipboardList, Bell } from 'lucide-react';
import type { RootState } from '../../store/store';

export default function AppLayout() {
  const { user } = useSelector((state: RootState) => state.auth);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Test Creation', path: '/tests/create', icon: Edit3 },
    { name: 'Test Tracking', path: '/tests/tracking', icon: ClipboardList },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 pb-8">
          <img 
            src="/preproute_logo.webp" 
            alt="PrepRoute Logo" 
            className="h-8 object-contain"
          />
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EBF1FF] text-[#1B5DEF]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-end px-8">
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=FFEDD5&color=C2410C`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900">{user?.name || 'Admin User'}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
