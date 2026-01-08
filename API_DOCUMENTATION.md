# FridgeCook API Documentation

## Overview

FridgeCook API est une API REST construite avec NestJS, Prisma et PostgreSQL pour gérer des recettes, ingrédients et régimes alimentaires. L'API utilise une approche "Hybrid" : relationnelle pour les connexions/logique, JSONB pour le contenu multilingue.

**Stack technique :**
- Framework: NestJS 11
- ORM: Prisma
- Database: PostgreSQL
- Authentication: À implémenter
- Versioning: API v1

---

## Base URL

```
http://localhost:3000
```

---

## Architecture des données

### Interfaces TypeScript

#### TranslatableString
```typescript
interface TranslatableString {
  fr: string;
  en: string;
}
```

#### Step
```typescript
interface Step {
  stepNumber: number;
  instruction: TranslatableString;
  imageUrl?: string;
}
```

### Entités de base

- **Recipe** : Recette principale
- **Ingredient** : Ingrédient
- **Diet** : Tags de régime (Vegan, Keto, etc.)
- **RecipeIngredient** : Table pivot (recette ↔ ingrédient)

---

## API Endpoints

### 1. RECIPES

#### 1.1 Créer une recette

**Préalable :** Les ingrédients et régimes doivent d'abord être créés (voir sections 2 et 3).

```http
POST /recipes
Content-Type: application/json

{
  "slug": "pate-carbo",
  "title": {
    "fr": "Pâtes à la Carbonara",
    "en": "Pasta Carbonara"
  },
  "description": {
    "fr": "Recette italienne classique",
    "en": "Classic Italian recipe"
  },
  "steps": [
    {
      "stepNumber": 1,
      "instruction": {
        "fr": "Faire bouillir l'eau",
        "en": "Boil water"
      },
      "imageUrl": "https://example.com/step1.jpg"
    },
    {
      "stepNumber": 2,
      "instruction": {
        "fr": "Cuire les pâtes",
        "en": "Cook pasta"
      }
    }
  ],
  "prepTime": 10,
  "cookingTime": 20,
  "servings": 4,
  "difficulty": 2,
  "ingredientIds": ["550e8400-e29b-41d4-a716-446655440001", "550e8400-e29b-41d4-a716-446655440002"],
  "dietIds": ["550e8400-e29b-41d4-a716-446655440003"]
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "pate-carbo",
  "title": {
    "fr": "Pâtes à la Carbonara",
    "en": "Pasta Carbonara"
  },
  "description": {
    "fr": "Recette italienne classique",
    "en": "Classic Italian recipe"
  },
  "steps": [...],
  "prepTime": 10,
  "cookingTime": 20,
  "servings": 4,
  "difficulty": 2,
  "recipeIngredients": [
    {
      "id": "uuid",
      "recipeId": "...",
      "ingredientId": "...",
      "quantity": 0,
      "unit": "",
      "ingredient": {...}
    }
  ],
  "diets": [...],
  "createdAt": "2026-01-08T12:00:00.000Z",
  "updatedAt": "2026-01-08T12:00:00.000Z"
}
```

---

#### 1.2 Lister toutes les recettes
```http
GET /recipes?skip=0&take=10
```

**Query Parameters:**
- `skip` : Nombre d'éléments à ignorer (défaut: 0)
- `take` : Nombre d'éléments à retourner (défaut: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "...",
      "slug": "pate-carbo",
      "title": {...},
      "description": {...},
      "steps": [...],
      "prepTime": 10,
      "cookingTime": 20,
      "servings": 4,
      "difficulty": 2,
      "recipeIngredients": [...],
      "diets": [...],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 42,
  "skip": 0,
  "take": 10
}
```

---

#### 1.3 Récupérer une recette par ID
```http
GET /recipes/:id
```

**Parameters:**
- `id` : UUID de la recette

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "pate-carbo",
  ...
}
```

**Error (404):**
```json
{
  "statusCode": 404,
  "message": "Recipe not found"
}
```

---

#### 1.4 Récupérer une recette par slug
```http
GET /recipes/slug/:slug
```

**Parameters:**
- `slug` : Slug unique de la recette

**Response (200):** Même que 1.3

---

#### 1.5 Modifier une recette
```http
PUT /recipes/:id
Content-Type: application/json

{
  "title": {
    "fr": "Pâtes Carbonara Revisitée",
    "en": "Revisited Pasta Carbonara"
  },
  "difficulty": 3,
  "prepTime": 15
}
```

**Note:** Tous les champs sont optionnels

**Response (200):** Recette modifiée

---

#### 1.6 Supprimer une recette
```http
DELETE /recipes/:id
```

**Response (204):** Pas de contenu

---

