export interface Service {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
  description?: string;
}

export interface Professional {
  id: string;
  name: string;
  specialties: string[];
  avatar?: string;
}

export interface TimeSlot {
  id: string;
  professional_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_id: string;
  professional_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  appointments: Appointment[];
  availableSlots: TimeSlot[];
}