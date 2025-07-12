import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClients, fetchBookings } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  Eye
} from "lucide-react";

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: fetchClients,
  });

  const { data: bookings } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: fetchBookings,
  });

  const filteredClients = clients?.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getClientBookings = (clientId: number) => {
    return bookings?.filter((booking: any) => booking.clientId === clientId) || [];
  };

  const getClientStats = (clientId: number) => {
    const clientBookings = getClientBookings(clientId);
    const totalSpent = clientBookings.reduce((sum: number, booking: any) => 
      sum + parseFloat(booking.totalPrice), 0
    );
    
    return {
      totalBookings: clientBookings.length,
      totalSpent,
      lastBooking: clientBookings.length > 0 
        ? new Date(Math.max(...clientBookings.map((b: any) => new Date(b.date).getTime())))
        : null,
    };
  };

  if (clientsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Client Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
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
            <Users className="h-5 w-5 mr-2" />
            Client Management
          </CardTitle>
          <Button className="btn-bronze">
            <Plus className="h-4 w-4 mr-1" />
            Add Client
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Clients Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client: any) => {
                  const stats = getClientStats(client.id);
                  
                  return (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          {client.tags && client.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {client.tags.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {stats.totalBookings}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center font-medium">
                          <DollarSign className="h-4 w-4 mr-1 text-bronze" />
                          ${stats.totalSpent.toLocaleString()}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {stats.lastBooking ? (
                          <span className="text-sm">
                            {stats.lastBooking.toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedClient(client)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{client.name}</DialogTitle>
                            </DialogHeader>
                            <ClientDetails client={client} bookings={getClientBookings(client.id)} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No clients found matching your search.' : 'No clients found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientDetails({ client, bookings }: { client: any; bookings: any[] }) {
  const totalSpent = bookings.reduce((sum, booking) => sum + parseFloat(booking.totalPrice), 0);

  return (
    <div className="space-y-6">
      {/* Client Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              {client.email}
            </div>
            {client.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                {client.phone}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Statistics</h4>
          <div className="space-y-2 text-sm">
            <div>Total Bookings: <strong>{bookings.length}</strong></div>
            <div>Total Spent: <strong>${totalSpent.toLocaleString()}</strong></div>
            <div>Client Since: <strong>{new Date(client.createdAt).toLocaleDateString()}</strong></div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div>
          <h4 className="font-semibold mb-2">Notes</h4>
          <p className="text-sm bg-muted p-3 rounded">{client.notes}</p>
        </div>
      )}

      {/* Booking History */}
      <div>
        <h4 className="font-semibold mb-2">Booking History</h4>
        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking: any) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">{booking.service?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.date).toLocaleDateString()} at {booking.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${parseFloat(booking.totalPrice).toLocaleString()}</p>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
            {bookings.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                And {bookings.length - 5} more bookings...
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}
