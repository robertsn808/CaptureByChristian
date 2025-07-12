import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGalleryImages } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand, Award } from "lucide-react";
import { Lightbox } from "@/components/lightbox";

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'aerial', label: 'Aerial' },
  { id: 'landscape', label: 'Landscape' },
];

// Sample portfolio images for demonstration
const sampleImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "wedding",
    title: "Beach Wedding Ceremony",
    featured: true,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "portrait",
    title: "Professional Portrait",
    featured: false,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "aerial",
    title: "Drone Coastline Photography",
    featured: true,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "landscape",
    title: "Hawaii Waterfall",
    featured: false,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "wedding",
    title: "Romantic Beach Wedding",
    featured: true,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "aerial",
    title: "Resort Aerial View",
    featured: false,
  },
];

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<typeof sampleImages[0] | null>(null);

  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ['/api/gallery'],
    queryFn: () => fetchGalleryImages(),
    initialData: sampleImages, // Use sample data as fallback
  });

  const filteredImages = galleryImages?.filter((image: any) => 
    activeFilter === 'all' || image.category === activeFilter
  ) || [];

  const openLightbox = (image: typeof sampleImages[0]) => {
    setCurrentImage(image);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-cream dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Portfolio</h2>
            <p className="text-xl text-muted-foreground">Loading portfolio...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-cream dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Capturing life's most precious moments across the Hawaiian Islands
          </p>
        </div>

        {/* Portfolio Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeFilter === category.id ? "default" : "outline"}
              className={`rounded-full ${
                activeFilter === category.id 
                  ? 'btn-bronze' 
                  : 'border-bronze text-bronze hover:bg-bronze hover:text-white'
              }`}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-masonry">
          {filteredImages.map((image: any) => (
            <div key={image.id} className="mb-4 break-inside-avoid group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={image.url}
                  alt={image.title || "Portfolio image"}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                  onClick={() => openLightbox(image)}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Expand className="text-white text-2xl" />
                </div>
                {image.category === 'aerial' && (
                  <Badge className="absolute top-4 right-4 bg-bronze text-white">
                    <Award className="h-3 w-3 mr-1" />
                    FAA Certified
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {currentImage && (
          <Lightbox
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            image={currentImage}
          />
        )}
      </div>
    </section>
  );
}
