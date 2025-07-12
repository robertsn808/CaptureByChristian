import React, { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminCalendar } from "@/components/admin/calendar";
import { ClientManagement } from "@/components/admin/client-management";
import { PortfolioManagement } from "@/components/admin/portfolio-management";
import { LeadManagement } from "@/components/admin/lead-management";
import { AdvancedAnalytics } from "@/components/admin/advanced-analytics";
import { AIBusinessInsights } from "@/components/admin/ai-business-insights";
import { RealTimeAnalytics } from "@/components/admin/real-time-analytics";
import { AdvancedAIChat } from "@/components/admin/advanced-ai-chat";
import { PredictiveIntelligence } from "@/components/admin/predictive-intelligence";
import { InvoiceGenerator } from "@/components/admin/invoice-generator";
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
  Brain,
  Mail
} from "lucide-react";

const adminTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ai-insights", label: "AI Insights", icon: Brain },
  { id: "ai-chat", label: "AI Chat", icon: Brain },
  { id: "predictive", label: "Predictive", icon: Brain },
  { id: "real-time", label: "Real-Time", icon: BarChart3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "clients", label: "Clients", icon: Users },
  { id: "leads", label: "Leads", icon: Users },
  { id: "gallery", label: "Portfolio", icon: Camera },
  { id: "portal", label: "Client Portal", icon: Settings },
  { id: "invoices", label: "Invoices", icon: FileText },
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
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold">Today</div>
                <div className="text-white/70">3 bookings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">This Month</div>
                <div className="text-white/70">$12,450</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">AI Predictions</div>
                <div className="text-white/70">89% confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">Live Visitors</div>
                <div className="text-white/70">8 active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 xl:grid-cols-10 gap-2 h-auto p-2">
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

          {/* AI Business Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <AIBusinessInsights />
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="ai-chat" className="space-y-6">
            <AdvancedAIChat />
          </TabsContent>

          {/* Predictive Intelligence Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <PredictiveIntelligence />
          </TabsContent>

          {/* Real-Time Analytics Tab */}
          <TabsContent value="real-time" className="space-y-6">
            <RealTimeAnalytics />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <AdminCalendar />
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <ClientManagement />
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <LeadManagement />
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <PortfolioManagement />
          </TabsContent>

          {/* Client Portal Tab */}
          <TabsContent value="portal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Client Portal Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Portal Access Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Portal Access</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">Sarah Johnson</h4>
                          <p className="text-sm text-muted-foreground">Wedding - Nov 15, 2024</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Gallery Access</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Active</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">Mike Chen</h4>
                          <p className="text-sm text-muted-foreground">Portrait - Dec 2, 2024</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Send Access</Button>
                          <Button size="sm" variant="secondary">Pending</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">Lisa Wong</h4>
                          <p className="text-sm text-muted-foreground">Engagement - Oct 20, 2024</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Revoke Access</Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">Expired</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Portal Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Portal Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">247</div>
                          <div className="text-sm text-muted-foreground">Total Logins</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">89%</div>
                          <div className="text-sm text-muted-foreground">Access Rate</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">156</div>
                          <div className="text-sm text-muted-foreground">Downloads</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">4.8</div>
                          <div className="text-sm text-muted-foreground">Avg Rating</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Activity</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Sarah Johnson logged in</span>
                            <span className="text-muted-foreground">2 hours ago</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mike Chen downloaded 12 photos</span>
                            <span className="text-muted-foreground">5 hours ago</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lisa Wong left 5-star review</span>
                            <span className="text-muted-foreground">1 day ago</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Portal Settings */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Portal Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Users className="h-6 w-6 mb-2" />
                        Bulk Access Management
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Settings className="h-6 w-6 mb-2" />
                        Portal Customization
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Mail className="h-6 w-6 mb-2" />
                        Email Templates
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Generator Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <InvoiceGenerator />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}