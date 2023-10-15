import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        //target: "http://api.vikingship.xyz/",
        target: "http://172.27.176.1:9901/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    open: true,
    port: 3003,
    host: "127.0.0.1",
  },
});
