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

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}