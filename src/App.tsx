import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './components/Header';
import { Calendar } from './components/Calendar';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import { BookingModal } from './components/BookingModal';
import { AppointmentsList } from './components/AppointmentsList';
import { services, professionals, generateTimeSlots, mockAppointments } from './data/mockData';
import { TimeSlot, Professional, Appointment } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot: TimeSlot, professional: Professional) => {
    setSelectedSlot(slot);
    setSelectedProfessional(professional);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (bookingData: {
    client_name: string;
    client_phone: string;
    client_email: string;
    service_id: string;
    notes: string;
  }) => {
    if (!selectedSlot || !selectedProfessional) return;

    const selectedService = services.find(s => s.id === bookingData.service_id);
    if (!selectedService) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...bookingData,
      professional_id: selectedProfessional.id,
      date: selectedSlot.date,
      start_time: selectedSlot.start_time,
      end_time: selectedSlot.end_time,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);
    
    // Marcar o horário como indisponível
    setTimeSlots(prev => prev.map(slot => 
      slot.id === selectedSlot.id 
        ? { ...slot, is_available: false }
        : slot
    ));

    setIsBookingModalOpen(false);
    setSelectedSlot(null);
    setSelectedProfessional(null);
    
    toast.success('Agendamento realizado com sucesso!');
  };

  const handleStatusChange = (appointmentId: string, status: 'completed' | 'cancelled') => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status }
        : apt
    ));

    // Se cancelado, liberar o horário novamente
    if (status === 'cancelled') {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        setTimeSlots(prev => prev.map(slot => 
          slot.professional_id === appointment.professional_id &&
          slot.date === appointment.date &&
          slot.start_time === appointment.start_time
            ? { ...slot, is_available: true }
            : slot
        ));
      }
    }

    const statusText = status === 'completed' ? 'concluído' : 'cancelado';
    toast.success(`Agendamento ${statusText} com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Calendar
                appointments={appointments}
                timeSlots={timeSlots}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>
            
            <div>
              {selectedDate ? (
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  timeSlots={timeSlots}
                  professionals={professionals}
                  appointments={appointments}
                  onSlotSelect={handleSlotSelect}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Selecione uma data
                  </h3>
                  <p className="text-gray-500">
                    Clique em uma data no calendário para ver os horários disponíveis
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="max-w-4xl mx-auto">
            <AppointmentsList
              appointments={appointments}
              professionals={professionals}
              services={services}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </main>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        slot={selectedSlot}
        professional={selectedProfessional}
        services={services}
        onConfirm={handleBookingConfirm}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;