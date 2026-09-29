export interface UserPreference {
  favoriteCategories: string[];
  budgetTier: 'budget' | 'mid-range' | 'premium';
  brands: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: UserPreference;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
}
