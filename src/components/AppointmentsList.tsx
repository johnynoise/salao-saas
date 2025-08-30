import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Appointment, Professional, Service } from '../types';

interface AppointmentsListProps {
  appointments: Appointment[];
  professionals: Professional[];
  services: Service[];
  onStatusChange: (appointmentId: string, status: 'completed' | 'cancelled') => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  professionals,
  services,
  onStatusChange
}) => {
  const getProfessional = (id: string) => professionals.find(p => p.id === id);
  const getService = (id: string) => services.find(s => s.id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.start_time}`);
    const dateB = new Date(`${b.date}T${b.start_time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Próximos Agendamentos</h3>
      
      {sortedAppointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAppointments.map(appointment => {
            const professional = getProfessional(appointment.professional_id);
            const service = getService(appointment.service_id);
            
            return (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {professional?.avatar && (
                      <img
                        src={professional.avatar}
                        alt={professional.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800">{appointment.client_name}</h4>
                      <p className="text-sm text-gray-600">{service?.name}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(appointment.date), "d 'de' MMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.start_time} - {appointment.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{professional?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{appointment.client_phone}</span>
                  </div>
                </div>

                {appointment.client_email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Mail className="w-4 h-4" />
                    <span>{appointment.client_email}</span>
                  </div>
                )}

                {appointment.notes && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                    <MessageSquare className="w-4 h-4 mt-0.5" />
                    <span>{appointment.notes}</span>
                  </div>
                )}

                {service && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-semibold text-gray-800">R$ {service.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Duração:</span>
                      <span className="text-gray-800">{service.duration} min</span>
                    </div>
                  </div>
                )}

                {appointment.status === 'scheduled' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onStatusChange(appointment.id, 'completed')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Concluir
                    </button>
                    <button
                      onClick={() => onStatusChange(appointment.id, 'cancelled')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};