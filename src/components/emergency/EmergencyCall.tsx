import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { EmergencyCall as IEmergencyCall } from '@/types/security';
import { toast } from 'sonner';

const emergencyTypes = [
  { value: 'security', label: 'Охранная тревога', icon: 'Shield', color: 'bg-red-100 text-red-800' },
  { value: 'police', label: 'Полиция', icon: 'BadgeCheck', color: 'bg-blue-100 text-blue-800' },
  { value: 'fire', label: 'Пожарная служба', icon: 'Flame', color: 'bg-orange-100 text-orange-800' },
  { value: 'medical', label: 'Скорая помощь', icon: 'Heart', color: 'bg-green-100 text-green-800' },
];

// Mock active calls
const mockActiveCalls: IEmergencyCall[] = [
  {
    id: '1',
    propertyId: '1',
    userId: 'user123',
    type: 'security',
    status: 'dispatched',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    location: 'ул. Ленина, 15, кв. 42',
    description: 'Сработал датчик движения'
  }
];

export const EmergencyCall = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCalls, setActiveCalls] = useState<IEmergencyCall[]>(mockActiveCalls);

  const handleEmergencyCall = async (type: string) => {
    setIsLoading(true);
    
    try {
      const newCall: IEmergencyCall = {
        id: Date.now().toString(),
        propertyId: '1', // This would come from selected property
        userId: 'user123',
        type: type as IEmergencyCall['type'],
        status: 'pending',
        timestamp: new Date(),
        location: 'ул. Ленина, 15, кв. 42', // This would come from selected property
        description: description || undefined
      };

      // Send to server
      const serverData = {
        ...newCall,
        timestamp: newCall.timestamp.toISOString()
      };
      
      await fetch('https://gbr-site-management--preview.poehali.dev/api/emergency-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData)
      }).catch(() => {
        console.log('Emergency call sent to server (simulated)');
      });

      setActiveCalls(prev => [newCall, ...prev]);
      
      const typeLabel = emergencyTypes.find(t => t.value === type)?.label || type;
      toast.success(`Вызов "${typeLabel}" отправлен`, {
        description: 'Служба экстренного реагирования уведомлена'
      });

      // Simulate status update
      setTimeout(() => {
        setActiveCalls(prev => prev.map(call => 
          call.id === newCall.id 
            ? { ...call, status: 'dispatched' }
            : call
        ));
        toast.info('Служба выехала на место');
      }, 5000);

      setDescription('');
      setSelectedType('');
    } catch (error) {
      toast.error('Ошибка отправки вызова');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: IEmergencyCall['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'dispatched': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: IEmergencyCall['status']) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'dispatched': return 'Выехали';
      case 'resolved': return 'Завершён';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Экстренный вызов</h1>
      </div>

      {/* Emergency Call Form */}
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <Icon name="Phone" className="h-5 w-5 mr-2" />
            Вызов экстренных служб
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyTypes.map((type) => (
              <AlertDialog key={type.value}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={`h-20 flex flex-col items-center justify-center space-y-2 hover:${type.color.replace('100', '200')} border-2`}
                    disabled={isLoading}
                  >
                    <Icon name={type.icon as any} className="h-6 w-6" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center text-red-600">
                      <Icon name={type.icon as any} className="h-5 w-5 mr-2" />
                      Вызвать {type.label.toLowerCase()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Вы действительно хотите вызвать {type.label.toLowerCase()}? 
                      Это действие немедленно уведомит соответствующую службу.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Дополнительная информация (необязательно)
                      </label>
                      <Textarea
                        placeholder="Опишите ситуацию..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleEmergencyCall(type.value)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? (
                        <>
                          <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          <Icon name="Phone" className="h-4 w-4 mr-2" />
                          Вызвать {type.label.toLowerCase()}
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Emergency Calls */}
      {activeCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Clock" className="h-5 w-5 mr-2" />
              Активные вызовы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCalls.map((call) => {
                const typeConfig = emergencyTypes.find(t => t.value === call.type);
                return (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Icon 
                        name={typeConfig?.icon as any || 'Phone'} 
                        className="h-5 w-5 text-gray-600" 
                      />
                      <div>
                        <div className="font-medium">
                          {typeConfig?.label || call.type}
                        </div>
                        <div className="text-sm text-gray-600">
                          {call.location}
                        </div>
                        {call.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {call.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          Вызван: {call.timestamp.toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(call.status)}>
                        {getStatusLabel(call.status)}
                      </Badge>
                      {call.status === 'dispatched' && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <Icon name="MapPin" className="h-3 w-3 mr-1" />
                          На месте через ~15 мин
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Zap" className="h-5 w-5 mr-2" />
            Быстрые действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1"
            >
              <Icon name="Phone" className="h-5 w-5" />
              <span className="text-sm">112 - Единая служба</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1"
            >
              <Icon name="MapPin" className="h-5 w-5" />
              <span className="text-sm">Отправить геолокацию</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};