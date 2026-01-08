import { ApiProperty } from '@nestjs/swagger';
import type { TranslatableString } from '../../types/translatable';

export class CreateIngredientDto {
    @ApiProperty({
        example: 'tomate',
        description: 'URL slug unique pour l\'ingrédient'
    })
    slug: string;

    @ApiProperty({
        example: { fr: 'Tomate', en: 'Tomato' },
        description: 'Nom de l\'ingrédient'
    })
    name: TranslatableString;

    @ApiProperty({
        example: 'https://example.com/tomato.png',
        description: 'URL de l\'icône',
        required: false
    })
    iconUrl?: string;
}

export class UpdateIngredientDto {
    @ApiProperty({
        example: 'tomate',
        description: 'URL slug',
        required: false
    })
    slug?: string;

    @ApiProperty({
        example: { fr: 'Tomate', en: 'Tomato' },
        description: 'Nom',
        required: false
    })
    name?: TranslatableString;

    @ApiProperty({
        example: 'https://example.com/tomato.png',
        required: false
    })
    iconUrl?: string;
}

export class IngredientResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ example: 'tomate' })
    slug: string;

    @ApiProperty({ example: { fr: 'Tomate', en: 'Tomato' } })
    name: TranslatableString;

    @ApiProperty({ example: 'https://example.com/tomato.png' })
    iconUrl: string | null;

    @ApiProperty({ example: '2026-01-08T10:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-01-08T10:00:00Z' })
    updatedAt: Date;
}
