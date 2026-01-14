import { ApiProperty } from '@nestjs/swagger';

export class CreateCacheDto {
    @ApiProperty({
        description: 'Search key object for identifying the cache entry',
        example: { ingredients: ['tomate', 'oignon'], diet: 'vegetarian' },
    })
    search_key: object;

    @ApiProperty({
        description: 'Recipe data to cache',
        example: { title: 'Salade', steps: ['Laver', 'Couper', 'Servir'] },
    })
    recipe_data: object;
}

export class UpdateCacheDto {
    @ApiProperty({
        description: 'Search key object for identifying the cache entry',
        required: false,
    })
    search_key?: object;

    @ApiProperty({
        description: 'Recipe data to cache',
        required: false,
    })
    recipe_data?: object;
}

export class SearchCacheDto {
    @ApiProperty({
        description: 'Search key object to find matching cache entry',
        example: { ingredients: ['tomate', 'oignon'], diet: 'vegetarian' },
    })
    search_key: object;
}
