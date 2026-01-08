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
import { DietsService } from './diets.service';
import { CreateDietDto, UpdateDietDto } from './dto/diet.dto';

@Controller('diets')
export class DietsController {
    constructor(private readonly dietsService: DietsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createDietDto: CreateDietDto) {
        return this.dietsService.create(createDietDto);
    }

    @Get()
    async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
        return this.dietsService.findAll(Number(skip), Number(take));
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.dietsService.findBySlug(slug);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.dietsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDietDto: UpdateDietDto) {
        return this.dietsService.update(id, updateDietDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.dietsService.remove(id);
    }
}
