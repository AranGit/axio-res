/**
 * Shared axio-res instances and schemas for the playground demos.
 */

import { createAxioRes } from 'axio-res';
import { z } from 'zod';
import { faker } from '@faker-js/faker';

// ── Base URL ──
const BASE_URL = 'https://dummyjson.com';

// ────────────────────────────────────────────────
// 1. Standard client (no plugins)
// ────────────────────────────────────────────────

export const standardApi = createAxioRes({
  baseURL: BASE_URL,
});

// ────────────────────────────────────────────────
// 2. Zod Schemas
// ────────────────────────────────────────────────

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
});

export type Product = z.infer<typeof ProductSchema>;

/** Intentionally strict schema that will FAIL — requires `nonExistentField` */
export const StrictProductSchema = ProductSchema.extend({
  nonExistentField: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  age: z.number(),
  image: z.string().url(),
});

export type User = z.infer<typeof UserSchema>;

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type UsersResponse = z.infer<typeof UsersResponseSchema>;

// ────────────────────────────────────────────────
// 3. Mock client (with Faker.js)
// ────────────────────────────────────────────────

export const mockApi = createAxioRes({
  baseURL: BASE_URL,
  plugins: {
    mock: {
      enabled: true,
      delay: 600,
      dataMap: {
        '/users/random': () => ({
          id: faker.number.int({ min: 1, max: 9999 }),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          age: faker.number.int({ min: 18, max: 80 }),
          image: faker.image.avatar(),
          company: faker.company.name(),
          phone: faker.phone.number(),
          address: {
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
          },
        }),
        '/products/random': () => ({
          id: faker.number.int({ min: 1, max: 9999 }),
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
          discountPercentage: faker.number.float({ min: 0, max: 30, fractionDigits: 1 }),
          rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
          stock: faker.number.int({ min: 0, max: 200 }),
          brand: faker.company.name(),
          category: faker.commerce.department(),
          thumbnail: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
          images: Array.from({ length: 3 }, () =>
            faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
          ),
        }),
      },
    },
  },
});

// ────────────────────────────────────────────────
// 4. StateSync client (demo)
// ────────────────────────────────────────────────

export const createStateSyncApi = (onSync: (key: string, data: unknown) => void) =>
  createAxioRes({
    baseURL: BASE_URL,
    plugins: {
      stateSync: { onSync },
    },
  });
