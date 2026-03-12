import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCacheDto, UpdateCacheDto } from './cache.dto';

type SearchKey = {
    ingredients?: unknown;
    [key: string]: unknown;
};

function debugSearch(...args: unknown[]) {
    if (process.env.DEBUG_SEARCH === 'true') {
        // eslint-disable-next-line no-console
        console.log('[CacheService.findBySearchKey]', ...args);
    }
}

function getRecipeWebhookUrl(): string {
    return process.env.RECIPE_WEBHOOK_URL ?? 'http://fridgeo.smashballoon.lan:5678/webhook/recette';
}

function buildRecipeWebhookUrl(searchKey: object): URL {
    const webhookUrl = new URL(getRecipeWebhookUrl());
    const typedSearchKey = searchKey as SearchKey;

    // Format attendu: ?ingredients=tomate,oignon
    if (Array.isArray(typedSearchKey.ingredients)) {
        const ingredients = typedSearchKey.ingredients
            .filter((ingredient): ingredient is string => typeof ingredient === 'string')
            .map((ingredient) => ingredient.trim())
            .filter((ingredient) => ingredient.length > 0);

        if (ingredients.length > 0) {
            webhookUrl.searchParams.set('ingredients', ingredients.join(','));
            return webhookUrl;
        }
    } else if (typeof typedSearchKey.ingredients === 'string' && typedSearchKey.ingredients.trim().length > 0) {
        webhookUrl.searchParams.set('ingredients', typedSearchKey.ingredients.trim());
        return webhookUrl;
    }

    // Fallback rétro-compatible si le webhook attend un JSON encodé.
    webhookUrl.searchParams.set('ingredients', JSON.stringify(searchKey));
    return webhookUrl;
}

function normalizeSearchKey(searchKey: object): object {
    const typed = searchKey as SearchKey;

    if (!Array.isArray(typed.ingredients)) {
        return searchKey;
    }

    const ingredients = typed.ingredients
        .filter((ingredient): ingredient is string => typeof ingredient === 'string')
        .map((ingredient) => ingredient.trim().toLowerCase())
        .filter((ingredient) => ingredient.length > 0)
        .sort();

    return {
        ...typed,
        ingredients,
    };
}

@Injectable()
export class CacheService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.cache_recettes.findMany({
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(id: number) {
        return this.prisma.cache_recettes.findUnique({
            where: { id },
        });
    }

    async findBySearchKey(searchKey: object) {
        debugSearch('input searchKey =', searchKey);
        const normalizedSearchKey = normalizeSearchKey(searchKey);
        debugSearch('normalized searchKey =', normalizedSearchKey);

        const cache = await this.prisma.cache_recettes.findFirst({
            where: {
                search_key: {
                    equals: normalizedSearchKey,
                },
            },
        });

        debugSearch('db result =', cache ? { id: (cache as any).id } : null);

        if (cache) {
            return cache;
        }

        // Appel webhook optionnel (désactivé par défaut, utile en prod/intégration)
        const webhookEnabled = process.env.ENABLE_RECIPE_WEBHOOK === 'true';
        debugSearch('webhook enabled =', webhookEnabled);
        debugSearch('webhook base url =', getRecipeWebhookUrl());

        const webhookUrl = buildRecipeWebhookUrl(normalizedSearchKey);
        debugSearch('webhook url (computed) =', webhookUrl.toString());
        if (!webhookEnabled) {
            debugSearch('webhook skipped (set ENABLE_RECIPE_WEBHOOK=true to enable)');
        }

        if (webhookEnabled) {
            try {
                const res = await fetch(webhookUrl.toString());
                debugSearch('webhook status =', res.status);

                // Si le webhook ne renvoie pas de JSON, on ne casse pas la réponse.
                const contentType = res.headers.get('content-type') ?? '';
                if (!contentType.includes('application/json')) {
                    debugSearch('webhook content-type =', contentType);
                    return null;
                }

                const json = await res.json();
                debugSearch('webhook response =', json);
                return json;
            } catch (err) {
                console.error('Webhook error:', err);
            }
        }

        return null;
    }

    async create(data: CreateCacheDto) {
        const normalizedSearchKey = normalizeSearchKey(data.search_key as object);
        return this.prisma.cache_recettes.create({
            data: {
                search_key: normalizedSearchKey,
                recipe_data: data.recipe_data,
            },
        });
    }

    async update(id: number, data: UpdateCacheDto) {
        const normalizedSearchKey = data.search_key ? normalizeSearchKey(data.search_key as object) : undefined;
        return this.prisma.cache_recettes.update({
            where: { id },
            data: {
                ...(normalizedSearchKey && { search_key: normalizedSearchKey }),
                ...(data.recipe_data && { recipe_data: data.recipe_data }),
            },
        });
    }

    async delete(id: number) {
        return this.prisma.cache_recettes.delete({
            where: { id },
        });
    }

    async deleteAll() {
        return this.prisma.cache_recettes.deleteMany();
    }
}