#### 1.7 Ajouter un ingrédient à une recette
```http
POST /recipes/:recipeId/ingredients
Content-Type: application/json

{
  "ingredientId": "550e8400-e29b-41d4-a716-446655440000",
  "quantity": 500,
  "unit": "g"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "recipeId": "...",
  "ingredientId": "...",
  "quantity": 500,
  "unit": "g",
  "ingredient": {
    "id": "...",
    "slug": "tomate",
    "name": {
      "fr": "Tomate",
      "en": "Tomato"
    },
    "iconUrl": "https://..."
  }
}
```

---

#### 1.8 Modifier quantité/unité d'un ingrédient
```http
PUT /recipes/:recipeId/ingredients/:ingredientId
Content-Type: application/json

{
  "quantity": 600,
  "unit": "ml"
}
```

**Response (200):** Ingrédient modifié

---

#### 1.9 Retirer un ingrédient d'une recette
```http
DELETE /recipes/:recipeId/ingredients/:ingredientId
```

**Response (204):** Pas de contenu

---

### 2. INGREDIENTS

#### 2.1 Créer un ingrédient
```http
POST /ingredients
Content-Type: application/json

{
  "slug": "tomate",
  "name": {
    "fr": "Tomate",
    "en": "Tomato"
  },
  "iconUrl": "https://example.com/tomate.png"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "tomate",
  "name": {
    "fr": "Tomate",
    "en": "Tomato"
  },
  "iconUrl": "https://example.com/tomate.png",
  "createdAt": "2026-01-08T12:00:00.000Z",
  "updatedAt": "2026-01-08T12:00:00.000Z"
}
```

---

#### 2.2 Lister tous les ingrédients
```http
GET /ingredients?skip=0&take=10
```

**Query Parameters:**
- `skip` : Nombre d'éléments à ignorer (défaut: 0)
- `take` : Nombre d'éléments à retourner (défaut: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "...",
      "slug": "tomate",
      "name": {...},
      "iconUrl": "...",
      "recipeIngredients": [...]
    }
  ],
  "total": 50,
  "skip": 0,
  "take": 10
}
```

---

#### 2.3 Récupérer un ingrédient par ID
```http
GET /ingredients/:id
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "tomate",
  "name": {...},
  "iconUrl": "...",
  "recipeIngredients": [
    {
      "id": "...",
      "recipeId": "...",
      "ingredientId": "...",
      "quantity": 500,
      "unit": "g",
      "recipe": {...}
    }
  ]
}
```

---

#### 2.4 Récupérer un ingrédient par slug
```http
GET /ingredients/slug/:slug
```

**Response (200):** Même format que 2.3

---

#### 2.5 Modifier un ingrédient
```http
PUT /ingredients/:id
Content-Type: application/json

{
  "name": {
    "fr": "Tomate cerise",
    "en": "Cherry tomato"
  }
}
```

**Response (200):** Ingrédient modifié

---

#### 2.6 Supprimer un ingrédient
```http
DELETE /ingredients/:id
```

**Response (204):** Pas de contenu

---

### 3. DIETS

#### 3.1 Créer un régime/tag
```http
POST /diets
Content-Type: application/json

{
  "slug": "vegan",
  "name": {
    "fr": "Végan",
    "en": "Vegan"
  }
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "vegan",
  "name": {
    "fr": "Végan",
    "en": "Vegan"
  },
  "createdAt": "2026-01-08T12:00:00.000Z",
  "updatedAt": "2026-01-08T12:00:00.000Z"
}
```

---

#### 3.2 Lister tous les régimes
```http
GET /diets?skip=0&take=10
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "...",
      "slug": "vegan",
      "name": {...},
      "recipes": [...]
    }
  ],
  "total": 15,
  "skip": 0,
  "take": 10
}
```

---

#### 3.3 Récupérer un régime par ID
```http
GET /diets/:id
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "vegan",
  "name": {...},
  "recipes": [
    {
      "id": "...",
      "slug": "pate-carbo",
      "title": {...},
      ...
    }
  ]
}
```

---

#### 3.4 Récupérer un régime par slug
```http
GET /diets/slug/:slug
```

**Response (200):** Même format que 3.3

---

#### 3.5 Modifier un régime
```http
PUT /diets/:id
Content-Type: application/json

{
  "name": {
    "fr": "Végan strict",
    "en": "Strict Vegan"
  }
}
```

**Response (200):** Régime modifié

---

#### 3.6 Supprimer un régime
```http
DELETE /diets/:id
```

**Response (204):** Pas de contenu

---

## Types de réponse

### Succès
- `200 OK` : Requête réussie
- `201 Created` : Ressource créée
- `204 No Content` : Succès, pas de contenu

### Erreurs
- `400 Bad Request` : Validation échouée
- `404 Not Found` : Ressource non trouvée
- `500 Internal Server Error` : Erreur serveur

---

## Exemples cURL

### 1. Créer un ingrédient (exemple: Oeufs)
```bash
curl -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "oeufs",
    "name": {"fr": "Oeufs", "en": "Eggs"},
    "iconUrl": "https://example.com/eggs.png"
  }'
