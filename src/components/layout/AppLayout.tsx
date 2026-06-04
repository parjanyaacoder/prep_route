import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">PrepRoute</h1>
        </div>
        <nav className="p-4">
          <div className="text-gray-600 font-medium p-2 bg-blue-50 rounded-lg text-blue-700">
            Dashboard
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-end">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
              V
            </div>
            <span className="font-medium text-gray-700">Vedant Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
