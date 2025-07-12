import React, { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminCalendar } from "@/components/admin/calendar";
import { ClientManagement } from "@/components/admin/client-management";
import { PortfolioManagement } from "@/components/admin/portfolio-management";
import { LeadManagement } from "@/components/admin/lead-management";
import { AutomationWorkflows } from "@/components/admin/automation-workflows";
import { ClientPortal } from "@/components/admin/client-portal";
import { ProductSales } from "@/components/admin/product-sales";
import { AdvancedAnalytics } from "@/components/admin/advanced-analytics";
import { QuestionnaireSystem } from "@/components/admin/questionnaire-system";
import { AIBusinessInsights } from "@/components/admin/ai-business-insights";
import { RealTimeAnalytics } from "@/components/admin/real-time-analytics";
import { AdvancedAIChat } from "@/components/admin/advanced-ai-chat";
import { PredictiveIntelligence } from "@/components/admin/predictive-intelligence";
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
  { id: "ai-insights", label: "AI Insights", icon: Brain },
  { id: "ai-chat", label: "AI Chat", icon: Brain },
  { id: "predictive", label: "Predictive", icon: Brain },
  { id: "real-time", label: "Real-Time", icon: BarChart3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "clients", label: "Clients", icon: Users },
  { id: "leads", label: "Leads", icon: Users },
  { id: "gallery", label: "Portfolio", icon: Camera },
  { id: "automation", label: "Automation", icon: Brain },
  { id: "products", label: "Products", icon: Upload },
  { id: "portal", label: "Portal", icon: Settings },
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

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <AutomationWorkflows />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <ProductSales />
          </TabsContent>

          {/* Client Portal Tab */}
          <TabsContent value="portal" className="space-y-6">
            <ClientPortal />
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <QuestionnaireSystem />
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
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
