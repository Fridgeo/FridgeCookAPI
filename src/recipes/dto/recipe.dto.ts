import { ApiProperty } from '@nestjs/swagger';
import type { TranslatableString, Step } from '../../types/translatable';

export class CreateRecipeDto {
    @ApiProperty({
        example: 'pasta-carbonara',
        description: 'URL slug unique pour la recette'
    })
    slug: string;

    @ApiProperty({
        example: { fr: 'Pâtes à la Carbonara', en: 'Pasta Carbonara' },
        description: 'Titre de la recette'
    })
    title: TranslatableString;

    @ApiProperty({
        example: { fr: 'Une délicieuse recette italienne', en: 'A delicious Italian recipe' },
        description: 'Description optionnelle',
        required: false
    })
    description?: TranslatableString;

    @ApiProperty({
        example: [
            { fr: 'Faire bouillir l\'eau', en: 'Boil water' },
            { fr: 'Cuire les pâtes', en: 'Cook pasta' }
        ],
        description: 'Étapes de préparation'
    })
    steps: Step[];

    @ApiProperty({ example: 10, description: 'Temps de préparation en minutes' })
    prepTime: number;

    @ApiProperty({ example: 20, description: 'Temps de cuisson en minutes' })
    cookingTime: number;

    @ApiProperty({ example: 4, description: 'Nombre de portions' })
    servings: number;

    @ApiProperty({ example: 2, description: 'Niveau de difficulté (1-5)' })
    difficulty: number;

    @ApiProperty({ example: ['550e8400-e29b-41d4-a716-446655440000'], required: false, description: 'IDs des ingrédients' })
    ingredientIds?: string[];

    @ApiProperty({ example: ['550e8400-e29b-41d4-a716-446655440001'], required: false, description: 'IDs des régimes' })
    dietIds?: string[];
}

export class UpdateRecipeDto {
    @ApiProperty({
        example: 'pasta-carbonara',
        description: 'URL slug unique pour la recette',
        required: false
    })
    slug?: string;

    @ApiProperty({
        example: { fr: 'Pâtes à la Carbonara', en: 'Pasta Carbonara' },
        description: 'Titre de la recette',
        required: false
    })
    title?: TranslatableString;

    @ApiProperty({
        example: { fr: 'Une délicieuse recette italienne', en: 'A delicious Italian recipe' },
        description: 'Description',
        required: false
    })
    description?: TranslatableString;

    @ApiProperty({
        example: [{ fr: 'Étape 1', en: 'Step 1' }],
        description: 'Étapes de préparation',
        required: false
    })
    steps?: Step[];

    @ApiProperty({ example: 10, required: false, description: 'Temps de préparation' })
    prepTime?: number;

    @ApiProperty({ example: 20, required: false, description: 'Temps de cuisson' })
    cookingTime?: number;

    @ApiProperty({ example: 4, required: false, description: 'Nombre de portions' })
    servings?: number;

    @ApiProperty({ example: 2, required: false, description: 'Niveau de difficulté' })
    difficulty?: number;

    @ApiProperty({ example: ['550e8400-e29b-41d4-a716-446655440000'], required: false })
    ingredientIds?: string[];

    @ApiProperty({ example: ['550e8400-e29b-41d4-a716-446655440001'], required: false })
    dietIds?: string[];
}

export class RecipeResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ example: 'pasta-carbonara' })
    slug: string;

    @ApiProperty({ example: { fr: 'Pâtes à la Carbonara', en: 'Pasta Carbonara' } })
    title: TranslatableString;

    @ApiProperty({ example: { fr: 'Une recette délicieuse', en: 'A delicious recipe' } })
    description: TranslatableString | null;

    @ApiProperty({ example: [{ fr: 'Étape 1', en: 'Step 1' }] })
    steps: Step[];

    @ApiProperty({ example: 10 })
    prepTime: number;

    @ApiProperty({ example: 20 })
    cookingTime: number;

    @ApiProperty({ example: 4 })
    servings: number;

    @ApiProperty({ example: 2 })
    difficulty: number;

    @ApiProperty({ type: 'array', description: 'Ingrédients de la recette' })
    recipeIngredients: any[];

    @ApiProperty({ type: 'array', description: 'Régimes alimentaires' })
    diets: any[];

    @ApiProperty({ example: '2026-01-08T10:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-01-08T10:00:00Z' })
    updatedAt: Date;
}

export class CreateRecipeIngredientDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID de l\'ingrédient' })
    ingredientId: string;

    @ApiProperty({ example: 500, description: 'Quantité' })
    quantity: number;

    @ApiProperty({ example: 'g', description: 'Unité de mesure' })
    unit: string;
}

export class UpdateRecipeIngredientDto {
    @ApiProperty({ example: 500, required: false })
    quantity?: number;

    @ApiProperty({ example: 'g', required: false })
    unit?: string;
}
