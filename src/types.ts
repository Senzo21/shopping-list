export type User = {
  id: number;
  email: string;
  password: string; // encrypted at rest in db.json (assignment purpose only)
  name: string;
  surname: string;
  cell: string;
};

export type ListItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category?: string;
  imageUrl?: string;
};

export type ShoppingList = {
  id: number;
  ownerId: number;
  name: string;
  createdAt: string;
  items: ListItem[];
};

export type AuthState = {
  user: Omit<User, 'password'> | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
  error?: string | null;
};
