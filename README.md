# axio-res

> A **Result Monad** wrapper for [Axios](https://axios-http.com/) — functional error handling, optional Zod validation, seamless mocking, and state sync for React / Next.js.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Result Monad** | Every request returns `Result<T, E>` — no more `try/catch`. |
| **Zod Validation** | Optional runtime validation with full type inference. |
| **Mock Plugin** | Intercept requests with static data or Faker.js factory functions. |
| **StateSync Plugin** | Push response data to Zustand/Redux/any store automatically. |
| **React Query Bridge** | `useAxioResQuery` hook — unwraps `Result` into React Query's `data/error`. |
| **Tree-Shakable** | Only import what you use. React/Zod are optional peer deps. |
| **TypeScript Strict** | Full discriminated union types — TypeScript narrows automatically. |

---

## 📦 Installation

```bash
npm install axio-res axios
```

### Optional Peer Dependencies

```bash
# For Zod validation
npm install zod

# For React Query integration
npm install @tanstack/react-query react

# For dynamic mocking
npm install @faker-js/faker
```

---

## 🚀 Quick Start

### Basic Usage (No Zod)

```typescript
import { createAxioRes } from 'axio-res';

const api = createAxioRes({
  baseURL: 'https://api.example.com',
});

// ✅ No try/catch — always returns Result<T, E>
const result = await api.get<User[]>('/users');

if (result.ok) {
  // TypeScript knows `result.value` is User[]
  console.log(result.value);
} else {
  // TypeScript knows `result.error` is AxioResError
  console.error(result.error.message);
}
```

### With Zod Validation

```typescript
import { createAxioRes } from 'axio-res';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

const api = createAxioRes({ baseURL: 'https://api.example.com' });

const result = await api.get<User>('/users/1', {
  schema: UserSchema,
});

if (result.ok) {
  // result.value is guaranteed to match UserSchema
  console.log(result.value.name);
} else if ('type' in result.error && result.error.type === 'ZOD_VALIDATION_ERROR') {
  // Zod validation failed — inspect specific issues
  console.log(result.error.issues);
}
```

---

## 🔌 Plugin System

### Mock Plugin (+ Faker.js)

Intercept requests and return mock data — no network calls. Supports static
objects **and** factory functions for dynamic data generation.

```typescript
import { createAxioRes } from 'axio-res';
import { faker } from '@faker-js/faker';

const api = createAxioRes({
  baseURL: 'https://api.example.com',
  plugins: {
    mock: {
      enabled: true,
      delay: 500, // Simulate network latency (ms)
      dataMap: {
        // Static mock
        '/config': { theme: 'dark', version: '2.0' },

        // Dynamic mock — factory function called on every request
        '/users/random': () => ({
          id: faker.number.int({ min: 1, max: 9999 }),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
        }),
      },
    },
  },
});

// Each call returns different data:
const user1 = await api.get('/users/random'); // → "Alice Smith"
const user2 = await api.get('/users/random'); // → "Bob Jones"
```

### StateSync Plugin (+ Zustand)

Automatically push successful response data to an external store:

```typescript
import { createAxioRes } from 'axio-res';
import { useStore } from './store';

const api = createAxioRes({
  baseURL: 'https://api.example.com',
  plugins: {
    stateSync: {
      onSync: (key, data) => {
        // Push to Zustand, Redux, or any store
        useStore.getState().setData(key, data);
      },
    },
  },
});

// After successful fetch, `onSync('users', data)` is called automatically
await api.get('/users', { syncKey: 'users' });
```

---

## ⚛️ React / Next.js Integration

### useAxioResQuery (React Query Bridge)

```tsx
'use client';

import { useAxioResQuery } from 'axio-res';
import { api, UserSchema } from '@/lib/api';

export function UserList() {
  const { data, error, isLoading } = useAxioResQuery<User[]>({
    client: api,
    url: '/users',
    requestOptions: { schema: UsersSchema },
    queryOptions: { staleTime: 30_000 },
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Next.js Server Actions

```typescript
// app/actions.ts
'use server';

import { createAxioRes } from 'axio-res';
import { ProductSchema } from '@/lib/schemas';

const api = createAxioRes({ baseURL: 'https://api.example.com' });

export async function getProduct(id: number) {
  const result = await api.get(`/products/${id}`, {
    schema: ProductSchema,
  });

  if (result.ok) {
    return { data: result.value };
  }

  return { error: 'Failed to fetch product' };
}
```

---

## 🛠️ Result Utilities

```typescript
import { ok, fail, map, flatMap, unwrapOr, match } from 'axio-res';

// map — transform the success value
const doubled = map(result, (users) => users.length * 2);

// flatMap — chain Results
const chained = flatMap(result, (users) =>
  users.length > 0 ? ok(users[0]) : fail(new Error('Empty')),
);

// unwrapOr — get value or fallback
const value = unwrapOr(result, []);

// match — pattern matching
const message = match(result, {
  ok: (users) => `Found ${users.length} users`,
  fail: (error) => `Error: ${error.message}`,
});
```

---

## ⚠️ Limitations

> **axio-res does NOT auto-generate mocks from TypeScript interfaces.**
>
> TypeScript types are erased at runtime — there is no way to programmatically
> read an `interface User { name: string }` and generate mock data from it.
>
> Instead, axio-res provides:
> - **Manual mocks** via the Mock Plugin's `dataMap` (static objects or factory functions).
> - **Runtime validation** via Zod schemas — which _do_ exist at runtime.
>
> For automatic mock generation, consider pairing with
> [Faker.js](https://fakerjs.dev/) factory functions in the `dataMap`.

---

## 📁 Project Structure

```
axio-res/
├── src/
│   ├── types/          # Result<T, E>, config interfaces, error types
│   ├── core/           # createAxioRes — the main factory
│   ├── plugins/        # Mock & StateSync plugin implementations
│   ├── react/          # useAxioResQuery hook
│   └── index.ts        # Main entry point (tree-shakable)
├── playground/         # Next.js interactive demo
├── tsup.config.ts      # Dual ESM/CJS build
├── tsconfig.json       # Strict TypeScript
└── package.json
```

---

## 📄 License

[MIT](./LICENSE)