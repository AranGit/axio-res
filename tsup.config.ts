import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  sourcemap: true,
  external: ['axios', 'react', 'zod', '@tanstack/react-query'],
  outDir: 'dist',
});
