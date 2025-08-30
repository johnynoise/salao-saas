import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, User } from 'lucide-react';
import { TimeSlot, Professional, Appointment } from '../types';

interface TimeSlotPickerProps {
  selectedDate: Date;
  timeSlots: TimeSlot[];
  professionals: Professional[];
  appointments: Appointment[];
  onSlotSelect: (slot: TimeSlot, professional: Professional) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  timeSlots,
  professionals,
  appointments,
  onSlotSelect
}) => {
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const daySlots = timeSlots.filter(slot => slot.date === dateStr);
  const dayAppointments = appointments.filter(apt => apt.date === dateStr);

  const slotsByProfessional = professionals.map(professional => {
    const professionalSlots = daySlots.filter(slot => 
      slot.professional_id === professional.id && slot.is_available
    );
    const professionalAppointments = dayAppointments.filter(apt => 
      apt.professional_id === professional.id
    );

    return {
      professional,
      slots: professionalSlots,
      appointments: professionalAppointments
    };
  });

  const isSlotBooked = (slot: TimeSlot) => {
    return dayAppointments.some(apt => 
      apt.professional_id === slot.professional_id && 
      apt.start_time === slot.start_time
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Horários Disponíveis
        </h3>
        <p className="text-gray-600">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="space-y-6">
        {slotsByProfessional.map(({ professional, slots, appointments }) => (
          <div key={professional.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={professional.avatar}
                alt={professional.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{professional.name}</h4>
                <p className="text-sm text-gray-500">
                  {professional.specialties.join(', ')}
                </p>
              </div>
            </div>

            {appointments.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Agendamentos do dia
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {appointments.map(apt => (
                    <div
                      key={apt.id}
                      className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs"
                    >
                      <div className="font-medium text-red-800">{apt.start_time}</div>
                      <div className="text-red-600">{apt.client_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slots.length > 0 ? (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Horários livres
                </h5>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(slot => {
                    const isBooked = isSlotBooked(slot);
                    return (
                      <button
                        key={slot.id}
                        onClick={() => !isBooked && onSlotSelect(slot, professional)}
                        disabled={isBooked}
                        className={`
                          p-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${isBooked
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:shadow-md'
                          }
                        `}
                      >
                        {slot.start_time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Nenhum horário disponível para este dia
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};