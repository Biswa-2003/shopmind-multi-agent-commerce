export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
  availability: "in-stock" | "out-of-stock";
  tags: string[];
  matchScore?: number;
  aiPros?: string[];
  aiCons?: string[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  availability?: "in-stock" | "out-of-stock" | "all";
  sortBy?: "featured" | "price-low" | "price-high" | "rating" | "popularity";
}
