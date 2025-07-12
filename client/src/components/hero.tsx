import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Award } from "lucide-react";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/attached_assets/20250619_1046_Honolulu Sunset Vibes_simple_compose_01jy4z2q86e6mbdtxctwr6e8mn_1752351152753.mp4" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <img 
            src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Hawaii landscape photography"
            className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 animate-fade-in max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            <Award className="h-8 w-8 text-bronze mr-3" />
            <span className="text-lg font-medium">FAA Certified Drone Operator</span>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Licensed to Fly<br />
            <span className="text-4xl md:text-6xl text-[var(--sandstone)]">
              Trained to Thrill
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
            FAA-Certified Aerial Photography — capturing Hawaii's beauty from every angle, legally and spectacularly
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="btn-bronze text-lg font-medium transform hover:scale-105 transition-all duration-200"
              onClick={() => scrollToSection('portfolio')}
            >
              View Portfolio
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-charcoal text-lg font-medium transition-all duration-200"
              onClick={() => scrollToSection('booking')}
            >
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white" />
      </div>
    </section>
  );
}