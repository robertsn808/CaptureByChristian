import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand, Award, Star } from "lucide-react";
import { Lightbox } from "@/components/lightbox";
import { Link } from "wouter";

export function FeaturedGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<{url: string, title: string, category: string} | null>(null);

  const { data: featuredImages, isLoading } = useQuery({
    queryKey: ['/api/gallery', { featured: true }],
    queryFn: () => fetch('/api/gallery?featured=true').then(res => res.json()),
  });

  const openLightbox = (image: any) => {
    setCurrentImage({
      url: image.url,
      title: image.originalName || image.filename,
      category: image.category
    });
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-cream dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Featured Work</h2>
            <p className="text-xl text-muted-foreground">Loading featured images...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-cream dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="from-bronze to-teal rounded-full p-1 bg-[#7e698a]">
              <div className="bg-white dark:bg-background rounded-full px-6 py-2">
                <span className="text-sm font-medium bg-gradient-to-r from-bronze to-teal bg-clip-text text-[#39312e]">
                  Featured Work
                </span>
              </div>
            </div>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-charcoal via-bronze to-charcoal bg-clip-text text-transparent">
            Showcasing Excellence
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A curated selection of our finest work showcasing the artistry and technical excellence of Hawaii's premier photography services.
          </p>
        </div>

        {/* Featured Images Grid */}
        {featuredImages && featuredImages.length > 0 ? (
          <>
            

            {/* View Full Portfolio CTA */}
            <div className="text-center">
              <Link href="/portfolio">
                <Button size="lg" className="btn-bronze group">
                  View Complete Portfolio
                  <Expand className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Featured Images Yet</h3>
            <p className="text-muted-foreground mb-6">
              Our featured gallery will showcase the best work once images are marked as featured.
            </p>
            <Link href="/portfolio">
              <Button variant="outline">
                Browse All Work
              </Button>
            </Link>
          </div>
        )}

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