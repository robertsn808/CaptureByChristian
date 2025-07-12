import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBookings, fetchClients } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Download, 
  Mail, 
  Plus, 
  DollarSign, 
  Calendar,
  User,
  Eye,
  Edit,
  Trash,
  Send,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  bookingId?: number;
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdDate: string;
  items: InvoiceItem[];
  notes?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export function InvoiceGenerator() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { description: "Photography Session", quantity: 1, rate: 0, amount: 0 }
  ]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: fetchBookings,
  });

  const { data: clients } = useQuery({
    queryKey: ['/api/clients'],
    queryFn: fetchClients,
  });

  // Mock invoices - in real app this would come from database
  const mockInvoices: Invoice[] = [
    {
      id: "INV-2024-089",
      bookingId: 1,
      clientName: "Sarah Johnson",
      clientEmail: "sarah@email.com",
      invoiceNumber: "INV-2024-089",
      amount: 2500,
      status: "paid",
      dueDate: "2024-11-30",
      createdDate: "2024-11-01",
      items: [
        { description: "Wedding Photography Session", quantity: 1, rate: 2000, amount: 2000 },
        { description: "Photo Editing & Processing", quantity: 1, rate: 500, amount: 500 }
      ],
      notes: "Wedding at Kualoa Ranch"
    },
    {
      id: "INV-2024-090",
      bookingId: 2,
      clientName: "Mike Chen",
      clientEmail: "mike@email.com",
      invoiceNumber: "INV-2024-090",
      amount: 1800,
      status: "pending",
      dueDate: "2024-12-15",
      createdDate: "2024-11-15",
      items: [
        { description: "Portrait Photography Session", quantity: 1, rate: 1500, amount: 1500 },
        { description: "Digital Gallery Access", quantity: 1, rate: 300, amount: 300 }
      ]
    },
    {
      id: "INV-2024-091",
      bookingId: 3,
      clientName: "Lisa Wong",
      clientEmail: "lisa@email.com",
      invoiceNumber: "INV-2024-091",
      amount: 3200,
      status: "overdue",
      dueDate: "2024-11-15",
      createdDate: "2024-10-15",
      items: [
        { description: "Aerial Photography Session", quantity: 1, rate: 2800, amount: 2800 },
        { description: "Additional Editing", quantity: 1, rate: 400, amount: 400 }
      ],
      notes: "Real estate photography for luxury property"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...invoiceItems];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? Number(value) || 0 : (updated[index].quantity || 0);
      const rate = field === 'rate' ? Number(value) || 0 : (updated[index].rate || 0);
      updated[index].amount = Number((quantity * rate).toFixed(2));
    }
    
    setInvoiceItems(updated);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const getTotalAmount = () => {
    return invoiceItems.reduce((total, item) => total + (typeof item.amount === 'number' ? item.amount : 0), 0);
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900) + 100;
    return `INV-${year}-${random}`;
  };

  const handleCreateInvoice = () => {
    const invoice: Invoice = {
      id: generateInvoiceNumber(),
      bookingId: selectedBooking?.id,
      clientName: selectedBooking?.client.name || "Manual Client",
      clientEmail: selectedBooking?.client.email || "",
      invoiceNumber: generateInvoiceNumber(),
      amount: getTotalAmount(),
      status: "pending",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      items: [...invoiceItems],
      notes: ""
    };

    toast({
      title: "Invoice Created",
      description: `Invoice ${invoice.invoiceNumber} has been created successfully.`,
    });

    setNewInvoiceOpen(false);
    setSelectedBooking(null);
    setInvoiceItems([{ description: "Photography Session", quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoice.invoiceNumber} has been sent to ${invoice.clientEmail}.`,
    });
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.invoiceNumber} has been downloaded as PDF.`,
    });
  };

  const pendingBookings = bookings?.filter((booking: any) => 
    booking.status === 'confirmed' || booking.status === 'completed'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice & Contract Management</h2>
          <p className="text-muted-foreground">Generate and manage invoices for your photography services</p>
        </div>
        
        <Dialog open={newInvoiceOpen} onOpenChange={setNewInvoiceOpen}>
          <DialogTrigger asChild>
            <Button className="bg-bronze hover:bg-bronze/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Client Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Select Booking (Optional)</Label>
                  <Select onValueChange={(value) => {
                    const booking = pendingBookings?.find((b: any) => b.id.toString() === value);
                    setSelectedBooking(booking);
                    if (booking) {
                      const servicePrice = Number(booking.service.price) || 0;
                      setInvoiceItems([{
                        description: booking.service.name,
                        quantity: 1,
                        rate: servicePrice,
                        amount: servicePrice
                      }]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from existing bookings" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingBookings?.map((booking: any) => (
                        <SelectItem key={booking.id} value={booking.id.toString()}>
                          {booking.client.name} - {booking.service.name} - {new Date(booking.date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Invoice Number</Label>
                  <Input value={generateInvoiceNumber()} disabled />
                </div>
              </div>

              {/* Client Info */}
              {selectedBooking && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Client Name</Label>
                      <Input value={selectedBooking.client.name} disabled />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={selectedBooking.client.email} disabled />
                    </div>
                    <div>
                      <Label>Booking Date</Label>
                      <Input value={new Date(selectedBooking.date).toLocaleDateString()} disabled />
                    </div>
                    <div>
                      <Label>Service</Label>
                      <Input value={selectedBooking.service.name} disabled />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invoice Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoiceItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-6 gap-2 items-end">
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                            placeholder="Service description"
                          />
                        </div>
                        <div>
                          <Label>Qty</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label>Rate ($)</Label>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateInvoiceItem(index, 'rate', Number(e.target.value))}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label>Amount ($)</Label>
                          <Input value={typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'} disabled />
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeInvoiceItem(index)}
                            disabled={invoiceItems.length === 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" onClick={addInvoiceItem} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span>${typeof getTotalAmount() === 'number' ? getTotalAmount().toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewInvoiceOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInvoice} className="bg-bronze hover:bg-bronze/90">
                  Create Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">$24,650</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">$6,250</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Amount</p>
                <p className="text-2xl font-bold text-red-600">$3,200</p>
              </div>
              <FileText className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payment Rate</p>
                <p className="text-2xl font-bold text-blue-600">74.6%</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-semibold">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {invoice.clientName} • Created {new Date(invoice.createdDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold">${invoice.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Due {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewInvoice(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendInvoice(invoice)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={!!previewInvoice} onOpenChange={() => setPreviewInvoice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          
          {previewInvoice && (
            <div className="space-y-6 p-6 border rounded-lg bg-white">
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-muted-foreground">Christian Picaso Photography</p>
                  <p className="text-sm text-muted-foreground">Honolulu, Hawaii</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{previewInvoice.invoiceNumber}</div>
                  <div className="text-sm text-muted-foreground">
                    Date: {new Date(previewInvoice.createdDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(previewInvoice.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <div className="text-sm">
                  <div>{previewInvoice.clientName}</div>
                  <div>{previewInvoice.clientEmail}</div>
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Qty</th>
                      <th className="text-right p-2">Rate</th>
                      <th className="text-right p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.description}</td>
                        <td className="text-right p-2">{item.quantity}</td>
                        <td className="text-right p-2">${item.rate.toFixed(2)}</td>
                        <td className="text-right p-2">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan={3} className="text-right p-2 font-semibold">Total:</td>
                      <td className="text-right p-2 font-semibold text-lg">
                        ${previewInvoice.amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              {previewInvoice.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes:</h3>
                  <p className="text-sm text-muted-foreground">{previewInvoice.notes}</p>
                </div>
              )}

              {/* Payment Terms */}
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Payment terms: Net 30 days. Thank you for your business!
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}