import React from "react";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Portfolio } from "@/components/portfolio";
import { Services } from "@/components/services";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Shield, 
  Brain, 
  Phone, 
  Mail, 
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Camera
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Portfolio Section */}
      <Portfolio />
      
      {/* Services Section */}
      <Services />
      
      {/* Booking CTA Section */}
      <section id="booking" className="py-20 bg-cream dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Ready to Capture Your Story?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's create something beautiful together. Book your session or chat with our AI assistant for instant help.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Quick Booking Card */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-bronze mx-auto mb-4" />
                  <h3 className="font-playfair text-2xl font-bold mb-4">Book Your Session</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete booking system with calendar integration, contract management, and payment processing.
                  </p>
                  <Link href="/booking">
                    <Button size="lg" className="btn-bronze w-full">
                      Start Booking Process
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Card */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-teal mx-auto mb-4" />
                  <h3 className="font-playfair text-2xl font-bold mb-4">AI Booking Assistant</h3>
                  <p className="text-muted-foreground mb-6">
                    24/7 intelligent chat assistant to help with questions, availability, and custom quotes.
                  </p>
                  <Link href="/booking">
                    <Button size="lg" variant="outline" className="border-teal text-teal hover:bg-teal hover:text-white w-full">
                      Chat with AI Assistant
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">About Christian</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Born and raised in Hawaii, Christian has spent over a decade mastering the art of photography across the Hawaiian Islands. His passion for capturing life's most precious moments stems from a deep connection to the islands' natural beauty and cultural richness.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                As an FAA-certified drone pilot and AI-enhanced photographer, Christian brings both traditional artistry and cutting-edge technology to every shoot. His work has been featured in Pacific Weddings, Hawaii Magazine, and has garnered international recognition across social media platforms worldwide.
              </p>
              
              {/* Certifications */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-bronze text-white p-2">
                    <Award className="h-4 w-4" />
                  </Badge>
                  <div>
                    <div className="font-bold">FAA Part 107 Certified</div>
                    <div className="text-sm text-muted-foreground">Licensed Drone Operator</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-bronze text-white p-2">
                    <Award className="h-4 w-4" />
                  </Badge>
                  <div>
                    <div className="font-bold">Professional Photographer</div>
                    <div className="text-sm text-muted-foreground">10+ Years Experience</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-bronze text-white p-2">
                    <Shield className="h-4 w-4" />
                  </Badge>
                  <div>
                    <div className="font-bold">Fully Insured</div>
                    <div className="text-sm text-muted-foreground">Equipment & Liability</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-bronze text-white p-2">
                    <Brain className="h-4 w-4" />
                  </Badge>
                  <div>
                    <div className="font-bold">AI-Enhanced</div>
                    <div className="text-sm text-muted-foreground">Smart Photo Processing</div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="btn-bronze"
                onClick={() => scrollToSection('contact')}
              >
                Get In Touch
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000" 
                alt="Professional photographer portrait"
                className="rounded-xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-bronze text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Let's Create Something Beautiful</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Ready to capture your story? Reach out and let's discuss your vision.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-bronze rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Call</h3>
              <p className="text-white/70">(808) 555-PHOTO</p>
            </div>
            <div className="text-center">
              <div className="bg-bronze rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Email</h3>
              <p className="text-white/70">christian@picaso.photography</p>
            </div>
            <div className="text-center">
              <div className="bg-bronze rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Based In</h3>
              <p className="text-white/70">Honolulu, Hawaii</p>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-white/70 hover:text-bronze text-2xl transition-colors duration-200">
              <Instagram />
            </a>
            <a href="#" className="text-white/70 hover:text-bronze text-2xl transition-colors duration-200">
              <Facebook />
            </a>
            <a href="#" className="text-white/70 hover:text-bronze text-2xl transition-colors duration-200">
              <Youtube />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ultra-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-playfair text-2xl font-bold mb-4 flex items-center">
                <Camera className="h-6 w-6 mr-2 text-bronze" />
                Christian Picaso
              </h3>
              <p className="text-white/70 mb-4">
                Hawaii's premier photographer specializing in weddings, portraits, and aerial photography.
              </p>
              <div className="text-sm text-white/60">
                FAA Certified • Fully Insured • AI-Enhanced
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-bronze transition-colors duration-200">Wedding Photography</a></li>
                <li><a href="#" className="hover:text-bronze transition-colors duration-200">Portrait Sessions</a></li>
                <li><a href="#" className="hover:text-bronze transition-colors duration-200">Aerial Photography</a></li>
                <li><a href="#" className="hover:text-bronze transition-colors duration-200">Event Coverage</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#portfolio" className="hover:text-bronze transition-colors duration-200">Portfolio</a></li>
                <li><a href="#services" className="hover:text-bronze transition-colors duration-200">Pricing</a></li>
                <li><Link href="/booking" className="hover:text-bronze transition-colors duration-200">Booking</Link></li>
                <li><a href="#contact" className="hover:text-bronze transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">AI Features</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>Smart Photo Selection</li>
                <li>Auto Gallery Creation</li>
                <li>24/7 Booking Assistant</li>
                <li>Predictive Scheduling</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Christian Picaso Photography. All rights reserved. | Licensed Drone Operator | AI-Enhanced Photography</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
