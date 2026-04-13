# axio-res Playground

This directory contains an interactive Next.js application designed to demonstrate the core features of the `axio-res` library.

---

## 🚀 Getting Started

To run the playground locally, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open the playground:**
   Navigate to [http://localhost:3099/playground](http://localhost:3099/playground) in your browser.

---

## 🧪 Demo Cases

The playground includes four distinct cases to showcase the library's versatility:

1. **Standard Fetch (Result Monad):** Demonstrates how the Result Monad handles data and errors without using `try/catch`.
2. **Schema Validation (Zod):** Shows success vs. failure UI when validating response data against a Zod schema.
3. **Dynamic Mocking (Faker.js):** Uses the Mocking Plugin to generate random fake data locally on each click.
4. **Comparison View:** A side-by-side comparison of "Vanilla Axios + Try/Catch" vs. "axio-res + Result Monad".

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS (with a custom dark-glassmorphism theme)
- **Data Fetching:** axio-res (the library), @tanstack/react-query
- **Validation:** Zod
- **Mocking:** Faker.js
