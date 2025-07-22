import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Панель управления', icon: 'LayoutDashboard' },
  { id: 'properties', label: 'Мои участки', icon: 'Home' },
  { id: 'security', label: 'Управление охраной', icon: 'Shield' },
  { id: 'emergency', label: 'Экстренный вызов', icon: 'Phone' },
  { id: 'history', label: 'История действий', icon: 'History' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'support', label: 'Техподдержка', icon: 'MessageCircle' },
];

export const DashboardLayout = ({ children, activeTab, onTabChange }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Icon name="Menu" className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Охранная система</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Icon name="User" className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Icon name="LogOut" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-white shadow-sm border-r border-gray-200 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-16",
          "lg:w-64 lg:block",
          isSidebarOpen ? "block" : "hidden lg:block"
        )}>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id && "bg-blue-50 text-blue-700 hover:bg-blue-100"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon name={item.icon as any} className="h-4 w-4" />
                <span className={cn("ml-2", !isSidebarOpen && "lg:inline hidden")}>
                  {item.label}
                </span>
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};