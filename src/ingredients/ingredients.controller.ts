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
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createIngredientDto: CreateIngredientDto) {
        return this.ingredientsService.create(createIngredientDto);
    }

    @Get()
    async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
        return this.ingredientsService.findAll(Number(skip), Number(take));
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.ingredientsService.findBySlug(slug);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.ingredientsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
        return this.ingredientsService.update(id, updateIngredientDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.ingredientsService.remove(id);
    }
}
