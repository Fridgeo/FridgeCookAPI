# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FridgeCook API is a NestJS-based REST API for recipe caching and management. The API integrates with an n8n webhook system for recipe generation and uses PostgreSQL with Prisma ORM for data persistence. The API is primarily in French.

## Development Commands

### Setup
```bash
npm install                    # Install dependencies
```

### Running the Application
```bash
npm run dev                   # Development mode with watch
npm run start                 # Standard start
npm run start:debug          # Debug mode with watch
npm run start:prod           # Production mode (requires build)
```

The API runs on port 3001 by default (configurable via `PORT` env variable). Two documentation UIs are available:
- Swagger UI: http://localhost:3001/api
- Scalar API Reference: http://localhost:3001/reference

### Building
```bash
npm run build                 # Build the project
```

### Testing
```bash
npm run test                  # Run unit tests
npm run test:watch           # Run tests in watch mode
npm run test:cov             # Run tests with coverage
npm run test:e2e             # Run end-to-end tests
npm run test:debug           # Debug tests
```

To run a specific test file:
```bash
npm run test -- cache.service.spec.ts         # Run specific test file
npm run test:e2e -- <file-path>               # For e2e tests
```

### Code Quality
```bash
npm run lint                  # Lint and auto-fix TypeScript files
npm run format               # Format code with Prettier
```

### Database Management
```bash
npx prisma migrate deploy     # Apply migrations to database
npx prisma db pull            # Introspect database and update schema
npx prisma generate           # Regenerate Prisma client
npx prisma studio            # Open Prisma Studio GUI (via studio.bash)
```

### Production Deployment
```bash
npm run build                # Build the application
pm2 start ecosystem.config.js  # Start with PM2
pm2 restart FridgeCookAPI    # Restart the service
pm2 logs FridgeCookAPI       # View logs
```

## Architecture

### Database Layer

**Prisma Setup**: The project uses Prisma 7 with a custom PostgreSQL adapter configuration:
- Prisma client is generated to `generated/prisma/client` (not the default location)
- Uses `@prisma/adapter-pg` with a node-postgres pool for connection management
- PrismaService (src/prisma.service.ts) extends PrismaClient and handles connection lifecycle
- Database connection is validated at module initialization

**Current Database Configuration**:
- Unified PostgreSQL instance at `localhost:5432`
- Database: `bdd-FridgeCook`
- User: `prisma` / Password: `sauvage`
- Connection managed via `DATABASE_URL` environment variable

**Schema Location**: prisma/schema.prisma

**Primary Data Model**: The application uses `cache_recettes` table as the main data store (5600+ recipes):
- `id`: Auto-incrementing integer primary key
- `search_key`: JSONB field with GIN index for fast ingredient-based lookups
- `recipe_data`: JSONB field storing complete recipe information (steps, title, description, etc.)
- `created_at`: Timestamp with default now()

**Additional Tables**: The schema also includes relational tables for future use:
- `recipes`, `ingredients`, `diets`, `recipe_ingredients` - Currently empty, designed for normalized recipe storage
- These tables use UUID primary keys and support multilingual content via JSONB fields

### Application Structure

**Module Organization**: NestJS modular architecture:
- `*.module.ts` - Module definition, dependency injection configuration
- `*.controller.ts` - HTTP endpoint handlers with Swagger decorators
- `*.service.ts` - Business logic and database operations
- `*.dto.ts` - Request/response validation schemas
- `*.spec.ts` - Unit tests using Jest

**Root Module**: AppModule (src/app.module.ts) imports feature modules and registers PrismaService globally.

**Cache Module**: The core feature module (src/cache/):
- **CacheController**: Exposes REST endpoints under `/recipes` prefix
- **CacheService**: Implements recipe search, caching, and webhook integration
- **Search Key Normalization**: Ingredients are lowercased, sorted, and deduplicated before caching
- **Webhook Integration**: Optional n8n webhook for recipe generation when cache misses occur

### Recipe Webhook System

The application can trigger an n8n workflow for recipe generation:

**Configuration** (via environment variables):
- `ENABLE_RECIPE_WEBHOOK=true` - Enable/disable webhook calls
- `RECIPE_WEBHOOK_URL` - n8n webhook endpoint (default: http://fridgeo.smashballoon.lan:5678/webhook/recette)
- `DEBUG_SEARCH=true` - Enable detailed search logging

**Behavior**:
- When `findBySearchKey()` doesn't find a cached recipe, it can call the webhook
- The webhook receives ingredients as query parameters (e.g., `?ingredients=tomate,oignon`)
- Search keys are normalized (trimmed, lowercased, sorted) before lookup and caching
- Responses are NOT automatically cached; they're returned directly to the client

### API Documentation

Dual documentation system configured in main.ts:
- **Swagger UI**: Standard OpenAPI interface at `/api`
- **Scalar API Reference**: Modern API docs at `/reference`
- Controllers use `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` decorators
- DTOs use `@ApiProperty()` for schema documentation

### Testing Patterns

**Unit Tests**: Co-located with source files
- Mock PrismaService using Jest
- Follow the pattern in cache.service.spec.ts for mocking database calls
- Test configuration in package.json sets `rootDir: "src"`

**E2E Tests**: Located in test/ directory
- Use supertest for HTTP assertions
- Separate Jest config: test/jest-e2e.json

## Important Patterns

### Prisma Client Usage

Always import from the generated location:
```typescript
import { PrismaClient } from '../generated/prisma/client';
```

Inject PrismaService via dependency injection:
```typescript
constructor(private prisma: PrismaService) {}
```

### JSON Field Queries

The `cache_recettes` table uses JSONB fields with GIN indexing:
```typescript
// Exact match on search_key
await this.prisma.cache_recettes.findFirst({
  where: {
    search_key: {
      equals: normalizedSearchKey,
    },
  },
});
```

### Search Key Normalization

Always normalize search keys before querying or storing:
```typescript
// Example from cache.service.ts
const ingredients = searchKey.ingredients
  .map(i => i.trim().toLowerCase())
  .filter(i => i.length > 0)
  .sort();
```

### Module Registration

When adding new features:
1. Create a feature module with controller and service
2. Register PrismaService in the module's providers array
3. Import the feature module in AppModule
4. Use dependency injection to access PrismaService

### Environment Variables

Required variables:
- `DATABASE_URL` - PostgreSQL connection string (validated at startup)
- `PORT` - Application port (defaults to 3001 in production)
- `NODE_ENV` - Environment mode (development/production)

Optional webhook variables:
- `ENABLE_RECIPE_WEBHOOK` - Enable n8n webhook integration (true/false)
- `RECIPE_WEBHOOK_URL` - n8n webhook endpoint
- `DEBUG_SEARCH` - Enable search debug logging (true/false)

Load environment variables using `import 'dotenv/config'` at entry points.
