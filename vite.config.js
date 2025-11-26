import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    port: 5173,
    proxy: {
      // /api로 시작하는 요청은 백엔드로 전달
      "/api": {
        target: "https://back-tikitta.duckdns.org", // 실제 백엔드 주소
        changeOrigin: true, // CORS 우회
        rewrite: (path) => path.replace(/^\/api/, ""), // /api 제거 후 전달
      },
    },
  },
});
