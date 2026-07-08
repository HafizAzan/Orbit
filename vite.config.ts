import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const optimizeDepsInclude = [
  "react",
  "react-dom",
  "react-router-dom",
  "@tanstack/react-query",
  "antd",
  "@ant-design/icons",
  "axios",
  "clsx",
  "tailwind-merge",
  "socket.io-client",
  "recharts",
  "swiper",
  "swiper/react",
  "swiper/modules",
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: optimizeDepsInclude,
  },
  server: {
    port: 3000,
    open: true,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
});
