import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { SecurityControl } from '@/components/security/SecurityControl';
import { EmergencyCall } from '@/components/emergency/EmergencyCall';

export const SecurityDashboard = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onTabChange={setActiveTab} />;
      case 'properties':
        return <DashboardOverview onTabChange={setActiveTab} />;
      case 'security':
        return <SecurityControl />;
      case 'emergency':
        return <EmergencyCall />;
      case 'history':
        return <div className="text-center py-12 text-gray-500">История действий - в разработке</div>;
      case 'profile':
        return <div className="text-center py-12 text-gray-500">Профиль пользователя - в разработке</div>;
      case 'support':
        return <div className="text-center py-12 text-gray-500">Техподдержка - в разработке</div>;
      default:
        return <DashboardOverview onTabChange={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default SecurityDashboard;