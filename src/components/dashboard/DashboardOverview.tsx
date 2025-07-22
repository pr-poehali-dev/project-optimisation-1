import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Property } from '@/types/security';

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    address: 'ул. Ленина, 15, кв. 42',
    number: '1547',
    status: 'armed',
    lastStatusChange: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sensors: [
      { id: '1', type: 'motion', status: 'active', location: 'Гостиная' },
      { id: '2', type: 'door', status: 'active', location: 'Входная дверь' },
    ]
  },
  {
    id: '2',
    address: 'пр. Мира, 45А',
    number: '2103',
    status: 'disarmed',
    lastStatusChange: new Date(Date.now() - 30 * 60 * 1000),
    sensors: [
      { id: '3', type: 'motion', status: 'inactive', location: 'Спальня' },
      { id: '4', type: 'window', status: 'inactive', location: 'Окно' },
    ]
  }
];

interface DashboardOverviewProps {
  onTabChange: (tab: string) => void;
}

export const DashboardOverview = ({ onTabChange }: DashboardOverviewProps) => {
  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'armed': return 'bg-green-100 text-green-800';
      case 'disarmed': return 'bg-gray-100 text-gray-800';
      case 'alarm': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Property['status']) => {
    switch (status) {
      case 'armed': return 'На охране';
      case 'disarmed': return 'Снято с охраны';
      case 'alarm': return 'ТРЕВОГА';
      case 'maintenance': return 'Обслуживание';
      default: return 'Неизвестно';
    }
  };

  const armedCount = mockProperties.filter(p => p.status === 'armed').length;
  const totalCount = mockProperties.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
        <Button onClick={() => onTabChange('emergency')} className="bg-red-600 hover:bg-red-700">
          <Icon name="Phone" className="h-4 w-4 mr-2" />
          Экстренный вызов
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего участков</CardTitle>
            <Icon name="Home" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На охране</CardTitle>
            <Icon name="Shield" className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{armedCount}</div>
            <p className="text-xs text-muted-foreground">
              из {totalCount} участков
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Статус системы</CardTitle>
            <Icon name="Activity" className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Активна</div>
            <p className="text-xs text-muted-foreground">
              Все системы работают
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Мои участки
            <Button variant="outline" onClick={() => onTabChange('properties')}>
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="space-y-1">
                  <div className="font-medium">#{property.number}</div>
                  <div className="text-sm text-gray-600">{property.address}</div>
                  <div className="text-xs text-gray-500">
                    Изменён: {property.lastStatusChange.toLocaleString('ru-RU')}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(property.status)}>
                    {getStatusLabel(property.status)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onTabChange('security')}
                  >
                    Управление
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};