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
  "dayjs",
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
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20_000,
          groups: [
            {
              name: "react-vendor",
              test: /node_modules[\\/]react(-dom)?([\\/]|$)/,
              priority: 30,
            },
            {
              name: "router-vendor",
              test: /node_modules[\\/]react-router/,
              priority: 25,
            },
            {
              name: "antd-icons-vendor",
              test: /node_modules[\\/]@ant-design[\\/]icons/,
              priority: 22,
            },
            {
              // Keep antd + rc-* + dayjs together. Splitting antd by maxSize
              // breaks production (e.g. "g is not a function" in antd-vendor).
              name: "antd-vendor",
              test: /node_modules[\\/](antd|@ant-design|@rc-component|rc-|dayjs)/,
              priority: 20,
            },
            {
              name: "charts-vendor",
              test: /node_modules[\\/](recharts|d3-|victory-vendor|internmap|delaunator|robust-predicates)/,
              priority: 18,
              maxSize: 200_000,
            },
            {
              name: "query-vendor",
              test: /node_modules[\\/]@tanstack/,
              priority: 15,
            },
            {
              name: "vendor",
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
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