# Réponse: {"id": "550e8400-e29b-41d4-a716-446655440001", ...}
```

### 2. Créer un régime/tag (exemple: Classique)
```bash
curl -X POST http://localhost:3000/diets \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "classique",
    "name": {"fr": "Classique", "en": "Classic"}
  }'
# Réponse: {"id": "550e8400-e29b-41d4-a716-446655440003", ...}
```

### 3. Créer une recette (avec les IDs créés ci-dessus)
```bash
curl -X POST http://localhost:3000/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "pate-carbo",
    "title": {"fr": "Pâtes à la Carbonara", "en": "Pasta Carbonara"},
    "description": {"fr": "Recette italienne", "en": "Italian recipe"},
    "steps": [{"stepNumber": 1, "instruction": {"fr": "Cuire les pâtes", "en": "Cook pasta"}}],
    "prepTime": 10,
    "cookingTime": 20,
    "servings": 4,
    "difficulty": 2,
    "ingredientIds": ["550e8400-e29b-41d4-a716-446655440001"],
    "dietIds": ["550e8400-e29b-41d4-a716-446655440003"]
  }'
```

### 4. Récupérer toutes les recettes
```bash
curl http://localhost:3000/recipes?skip=0&take=5
```

### 5. Récupérer une recette par slug
```bash
curl http://localhost:3000/recipes/slug/pate-carbo
```

### 6. Ajouter un ingrédient à une recette existante
```bash
# D'abord créer un nouvel ingrédient (si nécessaire)
INGREDIENT_ID=$(curl -s -X POST http://localhost:3000/ingredients \
  -H "Content-Type: application/json" \
  -d '{"slug": "bacon", "name": {"fr": "Bacon", "en": "Bacon"}}' | jq -r '.id')

# Puis l'ajouter à la recette
curl -X POST http://localhost:3000/recipes/{recipeId}/ingredients \
  -H "Content-Type: application/json" \
  -d "{
    \"ingredientId\": \"$INGREDIENT_ID\",
    \"quantity\": 200,
    \"unit\": \"g\"
  }"
```

---

## Validation des données

### Création de recette (required)
- `slug` : string, unique
- `title` : TranslatableString
- `steps` : Step[]
- `prepTime` : number (minutes)
- `cookingTime` : number (minutes)
- `servings` : number
- `difficulty` : number (1-5 recommandé)

### Création d'ingrédient (required)
- `slug` : string, unique
- `name` : TranslatableString

### Création de régime (required)
- `slug` : string, unique
- `name` : TranslatableString

---

## Gestion des erreurs

L'API retourne une réponse JSON en cas d'erreur :

```json
{
  "statusCode": 400,
  "message": "Slug must be unique",
  "error": "Bad Request"
}
```

---

## Pagination

Pour toutes les listes (`/recipes`, `/ingredients`, `/diets`) :

- `skip` : Nombre de résultats à sauter (défaut: 0)
- `take` : Nombre de résultats à retourner (défaut: 10, max: 100)

Exemple :
```
GET /recipes?skip=20&take=10
```

Retourne les résultats 21-30.

---

## Timestamps

Toutes les entités incluent :
- `createdAt` : Date/heure de création (ISO 8601)
- `updatedAt` : Date/heure de dernière modification (ISO 8601)

---

## Relations

### Recipe → RecipeIngredient
Relation OneToMany avec CASCADE DELETE. Supprimer une recette supprime tous ses ingrédients.

### Recipe ↔ Diet
Relation ManyToMany via table `recipe_diets`.

### RecipeIngredient → Ingredient
Relation ManyToMany avec eager loading.

---

## Base de données

### Schéma Prisma
```prisma
model Recipe {
  id                String            @id @default(uuid()) @db.Uuid
  slug              String            @unique
  title             Json              @db.JsonB
  description       Json?             @db.JsonB
  steps             Json              @db.JsonB
  prepTime          Int
  cookingTime       Int
  servings          Int
  difficulty        Int
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  recipeIngredients RecipeIngredient[]
  diets             Diet[]
}
```

---

## Démarrage du serveur

```bash
# Installation
npm install

# Migration de base de données
npx prisma migrate dev

# Développement
npm run dev

# Production
npm run build
npm run start:prod
```

---

## Améliorations futures

- [ ] Authentification (JWT)
- [ ] Autorisations (RBAC)
- [ ] Validation avec class-validator
- [ ] Tests unitaires
- [ ] Documentations Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Caching
- [ ] Search full-text sur recettes
- [ ] Ratings et commentaires
- [ ] Favoris utilisateur

---

## Support

Pour toute question ou bug, contactez l'équipe de développement.
