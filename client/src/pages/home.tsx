import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Award,
  Star,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  // Fetch gallery images
  const { data: featuredImages } = useQuery({
    queryKey: ["/api/gallery", { featured: true }],
    queryFn: async () => {
      const response = await fetch("/api/gallery?featured=true");
      if (!response.ok) throw new Error("Failed to fetch gallery");
      return response.json();
    },
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Capture by Christian
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Professional photography in Hawaii. Weddings, portraits, and FAA-certified drone services 
            capturing your most precious moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg">
                Book Your Session
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A showcase of our finest photography across Hawaii's stunning landscapes
            </p>
          </div>

          {featuredImages && featuredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredImages.slice(0, 6).map((image: any, index: number) => (
                <div 
                  key={image.id || index}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <img
                    src={image.url || `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                    alt={image.originalName || "Featured work"}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold mb-2">
                        {image.originalName || image.filename || "Featured Work"}
                      </h3>
                      {image.category && (
                        <p className="text-sm bg-amber-600 px-3 py-1 rounded-full">
                          {image.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Gallery coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Photography Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional photography services tailored to capture your special moments
            </p>
          </div>

          {services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service: any, index: number) => (
                <Card key={service.id || index} className="hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <Camera className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="text-3xl font-bold text-amber-600 mb-6">
                      ${parseInt(service.price || 0).toLocaleString()}
                    </div>
                    <Link href="/booking">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Services information coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                About Christian
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Born and raised in Hawaii, Christian has spent over a decade mastering the art of 
                photography across the Hawaiian Islands. His passion for capturing life's most 
                precious moments stems from a deep connection to the islands' natural beauty.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                As an FAA-certified drone pilot, Christian brings both traditional artistry and 
                cutting-edge aerial perspectives to every shoot.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-amber-500 mr-2" />
                  <span>FAA Certified</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-6 w-6 text-amber-500 mr-2" />
                  <span>10+ Years Experience</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
                alt="Christian - Professional Photographer"
                className="rounded-xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Let's Create Something Beautiful
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Ready to capture your story? Reach out and let's discuss your vision.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Call</h3>
              <p>(808) 555-PHOTO</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p>hello@capturebychristian.com</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Location</h3>
              <p>Honolulu, Hawaii</p>
            </div>
          </div>

          <Link href="/booking">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 text-lg mb-8">
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Camera className="h-6 w-6 mr-2" />
                Capture by Christian
              </h3>
              <p className="text-gray-400">
                Hawaii's premier photographer specializing in weddings, portraits, and aerial photography.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Wedding Photography</li>
                <li>Portrait Sessions</li>
                <li>Aerial Photography</li>
                <li>Event Coverage</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#gallery" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                <Youtube className="h-6 w-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Capture by Christian. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}