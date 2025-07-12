import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Progress component not available, we'll use a simple div
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Download, 
  FileText, 
  MessageSquare, 
  Calendar,
  Heart,
  Clock,
  CheckCircle,
  Star,
  Eye,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";

interface ClientDashboardProps {
  clientData: any;
  onLogout: () => void;
  onViewGallery?: (galleryId: string) => void;
}

export function ClientDashboard({ clientData, onLogout, onViewGallery }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch client-specific data
  const { data: clientBookings } = useQuery({
    queryKey: ['/api/client-portal/bookings', clientData.id],
    queryFn: () => fetch(`/api/client-portal/bookings?clientId=${clientData.id}`).then(r => r.json()),
  });

  const { data: clientGalleries } = useQuery({
    queryKey: ['/api/client-portal/galleries', clientData.id],
    queryFn: () => fetch(`/api/client-portal/galleries?clientId=${clientData.id}`).then(r => r.json()),
  });

  const { data: clientContracts } = useQuery({
    queryKey: ['/api/client-portal/contracts', clientData.id],
    queryFn: () => fetch(`/api/client-portal/contracts?clientId=${clientData.id}`).then(r => r.json()),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'in_progress': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-bronze" />
              <div>
                <h1 className="font-playfair text-xl font-bold">Welcome back, {clientData.name}</h1>
                <p className="text-sm text-muted-foreground">Christian Picaso Photography</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="galleries">Galleries</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Sessions</p>
                      <p className="text-3xl font-bold">{clientBookings?.filter((b: any) => ['confirmed', 'in_progress'].includes(b.status)).length || 0}</p>
                    </div>
                    <Camera className="h-8 w-8 text-bronze" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Photo Galleries</p>
                      <p className="text-3xl font-bold">{clientGalleries?.length || 0}</p>
                    </div>
                    <Eye className="h-8 w-8 text-bronze" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Downloads Available</p>
                      <p className="text-3xl font-bold">{clientGalleries?.filter((g: any) => g.status === 'ready_for_download').length || 0}</p>
                    </div>
                    <Download className="h-8 w-8 text-bronze" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Your Photography Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientBookings?.length ? (
                  <div className="space-y-4">
                    {clientBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold">{booking.service?.name}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(booking.date), 'MMMM dd, yyyy')} at {booking.time}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{getProgressValue(booking.status)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-bronze h-2 rounded-full transition-all" 
                                style={{ width: `${getProgressValue(booking.status)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {booking.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Gallery
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No sessions scheduled yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Galleries Tab */}
          <TabsContent value="galleries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo Galleries</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and select your favorite photos from completed sessions
                </p>
              </CardHeader>
              <CardContent>
                {clientGalleries?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clientGalleries.map((gallery: any) => (
                      <Card key={gallery.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                          <img
                            src={gallery.coverImage || "/api/placeholder/400/300"}
                            alt={gallery.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary">
                              {gallery.photoCount} photos
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{gallery.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {format(new Date(gallery.createdAt), 'MMMM dd, yyyy')}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(gallery.status)}>
                              {gallery.status === 'proofing' ? 'Select Favorites' : 
                               gallery.status === 'ready_for_download' ? 'Ready' : gallery.status}
                            </Badge>
                            <Button 
                              size="sm"
                              onClick={() => onViewGallery?.(gallery.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Gallery
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No galleries available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contracts & Invoices</CardTitle>
                <p className="text-sm text-muted-foreground">
                  View signed agreements and manage payments
                </p>
              </CardHeader>
              <CardContent>
                {clientContracts?.length ? (
                  <div className="space-y-4">
                    {clientContracts.map((contract: any) => (
                      <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{contract.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Signed on {format(new Date(contract.signedAt), 'MMMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Signed
                          </Badge>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No contracts available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Communicate directly with your photographer
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Messaging feature coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Downloads</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Download your final high-resolution photos
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No downloads available yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}