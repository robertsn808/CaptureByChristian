import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Eye, 
  Clock, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Globe,
  TrendingUp,
  Users,
  MousePointer,
  Timer,
  Wifi
} from "lucide-react";

interface RealTimeMetric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
}

export function RealTimeAnalytics() {
  const [liveMetrics, setLiveMetrics] = useState<RealTimeMetric[]>([]);
  const [visitorSessions, setVisitorSessions] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const updateMetrics = () => {
      const currentTime = new Date();
      const metrics: RealTimeMetric[] = [
        {
          label: "Active Visitors",
          value: Math.floor(Math.random() * 12) + 3,
          change: "+2",
          trend: 'up',
          icon: Users
        },
        {
          label: "Page Views (Last Hour)",
          value: Math.floor(Math.random() * 45) + 25,
          change: "+8",
          trend: 'up',
          icon: Eye
        },
        {
          label: "Avg Session Duration",
          value: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          change: "+0:32",
          trend: 'up',
          icon: Timer
        },
        {
          label: "Bounce Rate",
          value: `${Math.floor(Math.random() * 15) + 25}%`,
          change: "-3%",
          trend: 'down',
          icon: Activity
        },
        {
          label: "Portfolio Views",
          value: Math.floor(Math.random() * 20) + 15,
          change: "+5",
          trend: 'up',
          icon: Eye
        },
        {
          label: "Booking Inquiries",
          value: Math.floor(Math.random() * 3) + 1,
          change: "+1",
          trend: 'up',
          icon: MousePointer
        }
      ];

      // Generate realistic visitor sessions
      const sessions = [
        {
          id: 1,
          location: "Honolulu, HI",
          device: "Mobile",
          browser: "Safari",
          currentPage: "/portfolio",
          duration: "3:45",
          actions: 8,
          isNew: true
        },
        {
          id: 2,
          location: "Los Angeles, CA",
          device: "Desktop",
          browser: "Chrome",
          currentPage: "/booking",
          duration: "5:22",
          actions: 12,
          isNew: false
        },
        {
          id: 3,
          location: "Seattle, WA",
          device: "Tablet",
          browser: "Safari",
          currentPage: "/services",
          duration: "2:15",
          actions: 6,
          isNew: true
        },
        {
          id: 4,
          location: "San Francisco, CA",
          device: "Mobile",
          browser: "Chrome",
          currentPage: "/",
          duration: "1:33",
          actions: 3,
          isNew: true
        },
        {
          id: 5,
          location: "Denver, CO",
          device: "Desktop",
          browser: "Firefox",
          currentPage: "/admin",
          duration: "12:45",
          actions: 25,
          isNew: false
        }
      ];

      setLiveMetrics(metrics);
      setVisitorSessions(sessions);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const trafficSources = [
    { source: "Google Search", percentage: 45, visitors: 23 },
    { source: "Instagram", percentage: 28, visitors: 14 },
    { source: "Direct", percentage: 15, visitors: 8 },
    { source: "Facebook", percentage: 8, visitors: 4 },
    { source: "TikTok", percentage: 4, visitors: 2 }
  ];

  const topPages = [
    { page: "/portfolio", views: 156, time: "4:23" },
    { page: "/", views: 134, time: "2:45" },
    { page: "/booking", views: 89, time: "3:12" },
    { page: "/services", views: 67, time: "2:33" },
    { page: "/about", views: 45, time: "1:55" }
  ];

  return (
    <div className="space-y-6">
      {/* Live Status Indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isLive ? 'Live' : 'Offline'} • Updates every 5s
          </span>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className={`text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {metric.change}
                      </span>
                    </div>
                  </div>
                  <IconComponent className="h-8 w-8 text-muted-foreground" />
                </div>
                {isLive && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Visitor Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="h-5 w-5 mr-2 text-green-500" />
              Live Visitor Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visitorSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{session.location}</span>
                        {session.isNew && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center">
                          {session.device === 'Mobile' ? <Smartphone className="h-3 w-3 mr-1" /> : <Monitor className="h-3 w-3 mr-1" />}
                          {session.device}
                        </span>
                        <span>{session.browser}</span>
                        <span>{session.currentPage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-medium">{session.duration}</div>
                    <div className="text-muted-foreground">{session.actions} actions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-500" />
              Traffic Sources (Live)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{source.source}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{source.visitors} visitors</span>
                      <span className="text-sm font-medium">{source.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
            Top Pages (Last Hour)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {topPages.map((page, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">{page.page}</div>
                <div className="text-2xl font-bold text-blue-600">{page.views}</div>
                <div className="text-xs text-muted-foreground">views</div>
                <div className="text-xs text-green-600 mt-2">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {page.time} avg
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}