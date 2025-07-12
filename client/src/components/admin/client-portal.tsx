import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  Globe, 
  Download, 
  CreditCard, 
  Calendar,
  Eye,
  Link,
  Activity,
  Clock,
  FileText,
  Image,
  DollarSign,
  Settings,
  Shield
} from "lucide-react";
import { format } from "date-fns";

export function ClientPortal() {
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Mock client portal sessions data
  const portalSessions = [
    {
      id: 1,
      clientId: 1,
      clientName: "Sarah Johnson",
      sessionToken: "sess_abc123def456",
      lastAccess: "2025-07-12T08:30:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
      device: "iPhone",
      location: "Honolulu, HI",
      activities: [
        {
          type: "login",
          timestamp: "2025-07-12T08:30:00Z",
          description: "Logged into client portal"
        },
        {
          type: "gallery_view",
          timestamp: "2025-07-12T08:32:00Z",
          description: "Viewed wedding gallery"
        },
        {
          type: "download",
          timestamp: "2025-07-12T08:35:00Z",
          description: "Downloaded 15 high-res images"
        },
        {
          type: "favorites",
          timestamp: "2025-07-12T08:40:00Z",
          description: "Selected 8 favorites for album"
        }
      ],
      status: "active"
    },
    {
      id: 2,
      clientId: 3,
      clientName: "Emily Rodriguez",
      sessionToken: "sess_xyz789ghi012",
      lastAccess: "2025-07-11T15:45:00Z",
      ipAddress: "10.0.0.25",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      device: "MacBook Pro",
      location: "Kailua, HI",
      activities: [
        {
          type: "login",
          timestamp: "2025-07-11T15:45:00Z",
          description: "Logged into client portal"
        },
        {
          type: "invoice_view",
          timestamp: "2025-07-11T15:47:00Z",
          description: "Viewed invoice #INV-001"
        },
        {
          type: "payment",
          timestamp: "2025-07-11T15:50:00Z",
          description: "Paid $650 via credit card"
        },
        {
          type: "gallery_view",
          timestamp: "2025-07-11T15:55:00Z",
          description: "Viewed family portrait gallery"
        }
      ],
      status: "active"
    },
    {
      id: 3,
      clientId: 5,
      clientName: "Jessica Martinez",
      sessionToken: "sess_lmn345opq678",
      lastAccess: "2025-07-10T19:20:00Z",
      ipAddress: "172.16.0.10",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      device: "Windows PC",
      location: "Waikiki, HI",
      activities: [
        {
          type: "login",
          timestamp: "2025-07-10T19:20:00Z",
          description: "Logged into client portal"
        },
        {
          type: "questionnaire",
          timestamp: "2025-07-10T19:25:00Z",
          description: "Completed pre-shoot questionnaire"
        },
        {
          type: "booking_update",
          timestamp: "2025-07-10T19:30:00Z",
          description: "Updated contact information"
        }
      ],
      status: "active"
    },
    {
      id: 4,
      clientId: 2,
      clientName: "Michael Chen",
      sessionToken: "sess_rst901uvw234",
      lastAccess: "2025-07-09T11:15:00Z",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)",
      device: "iPad",
      location: "Pearl City, HI",
      activities: [
        {
          type: "login",
          timestamp: "2025-07-09T11:15:00Z",
          description: "Logged into client portal"
        },
        {
          type: "contract_view",
          timestamp: "2025-07-09T11:18:00Z",
          description: "Reviewed photography contract"
        },
        {
          type: "contract_sign",
          timestamp: "2025-07-09T11:25:00Z",
          description: "E-signed photography contract"
        }
      ],
      status: "expired"
    }
  ];

  // Portal usage statistics
  const portalStats = {
    activeUsers: portalSessions.filter(s => s.status === "active").length,
    totalSessions: portalSessions.length,
    avgSessionTime: "12 min",
    topActivity: "Gallery Views",
    downloadCount: 127,
    paymentCount: 8
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login": return <Shield className="h-3 w-3" />;
      case "gallery_view": return <Image className="h-3 w-3" />;
      case "download": return <Download className="h-3 w-3" />;
      case "payment": return <CreditCard className="h-3 w-3" />;
      case "invoice_view": return <FileText className="h-3 w-3" />;
      case "contract_view": return <FileText className="h-3 w-3" />;
      case "contract_sign": return <FileText className="h-3 w-3" />;
      case "questionnaire": return <FileText className="h-3 w-3" />;
      case "favorites": return <Eye className="h-3 w-3" />;
      case "booking_update": return <Calendar className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login": return "text-blue-600";
      case "gallery_view": return "text-purple-600";
      case "download": return "text-green-600";
      case "payment": return "text-green-700";
      case "invoice_view": return "text-orange-600";
      case "contract_view": return "text-gray-600";
      case "contract_sign": return "text-green-600";
      case "questionnaire": return "text-blue-600";
      case "favorites": return "text-red-600";
      case "booking_update": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-bronze" />
              <div>
                <p className="text-2xl font-bold">{portalStats.activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{portalStats.totalSessions}</p>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{portalStats.avgSessionTime}</p>
                <p className="text-xs text-muted-foreground">Avg Session</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{portalStats.downloadCount}</p>
                <p className="text-xs text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{portalStats.paymentCount}</p>
                <p className="text-xs text-muted-foreground">Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-lg font-bold">Gallery</p>
                <p className="text-xs text-muted-foreground">Top Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Portal Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Client Portal Activity
            </span>
            <Button className="btn-bronze">
              <Settings className="h-4 w-4 mr-2" />
              Portal Settings
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portalSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{session.clientName}</h3>
                      <Badge variant={session.status === "active" ? "default" : "secondary"}>
                        {session.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{session.device}</span>
                      <span className="text-sm text-muted-foreground">{session.location}</span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <p><strong>Last Access:</strong> {format(new Date(session.lastAccess), "MMM d, yyyy 'at' h:mm a")}</p>
                        <p><strong>IP Address:</strong> {session.ipAddress}</p>
                      </div>
                      <div>
                        <p><strong>Session ID:</strong> {session.sessionToken}</p>
                        <p><strong>Activities:</strong> {session.activities.length}</p>
                      </div>
                      <div>
                        <p><strong>User Agent:</strong> {session.userAgent.split(" ")[0]}</p>
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <div>
                      <h4 className="font-medium mb-2">Recent Activities</h4>
                      <div className="space-y-2">
                        {session.activities.slice(-3).map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <div className={`${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <span className="text-muted-foreground">
                              {format(new Date(activity.timestamp), "h:mm a")}
                            </span>
                            <span>{activity.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedSession(session)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Link className="h-3 w-3 mr-1" />
                      Generate Link
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Details Modal */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Portal Session Details - {selectedSession?.clientName}
            </DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Session Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Session ID:</strong> {selectedSession.sessionToken}</p>
                    <p><strong>IP Address:</strong> {selectedSession.ipAddress}</p>
                    <p><strong>Device:</strong> {selectedSession.device}</p>
                    <p><strong>Location:</strong> {selectedSession.location}</p>
                    <p><strong>Status:</strong> <Badge variant={selectedSession.status === "active" ? "default" : "secondary"}>{selectedSession.status}</Badge></p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Access Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Last Access:</strong> {format(new Date(selectedSession.lastAccess), "PPP 'at' p")}</p>
                    <p><strong>User Agent:</strong> {selectedSession.userAgent}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Complete Activity Log</h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {selectedSession.activities.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 text-sm p-2 bg-muted/50 rounded">
                      <div className={`${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <span className="text-muted-foreground">
                        {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                      </span>
                      <span className="flex-1">{activity.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}