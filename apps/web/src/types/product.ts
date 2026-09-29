export type Product = {
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
};

export interface ProductFilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  searchQuery: string;
  availability?: "all" | "in-stock" | "out-of-stock";
  sortBy: "featured" | "price-low" | "price-high" | "rating" | "popularity";
}
