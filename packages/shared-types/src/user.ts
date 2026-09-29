export interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: {
    categories: string[];
    budgetTier: string;
  };
}
