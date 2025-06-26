import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import babel from 'vite-plugin-babel'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig:{
        babelrc:true
      }
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    
  },
});
