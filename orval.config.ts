import { defineConfig } from 'orval';

export default defineConfig({
  gallery_viewer: {
    output: {
      mode: 'tags-split',
      target: './src/contract/',
      schemas: './src/contract/model',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: 'https://localhost:7043',
      mock: false
    },  
    input: {
      target: 'https://localhost:7043/openapi/v1.json',
    },
  },
});