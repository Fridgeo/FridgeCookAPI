import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
    CreateRecipeDto,
    UpdateRecipeDto,
    CreateRecipeIngredientDto,
    UpdateRecipeIngredientDto,
} from './dto/recipe.dto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) { }

    private validateUUID(id: string, fieldName: string): void {
        if (!UUID_REGEX.test(id)) {
            throw new BadRequestException(`Invalid ${fieldName}: "${id}" is not a valid UUID`);
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createRecipeDto: CreateRecipeDto) {
        return this.recipesService.create(createRecipeDto);
    }

    @Get()
    async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
        return this.recipesService.findAll(Number(skip), Number(take));
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.recipesService.findBySlug(slug);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        this.validateUUID(id, 'recipe ID');
        return this.recipesService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
        return this.recipesService.update(id, updateRecipeDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.recipesService.remove(id);
    }

    @Post(':recipeId/ingredients')
    @HttpCode(HttpStatus.CREATED)
    async addIngredient(
        @Param('recipeId') recipeId: string,
        @Body() data: CreateRecipeIngredientDto,
    ) {
        return this.recipesService.addIngredient(
            recipeId,
            data.ingredientId,
            data.quantity,
            data.unit,
        );
    }

    @Put(':recipeId/ingredients/:ingredientId')
    async updateIngredient(
        @Param('recipeId') recipeId: string,
        @Param('ingredientId') ingredientId: string,
        @Body() data: UpdateRecipeIngredientDto,
    ) {
        return this.recipesService.updateIngredient(
            recipeId,
            ingredientId,
            data.quantity || 0,
            data.unit || '',
        );
    }

    @Delete(':recipeId/ingredients/:ingredientId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeIngredient(
        @Param('recipeId') recipeId: string,
        @Param('ingredientId') ingredientId: string,
    ) {
        return this.recipesService.removeIngredient(recipeId, ingredientId);
    }
}
