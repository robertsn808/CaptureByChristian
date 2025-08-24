// Enhanced Featured Gallery v2.0.0 - Cinematic Design
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Expand, Star } from "lucide-react";
import { Lightbox } from "@/components/lightbox";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export function FeaturedGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    title: string;
    category: string;
  } | null>(null);

  const { data: featuredImages, isLoading } = useQuery({
    queryKey: ["/api/gallery", { featured: true }],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/gallery?featured=true");
      return response.json();
    },
  });

  const openLightbox = (image: any) => {
    setCurrentImage({
      url: image.url,
      title: image.originalName || image.filename,
      category: image.category,
    });
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-cream dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Featured Work
            </h2>
            <p className="text-xl text-muted-foreground">
              Loading featured images...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="section-spacing bg-gradient-to-b from-cream via-white to-cream dark:from-background dark:via-muted dark:to-background" style={{border: '5px solid red', background: 'linear-gradient(45deg, #fafaf9, #bd6628, #008a8a)'}}>
      <div className="container mx-auto px-4">
        {/* DEBUG: Testing Enhanced Gallery v2.0.0 */}
        <div style={{background: 'yellow', padding: '20px', margin: '20px 0', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: 'black'}}>
          🎨 ENHANCED GALLERY v2.0.0 - {featuredImages ? `${featuredImages.length} images loaded` : `Loading... isLoading: ${isLoading}`}
          <br />
          API Status: {featuredImages === undefined ? 'Undefined' : featuredImages === null ? 'Null' : `Array with ${featuredImages?.length || 0} items`}
        </div>
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block">
            <h2 className="font-playfair text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              Showcasing Excellence
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-bronze via-teal to-bronze rounded-full mb-8 animate-shimmer" />
          </div>
          <p className="text-xl text-charcoal/70 dark:text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            A curated collection of extraordinary moments captured through the lens of creativity and precision, 
            showcasing Hawaii's unparalleled beauty and our commitment to photographic excellence.
          </p>
        </div>

        {/* Featured Images Grid - FORCE SHOW FOR DEBUG */}
        {true ? (
          <>
            <div className="gallery-masonry mb-20">
              {featuredImages && featuredImages.length > 0 ? featuredImages.map((image: any, index: number) => (
                <div
                  key={image.id || index}
                  className={`group relative break-inside-avoid mb-6 overflow-hidden rounded-2xl bg-muted/50 cursor-pointer glass-morphism hover-lift animate-fade-in`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                  onClick={() => openLightbox(image)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={
                        image.originalName || image.filename || "Featured image"
                      }
                      className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Floating elements */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-float">
                      <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="text-white font-playfair text-xl font-semibold mb-2">
                          {image.originalName ||
                            image.filename ||
                            "Featured Work"}
                        </h4>
                        {image.category && (
                          <Badge
                            variant="secondary"
                            className="mb-3 bg-bronze/80 text-white border-bronze/50 backdrop-blur-sm"
                          >
                            {image.category}
                          </Badge>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm">Click to view</span>
                          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                            <Expand className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{background: 'red', color: 'white', padding: '50px', textAlign: 'center', fontSize: '24px'}}>
                  NO IMAGES LOADED! API returned: {JSON.stringify(featuredImages)}
                </div>
              )}
            </div>

            {/* View Full Portfolio CTA */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
              <Link href="/portfolio">
                <Button size="lg" className="btn-bronze group relative overflow-hidden hover-lift">
                  <span className="relative z-10">View Complete Portfolio</span>
                  <Expand className="ml-2 h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal to-bronze opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Featured Images Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Our featured gallery will showcase the best work once images are
              marked as featured.
            </p>
            <Link href="/portfolio">
              <Button variant="outline">Browse All Work</Button>
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
