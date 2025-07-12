import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Calendar,
  Camera,
  Target,
  Award,
  Clock,
  Activity,
  Zap,
  Star,
  Download
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState("12months");
  const [metricType, setMetricType] = useState("revenue");

  // Mock comprehensive analytics data
  const revenueData = [
    { month: "Jan 2024", revenue: 3250, bookings: 8, leads: 23, conversion: 35 },
    { month: "Feb 2024", revenue: 4100, bookings: 12, leads: 31, conversion: 39 },
    { month: "Mar 2024", revenue: 5200, bookings: 15, leads: 28, conversion: 54 },
    { month: "Apr 2024", revenue: 6800, bookings: 18, leads: 42, conversion: 43 },
    { month: "May 2024", revenue: 8900, bookings: 22, leads: 38, conversion: 58 },
    { month: "Jun 2024", revenue: 12400, bookings: 28, leads: 45, conversion: 62 },
    { month: "Jul 2024", revenue: 15200, bookings: 32, leads: 52, conversion: 62 },
    { month: "Aug 2024", revenue: 11800, bookings: 26, leads: 48, conversion: 54 },
    { month: "Sep 2024", revenue: 9600, bookings: 21, leads: 39, conversion: 54 },
    { month: "Oct 2024", revenue: 8200, bookings: 19, leads: 35, conversion: 54 },
    { month: "Nov 2024", revenue: 6800, bookings: 16, leads: 29, conversion: 55 },
    { month: "Dec 2024", revenue: 14200, bookings: 31, leads: 48, conversion: 65 }
  ];

  const serviceBreakdown = [
    { name: "Wedding Photography", value: 42, revenue: 52400, count: 18 },
    { name: "Portrait Sessions", value: 28, revenue: 34600, count: 45 },
    { name: "Real Estate", value: 15, revenue: 18200, count: 67 },
    { name: "Corporate Events", value: 10, revenue: 12800, count: 24 },
    { name: "Aerial Photography", value: 5, revenue: 6200, count: 13 }
  ];

  const leadSourceData = [
    { source: "Instagram", leads: 127, converted: 89, rate: 70, cost: 2.50 },
    { source: "Website (SEO)", leads: 98, converted: 76, rate: 78, cost: 0.00 },
    { source: "Referrals", leads: 84, converted: 73, rate: 87, cost: 0.00 },
    { source: "Google Ads", leads: 156, converted: 67, rate: 43, cost: 4.80 },
    { source: "TikTok", leads: 203, converted: 58, rate: 29, cost: 1.20 },
    { source: "Facebook", leads: 89, converted: 41, rate: 46, cost: 3.20 }
  ];

  const clientMetrics = {
    totalClients: 247,
    newThisMonth: 23,
    repeatClients: 89,
    avgLifetimeValue: 1847,
    churnRate: 8.5,
    satisfactionScore: 94.2
  };

  const businessKPIs = {
    monthlyRecurringRevenue: 18500,
    averageBookingValue: 1265,
    profitMargin: 68.2,
    bookingFrequency: 2.4,
    seasonalityIndex: 1.3,
    competitorAnalysis: "Leading by 23%"
  };

  const COLORS = ['#D4A574', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "revenue": return <DollarSign className="h-4 w-4" />;
      case "bookings": return <Calendar className="h-4 w-4" />;
      case "leads": return <Users className="h-4 w-4" />;
      case "conversion": return <Target className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const currentMonthRevenue = revenueData[revenueData.length - 1].revenue;
  const previousMonthRevenue = revenueData[revenueData.length - 2].revenue;
  const revenueGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(currentMonthRevenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{revenueGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-bronze" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{clientMetrics.totalClients}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{clientMetrics.newThisMonth} this month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Booking Value</p>
                <p className="text-2xl font-bold">{formatCurrency(businessKPIs.averageBookingValue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.3%</span>
                </div>
              </div>
              <Camera className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Client Satisfaction</p>
                <p className="text-2xl font-bold">{clientMetrics.satisfactionScore}%</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600">Excellent</span>
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Bookings Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Business Performance Trends
            </span>
            <div className="flex space-x-2">
              <Select value={metricType} onValueChange={setMetricType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="bookings">Bookings</SelectItem>
                  <SelectItem value="leads">Leads</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="12months">12 Months</SelectItem>
                  <SelectItem value="24months">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  metricType === 'revenue' ? formatCurrency(value) : value,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Area 
                type="monotone" 
                dataKey={metricType} 
                stroke="#D4A574" 
                fill="#D4A574" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Service Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Service Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceBreakdown.map((service, index) => (
                <div key={service.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(service.revenue)}</div>
                    <div className="text-muted-foreground">{service.count} bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Lead Source Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSourceData.map((source, index) => (
                <div key={source.source} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{source.source}</h4>
                    <Badge 
                      variant={source.rate > 60 ? "default" : source.rate > 40 ? "secondary" : "outline"}
                    >
                      {source.rate}% conversion
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">{source.leads}</p>
                      <p>Total Leads</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{source.converted}</p>
                      <p>Converted</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">${source.cost}</p>
                      <p>Cost per Lead</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Business Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Advanced Business Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Client Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Repeat Client Rate</span>
                  <span className="font-medium">{Math.round((clientMetrics.repeatClients / clientMetrics.totalClients) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Lifetime Value</span>
                  <span className="font-medium">{formatCurrency(clientMetrics.avgLifetimeValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Churn Rate</span>
                  <span className="font-medium">{clientMetrics.churnRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking Frequency</span>
                  <span className="font-medium">{businessKPIs.bookingFrequency}x/year</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Financial Health</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Recurring Revenue</span>
                  <span className="font-medium">{formatCurrency(businessKPIs.monthlyRecurringRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit Margin</span>
                  <span className="font-medium">{businessKPIs.profitMargin}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seasonality Index</span>
                  <span className="font-medium">{businessKPIs.seasonalityIndex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Position</span>
                  <span className="font-medium">{businessKPIs.competitorAnalysis}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Growth Insights</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center text-green-700 dark:text-green-400">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="font-medium">Peak Season Ahead</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Wedding bookings typically increase 40% in Q2
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center text-blue-700 dark:text-blue-400">
                    <Target className="h-4 w-4 mr-2" />
                    <span className="font-medium">Optimization Opportunity</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Focus on Instagram ads - highest ROI source
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center text-purple-700 dark:text-purple-400">
                    <Star className="h-4 w-4 mr-2" />
                    <span className="font-medium">Client Success</span>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                    94% satisfaction drives 73% referral rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}