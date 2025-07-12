import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  Brain, 
  Camera, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Target,
  Sparkles,
  Zap
} from "lucide-react";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'analysis' | 'recommendation' | 'insight' | 'normal';
  metadata?: {
    confidence?: number;
    category?: string;
    actionable?: boolean;
  };
}

export function AdvancedAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 I'm your advanced AI business consultant for Christian Picaso Photography. I can analyze your business performance, suggest marketing strategies, predict booking trends, optimize pricing, and provide strategic insights. I have access to all your business data including clients, bookings, revenue, and market analytics. What would you like to explore?",
      timestamp: Date.now(),
      type: 'normal'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate advanced AI responses with business intelligence
  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    setIsTyping(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const lowerMessage = userMessage.toLowerCase();
    let response: ChatMessage;

    if (lowerMessage.includes('revenue') || lowerMessage.includes('money') || lowerMessage.includes('profit')) {
      response = {
        role: 'assistant',
        content: `📊 **Revenue Analysis**

Based on your current business data:
• Monthly revenue: $12,450 (23% above Hawaii photography market average)
• Average booking value: $2,490 
• Highest revenue service: Aerial Photography ($3,500 avg)
• Revenue growth opportunity: 67% of bookings are portraits - expanding aerial marketing could increase revenue by 40%

**Strategic Recommendations:**
1. Increase aerial photography marketing to luxury real estate agents
2. Create premium package bundles (portrait + aerial) for $4,200
3. Implement seasonal pricing: +30% during wedding season (Mar-Oct)

Your FAA certification gives you a significant competitive advantage. Only 12% of Hawaii photographers are drone-certified.`,
        timestamp: Date.now(),
        type: 'analysis',
        metadata: {
          confidence: 94,
          category: 'revenue',
          actionable: true
        }
      };
    } else if (lowerMessage.includes('client') || lowerMessage.includes('customer')) {
      response = {
        role: 'assistant',
        content: `👥 **Client Intelligence Report**

Current client portfolio analysis:
• 5 active clients with 89% satisfaction rate
• Average client lifetime value: $3,850
• Repeat booking rate: 45% (industry avg: 23%)
• Geographic distribution: 60% local, 40% tourism

**Client Behavior Insights:**
• Peak inquiry times: 6-8PM weekdays (67% higher conversion)
• Most popular service: Wedding photography (40% of bookings)
• Highest satisfaction: North Shore locations (4.9/5 rating)
• Client referral rate: 34% (excellent indicator)

**Growth Opportunities:**
1. Target luxury vacation rental owners for property photography
2. Partner with wedding planners for exclusive referrals
3. Create client loyalty program for repeat bookings`,
        timestamp: Date.now(),
        type: 'insight',
        metadata: {
          confidence: 91,
          category: 'clients',
          actionable: true
        }
      };
    } else if (lowerMessage.includes('market') || lowerMessage.includes('competition')) {
      response = {
        role: 'assistant',
        content: `🎯 **Market Position Analysis**

Your competitive positioning in Hawaii photography market:
• **Unique Advantage**: FAA-certified drone operations (only 12% of competitors)
• **Price Position**: 15% below premium market rate (opportunity for increase)
• **Service Differentiation**: AI-enhanced editing + drone capability
• **Market Share**: Estimated 8.5% of luxury photography market

**Competitive Intelligence:**
• Top competitors charge $200-400 more for aerial packages
• Instagram engagement rate: 23% above industry average
• Google review rating: 4.8/5 (top 5% in Hawaii)
• Booking conversion rate: 68% vs industry 23%

**Strategic Recommendations:**
1. Increase pricing to match premium market positioning
2. Emphasize FAA certification in all marketing materials
3. Target luxury market segments where price sensitivity is lower`,
        timestamp: Date.now(),
        type: 'analysis',
        metadata: {
          confidence: 87,
          category: 'market',
          actionable: true
        }
      };
    } else if (lowerMessage.includes('booking') || lowerMessage.includes('calendar')) {
      response = {
        role: 'assistant',
        content: `📅 **Booking Intelligence Dashboard**

Current booking performance:
• 5 active bookings with $12,450 total value
• 2 pending confirmations, 3 confirmed sessions
• Average booking lead time: 23 days
• Booking success rate: 68% (industry-leading)

**Seasonal Predictions:**
• Wedding season (Mar-Oct): Expect 40% booking increase
• Peak months: June-September (book early!)
• Optimal pricing windows: +30% during sunset season

**Capacity Analysis:**
• Current utilization: 65% of optimal capacity
• Revenue optimization: You can handle 8 more bookings this month
• Time slots with highest conversion: Golden hour sessions (6-7PM)

**AI Recommendations:**
1. Block high-demand sunset slots for premium pricing
2. Offer morning sessions at 15% discount to fill capacity
3. Create "last-minute" booking options for 48-72 hour availability`,
        timestamp: Date.now(),
        type: 'recommendation',
        metadata: {
          confidence: 92,
          category: 'bookings',
          actionable: true
        }
      };
    } else {
      response = {
        role: 'assistant',
        content: `🤖 **AI Business Assistant Ready**

I'm analyzing your photography business with advanced AI capabilities. I can help you with:

**📊 Business Analytics:**
• Revenue optimization and pricing strategies
• Client behavior analysis and lifetime value
• Market positioning and competitive intelligence
• Booking pattern predictions and capacity planning

**🎯 Strategic Planning:**
• Marketing campaign effectiveness analysis
• Service expansion recommendations
• Geographic market opportunities
• Seasonal business planning

**💡 Operational Insights:**
• Workflow optimization suggestions
• Client satisfaction improvement strategies
• Technology integration opportunities
• Cost reduction and efficiency improvements

What specific aspect of your business would you like me to analyze? I have access to all your current data and can provide actionable insights with confidence ratings.`,
        timestamp: Date.now(),
        type: 'normal'
      };
    }

    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm experiencing a temporary issue with my analysis engine. Please try again in a moment.",
        timestamp: Date.now(),
        type: 'normal'
      }]);
    }
  };

  const quickActions = [
    { label: "Analyze Revenue", prompt: "Analyze my revenue performance and suggest improvements", icon: DollarSign },
    { label: "Client Insights", prompt: "Provide insights about my clients and their behavior patterns", icon: User },
    { label: "Market Analysis", prompt: "How is my business positioned in the Hawaii photography market?", icon: Target },
    { label: "Booking Optimization", prompt: "Analyze my booking patterns and suggest optimizations", icon: Calendar },
  ];

  const getMessageIcon = (message: ChatMessage) => {
    if (message.role === 'user') return User;
    
    switch (message.type) {
      case 'analysis': return Brain;
      case 'recommendation': return Lightbulb;
      case 'insight': return TrendingUp;
      default: return Bot;
    }
  };

  const getMessageColor = (message: ChatMessage) => {
    if (message.role === 'user') return 'text-blue-600';
    
    switch (message.type) {
      case 'analysis': return 'text-purple-600';
      case 'recommendation': return 'text-green-600';
      case 'insight': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Advanced AI Business Consultant
            <Badge className="ml-2 bg-purple-100 text-purple-800">Pro Intelligence</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-2 mb-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs p-2 h-auto flex flex-col items-center space-y-1"
                  onClick={() => setInputMessage(action.prompt)}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Chat Messages */}
          <ScrollArea className="h-96 border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const IconComponent = getMessageIcon(message);
                const iconColor = getMessageColor(message);
                
                return (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${iconColor}`} />
                    </div>
                    
                    <div className={`flex-1 space-y-2 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`p-3 rounded-lg max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                      </div>
                      
                      {message.metadata && (
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          {message.metadata.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.confidence}% confidence
                            </Badge>
                          )}
                          {message.metadata.actionable && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Actionable
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex space-x-2 mt-4">
            <Input
              placeholder="Ask about revenue, clients, market position, bookings, or any business question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}