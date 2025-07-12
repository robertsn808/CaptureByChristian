import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookings, updateBooking } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Grid3X3,
  Calendar,
  CalendarDays
} from "lucide-react";

type ViewMode = 'month' | 'week' | 'day';

export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: fetchBookings,
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      setSelectedBooking(null);
    },
  });

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'month') {
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      } else if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      } else {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  const getMonthDays = () => {
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

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    if (!bookings || !Array.isArray(bookings)) return [];
    
    return bookings.filter((booking: any) => {
      if (!booking || !booking.date) return false;
      try {
        const bookingDate = new Date(booking.date);
        // Ensure both dates are valid
        if (isNaN(bookingDate.getTime()) || isNaN(date.getTime())) return false;
        return bookingDate.toDateString() === date.toDateString();
      } catch (error) {
        console.error('Error parsing booking date:', booking.date, error);
        return false;
      }
    });
  };

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    updateBookingMutation.mutate({
      id: bookingId,
      data: { status: newStatus }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateHeader = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'long' })} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      } else {
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${startOfWeek.getDate()} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      }
    } else {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Calendar</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderMonthView = () => {
    const days = getMonthDays();
    const today = new Date();

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayBookings = getBookingsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === today.toDateString();

          return (
            <div
              key={index}
              className={`min-h-[100px] p-1 border border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                !isCurrentMonth ? 'text-muted-foreground bg-muted/20' : 'bg-background'
              } ${isToday ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className={`text-sm mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayBookings.slice(0, 2).map((booking: any) => (
                  <div
                    key={booking.id}
                    className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(booking.status)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBooking(booking);
                    }}
                    title={`${booking.client?.name || 'Unknown Client'} - ${booking.service?.name || 'Service'}`}
                  >
                    <div className="font-medium truncate">
                      {formatTime(booking.date)}
                    </div>
                    <div className="truncate">
                      {booking.client?.name || 'Unknown Client'}
                    </div>
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div 
                    className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(day);
                    }}
                  >
                    +{dayBookings.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex flex-col">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2"></div>
          {days.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div key={index} className={`p-2 text-center border-l ${isToday ? 'bg-blue-50 dark:bg-blue-950' : ''}`}>
                <div className="text-sm text-muted-foreground">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="flex-1 grid grid-cols-8 max-h-[500px] overflow-y-auto">
          {/* Time labels */}
          <div className="border-r">
            {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(hour => (
              <div key={hour} className="h-16 border-b p-2 text-sm text-muted-foreground">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIndex) => {
            const dayBookings = getBookingsForDate(day);
            
            return (
              <div key={dayIndex} className="border-l">
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(hour => (
                  <div key={hour} className="h-16 border-b p-1">
                    {dayBookings.map((booking: any) => {
                      try {
                        const bookingDate = new Date(booking.date);
                        const bookingHour = bookingDate.getHours();
                        if (bookingHour === hour) {
                          return (
                            <div
                              key={booking.id}
                              className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(booking.status)}`}
                              onClick={() => setSelectedBooking(booking)}
                              title={`${booking.client?.name || 'Unknown'} - ${booking.service?.name || 'Service'}`}
                            >
                              <div className="font-medium">
                                {booking.client?.name || 'Unknown'}
                              </div>
                              <div className="text-muted-foreground">
                                {booking.service?.name || 'Service'}
                              </div>
                            </div>
                          );
                        }
                      } catch (error) {
                        console.error('Error processing booking in week view:', booking, error);
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayBookings = getBookingsForDate(currentDate);
    const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    return (
      <div className="space-y-4">
        {/* Day overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {dayBookings.length} bookings scheduled
            </div>
          </CardContent>
        </Card>

        {/* Time slots */}
        <Card>
          <CardContent className="p-0">
            {hours.map(hour => (
              <div key={hour} className="flex border-b">
                <div className="w-20 p-4 border-r text-sm text-muted-foreground">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                <div className="flex-1 p-4">
                  {dayBookings.map((booking: any) => {
                    try {
                      const bookingDate = new Date(booking.date);
                      const bookingHour = bookingDate.getHours();
                      if (bookingHour === hour) {
                        return (
                          <div
                            key={booking.id}
                            className={`p-3 rounded-lg border cursor-pointer hover:opacity-90 transition-opacity ${getStatusColor(booking.status)}`}
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <div className="font-medium">{booking.client?.name || 'Unknown Client'}</div>
                            <div className="text-sm">{booking.service?.name || 'Service'}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(booking.date)} • {booking.duration || 2} hours
                            </div>
                            {booking.location && (
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {booking.location}
                              </div>
                            )}
                          </div>
                        );
                      }
                    } catch (error) {
                      console.error('Error processing booking in day view:', booking, error);
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Calendar</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-lg font-semibold">{formatDateHeader()}</h3>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="rounded-none"
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="rounded-l-none"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Day
            </Button>
          </div>

          <Button
            onClick={() => {
              setCurrentDate(new Date());
              console.log('Calendar Debug - Current bookings:', bookings);
            }}
            variant="outline"
            size="sm"
          >
            Today
          </Button>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && bookings && (
            <div className="text-xs text-muted-foreground">
              {bookings.length} bookings loaded
            </div>
          )}
        </div>
      </div>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-6">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* Selected Date Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Bookings for {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          {selectedDate && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getBookingsForDate(selectedDate).length > 0 ? (
                getBookingsForDate(selectedDate).map((booking: any) => (
                  <div
                    key={booking.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(booking.status)}`}
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedBooking(booking);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{booking.client?.name || 'Unknown Client'}</div>
                        <div className="text-sm text-muted-foreground">{booking.service?.name || 'Service'}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(booking.date)} • {booking.duration || 2} hours
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings scheduled for this date
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    {selectedBooking.client?.name || 'Unknown Client'}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2" />
                    {selectedBooking.client?.email || 'No email'}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedBooking.client?.phone || 'No phone'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString() : 'No date'}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedBooking.date ? formatTime(selectedBooking.date) : 'No time'}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedBooking.location || 'Location TBD'}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Service</h4>
                <p className="text-sm">{selectedBooking.service?.name || 'Service details unavailable'}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedBooking.service?.description || 'No description available'}
                </p>
                {selectedBooking.totalPrice && (
                  <p className="text-sm font-medium mt-2">
                    Total: ${selectedBooking.totalPrice}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Select
                  value={selectedBooking.status}
                  onValueChange={(value) => handleStatusChange(selectedBooking.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedBooking.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}