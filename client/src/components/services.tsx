import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Award } from "lucide-react";
import { Link } from "wouter";

// Service features mapping for display
const serviceFeatures: Record<string, string[]> = {
  wedding: [
    "8 hours of coverage",
    "500+ professionally edited photos",
    "FAA-certified drone photography",
    "Online gallery with download rights",
    "Print release for all images",
    "Backup photographer available",
    "Weather contingency planning",
  ],
  portrait: [
    "1-2 hours of shooting",
    "50+ professionally edited photos",
    "Multiple outfit changes",
    "Location scouting included",
    "Styling consultation",
    "Online gallery access",
    "Print release included",
  ],
  aerial: [
    "FAA Part 107 certified pilot",
    "4K video and high-resolution stills",
    "Legal airspace navigation",
    "Commercial insurance coverage",
    "Weather backup scheduling",
    "Raw file delivery option",
  ],
  event: [
    "Professional event coverage",
    "Candid and posed photography",
    "Same-day preview images",
    "Online gallery within 48 hours",
    "Group photo coordination",
    "Low-light expertise",
  ],
  real_estate: [
    "Interior and exterior shots",
    "HDR processing for optimal lighting",
    "Drone aerial views (where permitted)",
    "Virtual tour compatibility",
    "MLS-ready sizing",
    "24-hour delivery",
  ],
};

const serviceImages: Record<string, string> = {
  wedding:
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  portrait:
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  aerial:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  event:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  real_estate:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
};

export function Services() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["/api/services"],
    queryFn: fetchServices,
  });

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Services & Packages
            </h2>
            <p className="text-xl text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      className="section-spacing bg-gradient-to-b from-white via-cream to-sandstone/20 dark:from-background dark:via-muted dark:to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block">
            <h2 className="font-playfair text-5xl lg:text-6xl font-bold text-charcoal dark:text-foreground mb-6 gradient-text">
              Photography Services
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-bronze via-teal to-bronze rounded-full mb-8 animate-shimmer" />
          </div>
          <p className="text-xl text-charcoal/70 dark:text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Elevating moments into timeless art through professional photography services that capture 
            Hawaii's unparalleled beauty with both traditional mastery and innovative aerial perspectives
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service: any, index: number) => (
            <Card
              key={service.id}
              className={`group overflow-hidden glass-card hover-lift animate-fade-in border-0 bg-white/80 dark:bg-muted/80`}
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    serviceImages[service.category] || serviceImages["portrait"]
                  }
                  alt={service.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {service.category === "aerial" && (
                  <Badge className="absolute top-4 left-4 bg-bronze/90 text-white border-bronze/50 backdrop-blur-sm animate-float">
                    <Award className="h-3 w-3 mr-1" />
                    FAA Certified
                  </Badge>
                )}
                
                {/* Floating price indicator */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-semibold text-sm">${parseInt(service.price).toLocaleString()}</span>
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="font-playfair text-2xl text-charcoal dark:text-foreground group-hover:text-bronze transition-colors duration-300">
                  {service.name}
                </CardTitle>
                <p className="text-charcoal/60 dark:text-muted-foreground leading-relaxed">{service.description}</p>
              </CardHeader>

              <CardContent className="pb-4">
                <ul className="space-y-3 mb-6">
                  {serviceFeatures[service.category]?.map(
                    (feature: string, featureIndex: number) => (
                      <li 
                        key={featureIndex} 
                        className={`flex items-center animate-slide-in-left`}
                        style={{
                          animationDelay: `${(index * 200) + (featureIndex * 100)}ms`,
                        }}
                      >
                        <Check className="h-4 w-4 text-bronze mr-3 flex-shrink-0" />
                        <span className="text-sm text-charcoal/80 dark:text-foreground">{feature}</span>
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>

              <CardFooter className="flex justify-between items-center pt-4 border-t border-bronze/20">
                <div className="text-left">
                  <span className="text-sm text-charcoal/60 dark:text-muted-foreground block">Starting at</span>
                  <span className="text-3xl font-bold text-bronze font-playfair">
                    ${parseInt(service.price).toLocaleString()}
                  </span>
                </div>
                <Link href="/booking">
                  <Button className="btn-bronze group relative overflow-hidden hover-lift">
                    <span className="relative z-10">Book Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal to-bronze opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
