import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics, fetchBookings, fetchClients } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, Camera, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { RevenueChart } from "./revenue-chart";

export function AdminDashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics/stats'],
    queryFn: fetchAnalytics,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: fetchBookings,
  });

  const { data: clients } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: fetchClients,
  });

  if (analyticsLoading || bookingsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-playfair text-3xl font-bold">Dashboard</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Bookings",
      value: analytics?.totalBookings || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Bookings", 
      value: analytics?.pendingBookings || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Confirmed Shoots",
      value: analytics?.confirmedBookings || 0,
      icon: Camera,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentBookings = bookings?.slice(0, 5) || [];
  
  const getUpcomingBookings = () => {
    if (!bookings) return [];
    const today = new Date();
    return bookings
      .filter((booking: any) => new Date(booking.date) > today && booking.status !== 'cancelled')
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const getPendingActions = () => {
    if (!bookings) return [];
    return bookings.filter((booking: any) => booking.status === 'pending');
  };

  const upcomingBookings = getUpcomingBookings();
  const pendingActions = getPendingActions();
  const totalRevenue = bookings?.reduce((sum: number, booking: any) => 
    booking.status === 'confirmed' || booking.status === 'completed' 
      ? sum + parseFloat(booking.totalPrice) 
      : sum, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-playfair text-3xl font-bold">Business Dashboard</h1>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Active Clients: <strong>{clients?.length || 0}</strong></span>
          <span>Revenue: <strong>${totalRevenue.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Analytics */}
      <RevenueChart />

      {/* Recent Activity & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.client?.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.service?.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`mb-1 ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.date).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No upcoming sessions</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Action Required ({pendingActions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.length > 0 ? (
                pendingActions.slice(0, 4).map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.client?.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.service?.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mb-1">
                        Pending
                      </Badge>
                      <p className="text-sm">${parseFloat(booking.totalPrice).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">All caught up! 🎉</p>
                  <p className="text-sm text-muted-foreground mt-1">No pending actions</p>
                </div>
              )}
              
              {pendingActions.length > 0 && (
                <Button variant="outline" className="w-full mt-4">
                  Review All Pending Bookings
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
