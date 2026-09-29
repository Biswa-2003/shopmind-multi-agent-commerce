export interface SharedProductSpec {
  [key: string]: string | number | boolean;
}

export interface SharedProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  images: string[];
  features: string[];
  specs: SharedProductSpec;
  aiPros?: string[];
  aiCons?: string[];
  matchScore?: number;
  tags: string[];
}
