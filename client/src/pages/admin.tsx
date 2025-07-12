import React, { useState } from "react";
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
import { AdminInbox } from "@/components/admin/inbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useTheme } from "@/components/theme-provider";
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
  Mail,
  Home,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Activity,
  Target,
  TrendingUp,
  Zap,
  LogOut
} from "lucide-react";

const menuSections = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "real-time", label: "Real-Time Analytics", icon: Activity },
      { id: "analytics", label: "Advanced Analytics", icon: BarChart3 },
    ]
  },
  {
    title: "AI Intelligence",
    items: [
      { id: "ai-insights", label: "Business Insights", icon: Brain },
      { id: "ai-chat", label: "AI Assistant", icon: Brain },
      { id: "predictive", label: "Predictive Analysis", icon: Target },
    ]
  },
  {
    title: "Business Operations",
    items: [
      { id: "calendar", label: "Calendar", icon: Calendar },
      { id: "clients", label: "Client Management", icon: Users },
      { id: "leads", label: "Lead Management", icon: TrendingUp },
      { id: "inbox", label: "Messages", icon: Mail },
      { id: "invoices", label: "Invoices", icon: FileText },
    ]
  },
  {
    title: "Content & Portfolio",
    items: [
      { id: "gallery", label: "Portfolio Management", icon: Camera },
      { id: "portal", label: "Client Portal", icon: Settings },
    ]
  }
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-bronze to-teal rounded-full">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <span className="font-playfair text-lg font-bold gradient-text">
                  Admin Panel
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                {!sidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full justify-start h-10 ${
                        activeTab === item.id
                          ? 'bg-bronze text-white hover:bg-bronze/90'
                          : 'hover:bg-muted'
                      } ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Button>
                  ))}
                </div>
                {!sidebarCollapsed && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
              title={sidebarCollapsed ? 'Toggle theme' : undefined}
            >
              {theme === "light" ? (
                <Moon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              ) : (
                <Sun className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              )}
              {!sidebarCollapsed && 'Toggle Theme'}
            </Button>
            
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
                title={sidebarCollapsed ? 'Back to website' : undefined}
              >
                <Home className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && 'Back to Website'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-2xl font-bold">
                {menuSections.flatMap(s => s.items).find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your photography business with AI-powered tools
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Activity className="h-3 w-3 mr-1" />
                Live Updates
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Zap className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
      </div>
    </div>
  );

  function renderContent() {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "ai-insights":
        return <AIBusinessInsights />;
      case "ai-chat":
        return <AdvancedAIChat />;
      case "predictive":
        return <PredictiveIntelligence />;
      case "real-time":
        return <RealTimeAnalytics />;
      case "calendar":
        return <AdminCalendar />;
      case "clients":
        return <ClientManagement />;
      case "leads":
        return <LeadManagement />;
      case "gallery":
        return <PortfolioManagement />;
      case "inbox":
        return <AdminInbox />;
      case "invoices":
        return <InvoiceGenerator />;
      case "analytics":
        return <AdvancedAnalytics />;
      case "portal":
        return (
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
        );
      default:
        return <AdminDashboard />;
    }
  }
}