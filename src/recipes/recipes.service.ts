import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class RecipesService {
    constructor(private prisma: PrismaService) { }

    private validateUUID(id: string, fieldName: string): void {
        if (!UUID_REGEX.test(id)) {
            throw new BadRequestException(`Invalid ${fieldName}: "${id}" is not a valid UUID`);
        }
    }

    async create(data: CreateRecipeDto) {
        const { ingredientIds, dietIds, ...recipeData } = data;

        // Validate ingredient IDs
        if (ingredientIds && ingredientIds.length > 0) {
            ingredientIds.forEach((id) => this.validateUUID(id, 'ingredientId'));
            // Check if all ingredients exist
            const ingredients = await this.prisma.ingredient.findMany({
                where: { id: { in: ingredientIds } },
            });
            if (ingredients.length !== ingredientIds.length) {
                throw new BadRequestException('One or more ingredients do not exist');
            }
        }

        // Validate diet IDs
        if (dietIds && dietIds.length > 0) {
            dietIds.forEach((id) => this.validateUUID(id, 'dietId'));
            // Check if all diets exist
            const diets = await this.prisma.diet.findMany({
                where: { id: { in: dietIds } },
            });
            if (diets.length !== dietIds.length) {
                throw new BadRequestException('One or more diets do not exist');
            }
        }

        const recipe = await this.prisma.recipe.create({
            data: {
                slug: recipeData.slug,
                title: recipeData.title as any,
                description: recipeData.description as any,
                steps: recipeData.steps as any,
                prepTime: recipeData.prepTime,
                cookingTime: recipeData.cookingTime,
                servings: recipeData.servings,
                difficulty: recipeData.difficulty,
                recipeIngredients: ingredientIds
                    ? {
                        create: ingredientIds.map((ingredientId) => ({
                            ingredientId,
                            quantity: 0,
                            unit: '',
                        })),
                    }
                    : undefined,
                diets: dietIds
                    ? {
                        connect: dietIds.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                recipeIngredients: {
                    include: {
                        ingredient: true,
                    },
                },
                diets: true,
            },
        });

        return recipe;
    }

    async findAll(skip = 0, take = 10) {
        const [recipes, total] = await Promise.all([
            this.prisma.recipe.findMany({
                skip,
                take,
                include: {
                    recipeIngredients: {
                        include: {
                            ingredient: true,
                        },
                    },
                    diets: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.recipe.count(),
        ]);

        return {
            data: recipes,
            total,
            skip,
            take,
        };
    }

    async findOne(id: string) {
        return this.prisma.recipe.findUniqueOrThrow({
            where: { id },
            include: {
                recipeIngredients: {
                    include: {
                        ingredient: true,
                    },
                },
                diets: true,
            },
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.recipe.findUniqueOrThrow({
            where: { slug },
            include: {
                recipeIngredients: {
                    include: {
                        ingredient: true,
                    },
                },
                diets: true,
            },
        });
    }

    async update(id: string, data: UpdateRecipeDto) {
        const { ingredientIds, dietIds, ...recipeData } = data;

        const updateData: any = {};
        if (recipeData.slug !== undefined) updateData.slug = recipeData.slug;
        if (recipeData.title !== undefined) updateData.title = recipeData.title;
        if (recipeData.description !== undefined) updateData.description = recipeData.description;
        if (recipeData.steps !== undefined) updateData.steps = recipeData.steps;
        if (recipeData.prepTime !== undefined) updateData.prepTime = recipeData.prepTime;
        if (recipeData.cookingTime !== undefined) updateData.cookingTime = recipeData.cookingTime;
        if (recipeData.servings !== undefined) updateData.servings = recipeData.servings;
        if (recipeData.difficulty !== undefined) updateData.difficulty = recipeData.difficulty;
        if (dietIds !== undefined) {
            updateData.diets = dietIds
                ? {
                    set: dietIds.map((id) => ({ id })),
                }
                : undefined;
        }

        const recipe = await this.prisma.recipe.update({
            where: { id },
            data: updateData,
            include: {
                recipeIngredients: {
                    include: {
                        ingredient: true,
                    },
                },
                diets: true,
            },
        });

        return recipe;
    }

    async remove(id: string) {
        return this.prisma.recipe.delete({
            where: { id },
        });
    }

    async addIngredient(recipeId: string, ingredientId: string, quantity: number, unit: string) {
        return this.prisma.recipeIngredient.create({
            data: {
                recipeId,
                ingredientId,
                quantity,
                unit,
            },
            include: {
                ingredient: true,
            },
        });
    }

    async removeIngredient(recipeId: string, ingredientId: string) {
        return this.prisma.recipeIngredient.delete({
            where: {
                recipeId_ingredientId: {
                    recipeId,
                    ingredientId,
                },
            },
        });
    }

    async updateIngredient(
        recipeId: string,
        ingredientId: string,
        quantity: number,
        unit: string,
    ) {
        return this.prisma.recipeIngredient.update({
            where: {
                recipeId_ingredientId: {
                    recipeId,
                    ingredientId,
                },
            },
            data: {
                quantity,
                unit,
            },
            include: {
                ingredient: true,
            },
        });
    }
}
