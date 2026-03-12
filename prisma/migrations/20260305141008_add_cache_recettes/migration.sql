-- CreateTable
CREATE TABLE "cache_recettes" (
    "id" SERIAL PRIMARY KEY,
    "search_key" JSONB NOT NULL,
    "recipe_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "idx_search_key" ON "cache_recettes" USING GIN ("search_key");
