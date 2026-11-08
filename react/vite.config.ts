import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const BACKEND = 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Chaves que começam com "^" viram RegExp e são testadas contra a URL
      // (path + query). Uma chave simples como '/topico' casaria por PREFIXO
      // e também mandaria '/topicos' (rota do front) para o Spring.
      // Por isso o padrão exige que o recurso termine ali, ou em '?' ou '/'.
      '^/(materia|topico|ranking)([/?].*)?$': BACKEND,
      '^/test/': BACKEND,
    },
  },
})
