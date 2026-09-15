# GalleryViewer Frontend

A React-based frontend for browsing, organizing, and managing image and video collections through the GalleryViewer REST API.

The application provides a responsive media gallery with asset browsing, tagging, group management, and dedicated image and video viewing experiences.

## Features

- Gallery and media asset browsing
- Image and video previews
- Dedicated image and video viewers
- Image tagging — create tags, assign tags to assets, and search by tags
- Gallery and asset group management

## Technologies

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **TanStack Query** — server state and caching
- **Orval** — generated API client and TanStack Query hooks
- **CSS**

## API Integration

The frontend communicates with the GalleryViewer backend through its REST API.

The backend exposes an **OpenAPI contract**, which is used by **Orval** to generate a strongly typed API client and TanStack Query hooks.

Generated API code is committed to the repository and only needs to be regenerated when the API contract changes.

## Architecture

The frontend is organized around reusable React components, with component-specific logic and styling kept together where practical.

Server state and API communication are handled through **TanStack Query** and the generated **Orval** client.

The project uses a component-oriented structure with shared components and feature-specific component folders.

## Getting Started

### Prerequisites

- Node.js
- npm 10.9.7

### Installation

```bash
git clone https://github.com/Vlad311010/GalleryViewer-Frontend.git
cd <project-directory>
npm install
```

### Development Configuration

For local development, configure `env.development`:

```env
VITE_API_URL=<backend_api_url>
```

`VITE_API_URL` specifies the API used by the application.

### Development

```bash
npm run dev
```

The development server will be available at:

```text
http://localhost:5173/
```

## API Client Generation

API client and TanStack Query hooks are generated from the backend OpenAPI contract using Orval.

```bash
npm run generate-api
```

The OpenAPI source is configured through `OPENAPI_SOURCE`.

API generation is only required when the backend API contract changes.

## Production Build

The frontend is published into the backend application's `wwwroot` directory:

```bash
npm run publish -- -Target "<path-to-backend>/wwwroot"

The -Target parameter specifies the directory where the built frontend is published.
```

The published frontend is served by the GalleryViewer backend.

Since the frontend and API share the same origin in production, `VITE_API_URL` does not need to be configured:

```env
VITE_API_URL=
```

## Project Structure

The project follows a component-oriented structure, with related component logic and styling kept together.

Orval generates the API client and TanStack Query hooks in `src/client`.

## Backend

Backend repository:s

**https://github.com/Vlad311010/GalleryViewer**

See the backend README for API setup, database configuration, media synchronization, and deployment instructions.