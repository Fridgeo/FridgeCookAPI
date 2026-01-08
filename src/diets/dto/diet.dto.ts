import { ApiProperty } from '@nestjs/swagger';
import type { TranslatableString } from '../../types/translatable';

export class CreateDietDto {
    @ApiProperty({
        example: 'vegetarien',
        description: 'URL slug unique pour le régime'
    })
    slug: string;

    @ApiProperty({
        example: { fr: 'Végétarien', en: 'Vegetarian' },
        description: 'Nom du régime'
    })
    name: TranslatableString;
}

export class UpdateDietDto {
    @ApiProperty({
        example: 'vegetarien',
        description: 'URL slug',
        required: false
    })
    slug?: string;

    @ApiProperty({
        example: { fr: 'Végétarien', en: 'Vegetarian' },
        description: 'Nom du régime',
        required: false
    })
    name?: TranslatableString;
}

export class DietResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ example: 'vegetarien' })
    slug: string;

    @ApiProperty({ example: { fr: 'Végétarien', en: 'Vegetarian' } })
    name: TranslatableString;

    @ApiProperty({ example: '2026-01-08T10:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-01-08T10:00:00Z' })
    updatedAt: Date;
}
