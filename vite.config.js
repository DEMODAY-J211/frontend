import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import React from 'react';

// https://vite.dev/config/
// export default {
//   server: {
//     proxy: {
//       '/auth': {
//         target: 'http://15.164.218.55:8080',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// };
export default defineConfig({
  plugins: [react()],});

