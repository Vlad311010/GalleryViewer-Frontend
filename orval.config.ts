import { defineConfig } from 'orval';

export default defineConfig({
  gallery_viewer: {
    output: {
      mode: 'tags-split',
      target: './src/contract/',
      schemas: './src/contract/model',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: {
        runtime: 'import.meta.env.VITE_API_URL',
      },
      mock: false
    },  
    input: {
      target: 'https://localhost:7043/swagger/v1/swagger.json',
    },
  },
});