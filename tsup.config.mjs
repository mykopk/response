import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'builders/response.builder': 'src/builders/response.builder.ts',
    'filters/index': 'src/filters/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: ['es2022', 'node22'],
  platform: 'node',
  external: ['@nestjs/common', '@nestjs/core', '@myko.pk/logger', 'express', 'rxjs', 'rxjs/operators'],
  splitting: false,
  minify: false,
  treeshake: true,
  keepNames: true,
});
