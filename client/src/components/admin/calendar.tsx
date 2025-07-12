import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAvailability } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: availability, isLoading } = useQuery({
    queryKey: ['/api/availability', startOfMonth.toISOString(), endOfMonth.toISOString()],
    queryFn: () => fetchAvailability(startOfMonth.toISOString(), endOfMonth.toISOString()),
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const getBookingsForDate = (date: Date) => {
    if (!availability?.bookings) return [];
    
    return availability.bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Booking Calendar
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button className="btn-bronze ml-4">
              <Plus className="h-4 w-4 mr-1" />
              New Booking
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 bg-muted/30 rounded-lg p-4">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium p-2">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const bookings = getBookingsForDate(day);

            return (
              <div
                key={index}
                className={`bg-background p-2 h-24 text-sm rounded border transition-colors hover:bg-muted/50 ${
                  !isCurrentMonth ? 'opacity-50' : ''
                } ${isToday ? 'ring-2 ring-bronze' : ''}`}
              >
                <div className={`font-medium ${isToday ? 'text-bronze' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {day.getDate()}
                </div>
                
                <div className="mt-1 space-y-1">
                  {bookings.slice(0, 2).map((booking: any) => (
                    <div key={booking.id} className="text-xs">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-1 py-0 ${getStatusColor(booking.status)}`}
                      >
                        {booking.service}
                      </Badge>
                    </div>
                  ))}
                  {bookings.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{bookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded mr-1"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded mr-1"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded mr-1"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
