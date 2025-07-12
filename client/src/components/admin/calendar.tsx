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
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Phone, Mail } from "lucide-react";

export function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: fetchBookings,
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
    },
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
    if (!bookings) return [];
    
    return bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === date.toDateString();
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
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {days.map((day, index) => {
            const dayBookings = getBookingsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded-md ${
                  isCurrentMonth ? 'bg-white' : 'bg-muted/50'
                } ${isToday ? 'ring-2 ring-bronze' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.map((booking: any) => (
                    <Dialog key={booking.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getStatusColor(booking.status)}`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="font-medium truncate">{booking.client?.name}</div>
                          <div className="truncate">{booking.service?.name}</div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(booking.date).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Booking Details</DialogTitle>
                        </DialogHeader>
                        {selectedBooking && (
                          <BookingDetailView 
                            booking={selectedBooking} 
                            onStatusChange={handleStatusChange}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function BookingDetailView({ booking, onStatusChange }: { booking: any; onStatusChange: (id: number, status: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Client Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium text-lg">{booking.client?.name}</p>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              {booking.client?.email}
            </div>
            {booking.client?.phone && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                {booking.client?.phone}
              </div>
            )}
            {booking.client?.tags && (
              <div className="flex flex-wrap gap-1">
                {booking.client.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{booking.service?.name}</p>
              <p className="text-sm text-muted-foreground">{booking.service?.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Select 
                value={booking.status} 
                onValueChange={(value) => onStatusChange(booking.id, value)}
              >
                <SelectTrigger className="w-[140px]">
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
            <div className="flex items-center justify-between">
              <span className="text-sm">Total:</span>
              <span className="font-bold text-lg">${parseFloat(booking.totalPrice).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                  {new Date(booking.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm">
                  {new Date(booking.date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })} ({booking.duration} mins)
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{booking.location}</p>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm bg-muted p-3 rounded">{booking.notes}</p>
            </div>
          )}

          {booking.addOns && booking.addOns.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Add-ons</p>
              <div className="space-y-1">
                {booking.addOns.map((addon: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span>+${addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
