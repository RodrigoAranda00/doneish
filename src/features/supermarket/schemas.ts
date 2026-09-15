import { z } from 'zod';

export const ShoppingListSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
  archivedAt: z.string().datetime().optional(),
  isArchived: z.boolean(),
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  listId: z.string().min(1),
  name: z.string().min(1).max(50),
  color: z.string().min(1),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});

export const SupermarketItemSchema = z.object({
  id: z.string().min(1),
  listId: z.string().min(1),
  name: z.string().min(1).max(100),
  price: z.number().min(0.01).max(99999.99).optional(),
  purchased: z.boolean(),
  excluded: z.boolean(),
  categoryId: z.string().min(1).optional(),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  purchasedAt: z.string().datetime().optional(),
});

export const CreateItemInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .max(100, 'Name must be less than 100 characters'),
  price: z
    .number()
    .min(0.01, 'Price must be at least $0.01')
    .max(99999.99, 'Price must be less than $100,000')
    .optional(),
});

export const UpdateItemInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  price: z
    .number()
    .min(0.01, 'Price must be at least $0.01')
    .max(99999.99, 'Price must be less than $100,000')
    .optional()
    .nullable(),
});

export const CategoryInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Name must be less than 50 characters'),
  color: z.string().min(1, 'Color is required'),
});

export const UpdateCategoryInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  color: z.string().min(1).optional(),
});

// Schema for v1 (for migration validation)
const SupermarketItemSchemaV1 = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  price: z.number().min(0.01).max(99999.99).optional(),
  purchased: z.boolean(),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  purchasedAt: z.string().datetime().optional(),
});

// Schema for v2 (for migration validation)
const SupermarketItemSchemaV2 = z.object({
  id: z.string().min(1),
  listId: z.string().min(1),
  name: z.string().min(1).max(100),
  price: z.number().min(0.01).max(99999.99).optional(),
  purchased: z.boolean(),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  purchasedAt: z.string().datetime().optional(),
});

// Schema for v3 (for migration validation)
const SupermarketItemSchemaV3 = z.object({
  id: z.string().min(1),
  listId: z.string().min(1),
  name: z.string().min(1).max(100),
  price: z.number().min(0.01).max(99999.99).optional(),
  purchased: z.boolean(),
  excluded: z.boolean(),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  purchasedAt: z.string().datetime().optional(),
});

export const SupermarketStorageSchema = z.discriminatedUnion('schemaVersion', [
  // v1 (for migration validation)
  z.object({
    schemaVersion: z.literal(1),
    data: z.object({
      items: z.array(SupermarketItemSchemaV1),
    }),
  }),
  // v2 (for migration validation)
  z.object({
    schemaVersion: z.literal(2),
    data: z.object({
      currentListId: z.string().min(1),
      lists: z.array(ShoppingListSchema),
      items: z.array(SupermarketItemSchemaV2),
    }),
  }),
  // v3 (for migration validation)
  z.object({
    schemaVersion: z.literal(3),
    data: z.object({
      currentListId: z.string().min(1),
      lists: z.array(ShoppingListSchema),
      items: z.array(SupermarketItemSchemaV3),
    }),
  }),
  // v4 (current)
  z.object({
    schemaVersion: z.literal(4),
    data: z.object({
      currentListId: z.string().min(1),
      lists: z.array(ShoppingListSchema),
      items: z.array(SupermarketItemSchema),
      categories: z.array(CategorySchema),
    }),
  }),
]);

export type SupermarketStorage = z.infer<typeof SupermarketStorageSchema>;
