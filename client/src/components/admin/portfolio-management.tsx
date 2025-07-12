import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGalleryImages } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Camera, 
  Search, 
  Plus, 
  Filter,
  Eye,
  Star,
  Tag,
  Edit,
  Trash2,
  Download,
  Share
} from "lucide-react";

export function PortfolioManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['/api/gallery'],
    queryFn: () => fetchGalleryImages(),
  });

  const categories = ["all", "wedding", "portrait", "aerial", "real_estate", "event"];

  const filteredImages = images?.filter((image: any) => {
    const matchesSearch = image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getImageStats = () => {
    if (!images) return { total: 0, featured: 0, categories: {} };
    
    const stats = {
      total: images.length,
      featured: images.filter((img: any) => img.featured).length,
      categories: images.reduce((acc: any, img: any) => {
        acc[img.category] = (acc[img.category] || 0) + 1;
        return acc;
      }, {})
    };
    
    return stats;
  };

  const toggleFeatured = (imageId: number, featured: boolean) => {
    // In a real implementation, this would call an API to update the image
    console.log(`Toggle featured status for image ${imageId} to ${!featured}`);
  };

  const deleteImage = (imageId: number) => {
    // In a real implementation, this would call an API to delete the image
    console.log(`Delete image ${imageId}`);
  };

  const stats = getImageStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Portfolio Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Portfolio Management
            </CardTitle>
            <Button className="btn-bronze">
              <Plus className="h-4 w-4 mr-1" />
              Upload Photos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Portfolio Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Images</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
                </div>
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Featured</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats.featured}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Categories</p>
                  <p className="text-2xl font-bold text-green-800">{Object.keys(stats.categories).length}</p>
                </div>
                <Tag className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">AI Analysis</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.total}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Grid */}
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image: any) => (
              <Dialog key={image.id}>
                <DialogTrigger asChild>
                  <div
                    className="group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.thumbnailUrl}
                      alt={image.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs bg-white/90 text-black">
                        {image.category}
                      </Badge>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Image Details</DialogTitle>
                  </DialogHeader>
                  {selectedImage && (
                    <ImageDetailView 
                      image={selectedImage} 
                      onToggleFeatured={toggleFeatured}
                      onDelete={deleteImage}
                    />
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== "all" 
                  ? "No images match your search criteria" 
                  : "No images in portfolio yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ImageDetailView({ 
  image, 
  onToggleFeatured, 
  onDelete 
}: { 
  image: any; 
  onToggleFeatured: (id: number, featured: boolean) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Image Preview */}
      <div className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={image.url}
            alt={image.originalName}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleFeatured(image.id, image.featured)}
          >
            <Star className={`h-4 w-4 mr-1 ${image.featured ? 'fill-current text-yellow-500' : ''}`} />
            {image.featured ? 'Remove from Featured' : 'Add to Featured'}
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <Button variant="destructive" size="sm" onClick={() => onDelete(image.id)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Image Metadata */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Image Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{image.originalName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline">{image.category}</Badge>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {image.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Upload Date</p>
              <p className="text-sm">{new Date(image.uploadedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        {image.aiAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Quality Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-bronze h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(image.aiAnalysis.quality / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{image.aiAnalysis.quality}/10</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Style</p>
                <Badge variant="outline">{image.aiAnalysis.style}</Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Composition</p>
                <p className="text-sm">{image.aiAnalysis.composition}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Detected Emotions</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {image.aiAnalysis.emotions?.map((emotion: string) => (
                    <Badge key={emotion} variant="secondary" className="text-xs">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}