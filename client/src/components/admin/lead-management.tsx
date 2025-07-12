import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Users, 
  TrendingUp, 
  Eye, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  DollarSign,
  Target,
  UserPlus,
  Filter,
  Search,
  Instagram,
  Globe,
  Zap,
  Star
} from "lucide-react";
import { format } from "date-fns";

export function LeadManagement() {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Mock data for demonstration - in real app, fetch from API
  const leads = [
    {
      id: 1,
      clientId: 6,
      source: "instagram",
      medium: "organic",
      campaign: "hawaii_wedding_showcase",
      formData: {
        name: "Ashley & Ryan Thompson",
        email: "ashley.ryan@email.com",
        phone: "+1 (808) 555-0987",
        eventType: "wedding",
        preferredDate: "2025-08-15",
        guestCount: 150,
        budget: "$4000-6000",
        message: "Looking for drone coverage for our beach wedding in Maui"
      },
      score: 85,
      temperature: "hot",
      qualification: "qualified",
      createdAt: "2025-07-10T14:30:00Z"
    },
    {
      id: 2,
      clientId: null,
      source: "website",
      medium: "organic",
      campaign: "seo_portrait_session",
      formData: {
        name: "Marcus Johnson",
        email: "marcus.j.photos@gmail.com",
        phone: "+1 (808) 555-0654",
        eventType: "corporate",
        company: "Pacific Tech Solutions",
        teamSize: 12,
        budget: "$1500-2500",
        message: "Need headshots for entire team, flexible on timing"
      },
      score: 70,
      temperature: "warm",
      qualification: "qualified",
      createdAt: "2025-07-09T10:15:00Z"
    },
    {
      id: 3,
      clientId: null,
      source: "referral",
      medium: "word_of_mouth",
      campaign: "client_referral_program",
      formData: {
        name: "Sophie Martinez",
        email: "sophie.hawaii@outlook.com",
        phone: "+1 (808) 555-0321",
        eventType: "maternity",
        preferredDate: "2025-07-25",
        location: "Oahu beaches",
        budget: "$800-1200",
        message: "Referred by Jessica Martinez - need maternity photos before baby arrives"
      },
      score: 90,
      temperature: "hot",
      qualification: "qualified",
      createdAt: "2025-07-08T16:45:00Z"
    },
    {
      id: 4,
      clientId: null,
      source: "google",
      medium: "paid",
      campaign: "google_ads_real_estate",
      formData: {
        name: "Robert Kim",
        email: "rkim.realestate@pacific.com",
        phone: "+1 (808) 555-0111",
        eventType: "real_estate",
        propertyType: "luxury_home",
        location: "Diamond Head area",
        budget: "$500-800",
        message: "Need drone photography for high-end listing, quick turnaround preferred"
      },
      score: 75,
      temperature: "warm",
      qualification: "qualified",
      createdAt: "2025-07-07T09:20:00Z"
    },
    {
      id: 5,
      clientId: null,
      source: "tiktok",
      medium: "organic",
      campaign: "viral_drone_video",
      formData: {
        name: "Emma Wilson",
        email: "emma.adventures@gmail.com",
        phone: "+1 (808) 555-0789",
        eventType: "adventure",
        activityType: "surfing_session",
        preferredDate: "2025-07-20",
        budget: "$400-600",
        message: "Saw your TikTok drone shots - want similar for my surf competition"
      },
      score: 60,
      temperature: "warm",
      qualification: "unqualified",
      createdAt: "2025-07-06T11:30:00Z"
    }
  ];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "instagram": return <Instagram className="h-4 w-4" />;
      case "website": return <Globe className="h-4 w-4" />;
      case "google": return <Search className="h-4 w-4" />;
      case "tiktok": return <Zap className="h-4 w-4" />;
      case "referral": return <Users className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case "hot": return "bg-red-100 text-red-800";
      case "warm": return "bg-yellow-100 text-yellow-800";
      case "cold": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getQualificationColor = (qual: string) => {
    switch (qual) {
      case "qualified": return "bg-green-100 text-green-800";
      case "unqualified": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.formData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.formData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "hot" && lead.temperature === "hot") ||
                         (filterStatus === "qualified" && lead.qualification === "qualified") ||
                         (filterStatus === "unqualified" && lead.qualification === "unqualified");
    
    return matchesSearch && matchesFilter;
  });

  const leadStats = {
    total: leads.length,
    hot: leads.filter(l => l.temperature === "hot").length,
    qualified: leads.filter(l => l.qualification === "qualified").length,
    avgScore: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length),
    conversionRate: Math.round((leads.filter(l => l.clientId).length / leads.length) * 100)
  };

  return (
    <div className="space-y-6">
      {/* Lead Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-bronze" />
              <div>
                <p className="text-2xl font-bold">{leadStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{leadStats.hot}</p>
                <p className="text-xs text-muted-foreground">Hot Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{leadStats.qualified}</p>
                <p className="text-xs text-muted-foreground">Qualified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-bronze" />
              <div>
                <p className="text-2xl font-bold">{leadStats.avgScore}</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{leadStats.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Lead Pipeline Management
            </span>
            <Button className="btn-bronze">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads by name, email, or source..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter leads" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                <SelectItem value="hot">Hot Leads</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads List */}
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{lead.formData.name}</h3>
                      <Badge className={getTemperatureColor(lead.temperature)}>
                        {lead.temperature}
                      </Badge>
                      <Badge className={getQualificationColor(lead.qualification)}>
                        {lead.qualification}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {getSourceIcon(lead.source)}
                        <span className="text-sm text-muted-foreground capitalize">{lead.source}</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {lead.formData.email}</p>
                        <p className="flex items-center"><Phone className="h-3 w-3 mr-1" /> {lead.formData.phone}</p>
                      </div>
                      <div>
                        <p><strong>Service:</strong> {lead.formData.eventType}</p>
                        <p><strong>Budget:</strong> {lead.formData.budget}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm mt-2 text-muted-foreground">{lead.formData.message}</p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-right">
                      <div className="text-lg font-bold text-bronze">{lead.score}/100</div>
                      <div className="text-xs text-muted-foreground">Lead Score</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="btn-bronze">
                        <Calendar className="h-3 w-3 mr-1" />
                        Convert
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}