import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        globIgnores: [
          '**/assets/commitinho/hero.png', // Ignore large hero image
          '**/node_modules/**/*'
        ]
      },
      manifest: {
        name: 'Commitinho - Aprenda Programação',
        short_name: 'Commitinho',
        description: 'Plataforma de aprendizado de programação para crianças',
        theme_color: '#3b82f6',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/lovable-uploads/ee82c2e5-f68a-417d-9f9d-0394381c468f.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ],
        categories: ['education', 'games', 'kids'],
        lang: 'pt-BR'
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast'],
          supabase: ['@supabase/supabase-js'],
          games: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
}));
