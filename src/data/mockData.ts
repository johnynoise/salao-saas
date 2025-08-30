import { Service, Professional, TimeSlot, Appointment } from '../types';

export const services: Service[] = [
  {
    id: '1',
    name: 'Corte Feminino',
    duration: 60,
    price: 80,
    description: 'Corte personalizado com lavagem e finalização'
  },
  {
    id: '2',
    name: 'Corte Masculino',
    duration: 30,
    price: 40,
    description: 'Corte tradicional ou moderno'
  },
  {
    id: '3',
    name: 'Coloração',
    duration: 120,
    price: 150,
    description: 'Coloração completa com produtos de qualidade'
  },
  {
    id: '4',
    name: 'Escova',
    duration: 45,
    price: 50,
    description: 'Escova modeladora com finalização'
  },
  {
    id: '5',
    name: 'Manicure',
    duration: 45,
    price: 35,
    description: 'Cuidados completos para as unhas'
  },
  {
    id: '6',
    name: 'Pedicure',
    duration: 60,
    price: 45,
    description: 'Cuidados completos para os pés'
  }
];

export const professionals: Professional[] = [
  {
    id: '1',
    name: 'Ana Silva',
    specialties: ['Corte Feminino', 'Coloração', 'Escova'],
    avatar: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    specialties: ['Corte Masculino', 'Corte Feminino'],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    specialties: ['Manicure', 'Pedicure'],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

// Gerar horários disponíveis para os próximos 30 dias
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    
    // Pular domingos
    if (date.getDay() === 0) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    professionals.forEach(professional => {
      // Horários de funcionamento: 9h às 18h
      for (let hour = 9; hour < 18; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        slots.push({
          id: `${professional.id}-${dateStr}-${startTime}`,
          professional_id: professional.id,
          date: dateStr,
          start_time: startTime,
          end_time: endTime,
          is_available: Math.random() > 0.3 // 70% de chance de estar disponível
        });
      }
    });
  }
  
  return slots;
};

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    client_name: 'João Silva',
    client_phone: '(11) 99999-9999',
    client_email: 'joao@email.com',
    service_id: '1',
    professional_id: '1',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:00',
    status: 'scheduled',
    notes: 'Cliente preferencial',
    created_at: new Date().toISOString()
  }
];