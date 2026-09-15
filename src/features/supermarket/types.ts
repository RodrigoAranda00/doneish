export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  archivedAt?: string;
  isArchived: boolean;
}

export interface Category {
  id: string;
  listId: string;
  name: string;
  color: string;
  order: number;
  createdAt: string;
}

export interface SupermarketItem {
  id: string;
  listId: string;
  name: string;
  price?: number;
  purchased: boolean;
  excluded: boolean;
  categoryId?: string;
  order: number;
  createdAt: string;
  purchasedAt?: string;
}

export interface CreateListInput {
  name: string;
}

export interface CreateItemInput {
  name: string;
  price?: number;
}

export interface UpdateItemInput {
  name?: string;
  price?: number | null;
}

export interface CategoryInput {
  name: string;
  color: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
}
