import React, { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminCalendar } from "@/components/admin/calendar";
import { ClientManagement } from "@/components/admin/client-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Camera, 
  FileText, 
  BarChart3,
  Settings,
  Upload,
  Brain
} from "lucide-react";

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "clients", label: "Clients", icon: Users },
  { id: "gallery", label: "Gallery AI", icon: Camera },
  { id: "contracts", label: "Contracts", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Admin Header */}
      <div className="bg-charcoal text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-white/70 mt-2">Manage your photography business with AI-powered tools</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold">Today</div>
                <div className="text-white/70">3 bookings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">This Month</div>
                <div className="text-white/70">$12,450</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2">
            {adminTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex flex-col items-center space-y-1 p-3 data-[state=active]:bg-bronze data-[state=active]:text-white"
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-xs">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <AdminCalendar />
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <ClientManagement />
          </TabsContent>

          {/* Gallery AI Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-bronze" />
                  AI Gallery Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Upload & Analyze Photos</h3>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        Drag and drop photos here or click to upload
                      </p>
                      <Button className="btn-bronze">
                        <Upload className="h-4 w-4 mr-2" />
                        Select Photos
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI will automatically tag emotions, style, composition, and quality scores
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">AI Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Brain className="h-5 w-5 text-bronze" />
                        <div>
                          <div className="font-medium">Smart Photo Selection</div>
                          <div className="text-sm text-muted-foreground">AI identifies best shots automatically</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Camera className="h-5 w-5 text-bronze" />
                        <div>
                          <div className="font-medium">Auto Gallery Organization</div>
                          <div className="text-sm text-muted-foreground">Groups by theme, style, and emotion</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <FileText className="h-5 w-5 text-bronze" />
                        <div>
                          <div className="font-medium">Content Generation</div>
                          <div className="text-sm text-muted-foreground">Auto-generates blog posts and captions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Contract & Invoice Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Contract Management System</h3>
                  <p className="text-muted-foreground mb-6">
                    Automated contract generation, e-signature collection, and invoice tracking
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      Generate Contract
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Settings className="h-6 w-6 mb-2" />
                      Template Editor
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      Invoice Tracking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Business Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Track revenue, booking trends, client satisfaction, and performance metrics
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-bronze">89%</div>
                      <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-bronze">1,247</div>
                      <div className="text-sm text-muted-foreground">Photos Processed</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-bronze">23</div>
                      <div className="text-sm text-muted-foreground">Bookings This Month</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-bronze">$12,450</div>
                      <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
