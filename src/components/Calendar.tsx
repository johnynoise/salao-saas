import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { CalendarDay, Appointment, TimeSlot } from '../types';

interface CalendarProps {
  appointments: Appointment[];
  timeSlots: TimeSlot[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export const Calendar: React.FC<CalendarProps> = ({
  appointments,
  timeSlots,
  onDateSelect,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    return days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayAppointments = appointments.filter(apt => apt.date === dateStr);
      const daySlots = timeSlots.filter(slot => slot.date === dateStr && slot.is_available);

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isToday(date),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
        appointments: dayAppointments,
        availableSlots: daySlots
      } as CalendarDay;
    });
  }, [currentMonth, appointments, timeSlots, selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(day.date)}
            className={`
              relative p-3 min-h-[80px] text-left rounded-lg transition-all duration-200
              ${day.isSelected 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'hover:bg-gray-50 border border-gray-100'
              }
              ${day.isToday && !day.isSelected ? 'bg-blue-50 border-blue-200' : ''}
            `}
          >
            <div className={`text-sm font-medium mb-1 ${
              day.isSelected ? 'text-white' : day.isToday ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {format(day.date, 'd')}
            </div>
            
            {day.appointments.length > 0 && (
              <div className="flex items-center gap-1 mb-1">
                <User className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600 font-medium">
                  {day.appointments.length}
                </span>
              </div>
            )}
            
            {day.availableSlots.length > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  {day.availableSlots.length}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3 text-red-500" />
          <span>Agendamentos</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-green-500" />
          <span>Horários disponíveis</span>
        </div>
      </div>
    </div>
  );
};