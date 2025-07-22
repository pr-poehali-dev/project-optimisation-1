export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'client' | 'admin';
}

export interface Property {
  id: string;
  address: string;
  number: string;
  status: 'armed' | 'disarmed' | 'alarm' | 'maintenance';
  lastStatusChange: Date;
  sensors: Sensor[];
}

export interface Sensor {
  id: string;
  type: 'motion' | 'door' | 'window' | 'smoke' | 'glass';
  status: 'active' | 'inactive' | 'triggered' | 'offline';
  location: string;
}

export interface SecurityAction {
  id: string;
  propertyId: string;
  action: 'arm' | 'disarm' | 'emergency' | 'alarm_trigger' | 'sensor_update';
  timestamp: Date;
  userId: string;
  details?: string;
  status: 'success' | 'failed' | 'pending';
}

export interface EmergencyCall {
  id: string;
  propertyId: string;
  userId: string;
  type: 'police' | 'fire' | 'medical' | 'security';
  status: 'pending' | 'dispatched' | 'resolved';
  timestamp: Date;
  location?: string;
  description?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  types: {
    alarms: boolean;
    status_changes: boolean;
    system_updates: boolean;
    emergencies: boolean;
  };
}