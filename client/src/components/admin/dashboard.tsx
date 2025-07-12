import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics, fetchBookings } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Camera, TrendingUp } from "lucide-react";

export function AdminDashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics/stats'],
    queryFn: fetchAnalytics,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: fetchBookings,
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
      title: "Monthly Revenue",
      value: `$${(analytics?.monthlyRevenue || 0).toLocaleString()}`,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-playfair text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Today: <strong>{analytics?.pendingBookings || 0} bookings</strong></span>
          <span>This month: <strong>${(analytics?.monthlyRevenue || 0).toLocaleString()}</strong></span>
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

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.client?.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.service?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${parseFloat(booking.totalPrice).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No recent bookings</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-bronze" />
                <p className="text-sm font-medium">View Calendar</p>
              </div>
              <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <Users className="h-8 w-8 mx-auto mb-2 text-bronze" />
                <p className="text-sm font-medium">Manage Clients</p>
              </div>
              <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <Camera className="h-8 w-8 mx-auto mb-2 text-bronze" />
                <p className="text-sm font-medium">Upload Photos</p>
              </div>
              <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-bronze" />
                <p className="text-sm font-medium">Generate Invoice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
