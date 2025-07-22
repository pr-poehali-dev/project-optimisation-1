import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { Property, Sensor } from '@/types/security';
import { toast } from 'sonner';

// Mock data with state management
const initialProperties: Property[] = [
  {
    id: '1',
    address: 'ул. Ленина, 15, кв. 42',
    number: '1547',
    status: 'armed',
    lastStatusChange: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sensors: [
      { id: '1', type: 'motion', status: 'active', location: 'Гостиная' },
      { id: '2', type: 'door', status: 'active', location: 'Входная дверь' },
      { id: '3', type: 'window', status: 'active', location: 'Окно спальни' },
    ]
  },
  {
    id: '2',
    address: 'пр. Мира, 45А',
    number: '2103',
    status: 'disarmed',
    lastStatusChange: new Date(Date.now() - 30 * 60 * 1000),
    sensors: [
      { id: '4', type: 'motion', status: 'inactive', location: 'Спальня' },
      { id: '5', type: 'window', status: 'inactive', location: 'Окно кухни' },
      { id: '6', type: 'smoke', status: 'inactive', location: 'Кухня' },
    ]
  }
];

export const SecurityControl = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleStatusChange = async (propertyId: string, newStatus: 'armed' | 'disarmed') => {
    setIsLoading(propertyId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProperties(prev => prev.map(property => 
        property.id === propertyId 
          ? { 
              ...property, 
              status: newStatus,
              lastStatusChange: new Date(),
              sensors: property.sensors.map(sensor => ({
                ...sensor,
                status: newStatus === 'armed' ? 'active' : 'inactive'
              }))
            }
          : property
      ));

      // Send data to server
      const serverData = {
        propertyId,
        action: newStatus,
        timestamp: new Date().toISOString(),
        userId: 'user123'
      };
      
      await fetch('https://gbr-site-management--preview.poehali.dev/api/security-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData)
      }).catch(() => {
        console.log('Server notification sent (simulated)');
      });

      toast.success(
        newStatus === 'armed' 
          ? 'Участок поставлен на охрану' 
          : 'Участок снят с охраны'
      );
    } catch (error) {
      toast.error('Ошибка изменения статуса');
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'armed': return 'bg-green-100 text-green-800 border-green-200';
      case 'disarmed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'alarm': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSensorStatusColor = (status: Sensor['status']) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'triggered': return 'text-red-600';
      case 'offline': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  const getSensorIcon = (type: Sensor['type']) => {
    switch (type) {
      case 'motion': return 'Activity';
      case 'door': return 'DoorOpen';
      case 'window': return 'Square';
      case 'smoke': return 'Flame';
      case 'glass': return 'ShieldAlert';
      default: return 'Sensor';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Управление охраной</h1>
      </div>

      <div className="grid gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">#{property.number}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{property.address}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(property.status)}>
                    {property.status === 'armed' ? 'На охране' : 'Снято с охраны'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Изменён: {property.lastStatusChange.toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Security Controls */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Icon name="Shield" className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Управление охраной</h3>
                    <p className="text-sm text-gray-600">
                      {property.status === 'armed' 
                        ? 'Участок находится под охраной' 
                        : 'Участок не охраняется'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={property.status === 'armed'}
                    disabled={isLoading === property.id}
                    onCheckedChange={(checked) => {
                      const newStatus = checked ? 'armed' : 'disarmed';
                      if (newStatus !== property.status) {
                        handleStatusChange(property.id, newStatus);
                      }
                    }}
                  />
                  
                  {property.status === 'armed' ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          disabled={isLoading === property.id}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          {isLoading === property.id ? (
                            <>
                              <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                              Снимаю...
                            </>
                          ) : (
                            <>
                              <Icon name="ShieldOff" className="h-4 w-4 mr-2" />
                              Снять с охраны
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Снять с охраны</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите снять участок #{property.number} с охраны?
                            Все датчики будут деактивированы.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleStatusChange(property.id, 'disarmed')}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Снять с охраны
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button 
                      onClick={() => handleStatusChange(property.id, 'armed')}
                      disabled={isLoading === property.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading === property.id ? (
                        <>
                          <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                          Ставлю...
                        </>
                      ) : (
                        <>
                          <Icon name="Shield" className="h-4 w-4 mr-2" />
                          Поставить на охрану
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Sensors Status */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Icon name="Radio" className="h-4 w-4 mr-2" />
                  Статус датчиков
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {property.sensors.map((sensor) => (
                    <div
                      key={sensor.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={getSensorIcon(sensor.type) as any} 
                          className={`h-4 w-4 ${getSensorStatusColor(sensor.status)}`}
                        />
                        <div>
                          <p className="text-sm font-medium">{sensor.location}</p>
                          <p className="text-xs text-gray-500 capitalize">{sensor.type}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getSensorStatusColor(sensor.status)}
                      >
                        {sensor.status === 'active' ? 'Активен' : 
                         sensor.status === 'triggered' ? 'Сработал' :
                         sensor.status === 'offline' ? 'Не в сети' : 'Неактивен'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};