import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    NotFoundException,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheService } from './cache.service';
import { CreateCacheDto, UpdateCacheDto, SearchCacheDto } from './cache.dto';

@ApiTags('Cache Recettes')
@Controller('cache')
export class CacheController {
    constructor(private readonly cacheService: CacheService) { }

    @Get()
    @ApiOperation({ summary: 'Get all cached recipes' })
    @ApiResponse({ status: 200, description: 'List of all cached recipes' })
    async findAll() {
        return this.cacheService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a cached recipe by ID' })
    @ApiResponse({ status: 200, description: 'The cached recipe' })
    @ApiResponse({ status: 404, description: 'Cache entry not found' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const cache = await this.cacheService.findOne(id);
        if (!cache) {
            throw new NotFoundException(`Cache entry with ID ${id} not found`);
        }
        return cache;
    }

    @Post('search')
    @HttpCode(200)
    @ApiOperation({ summary: 'Search cache by search_key' })
    @ApiResponse({ status: 200, description: 'The matching cached recipe or null' })
    async search(@Body() searchDto: SearchCacheDto) {
        return this.cacheService.findBySearchKey(searchDto.search_key);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new cache entry' })
    @ApiResponse({ status: 201, description: 'Cache entry created' })
    async create(@Body() createDto: CreateCacheDto) {
        return this.cacheService.create(createDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a cache entry' })
    @ApiResponse({ status: 200, description: 'Cache entry updated' })
    @ApiResponse({ status: 404, description: 'Cache entry not found' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateCacheDto,
    ) {
        const cache = await this.cacheService.findOne(id);
        if (!cache) {
            throw new NotFoundException(`Cache entry with ID ${id} not found`);
        }
        return this.cacheService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a cache entry' })
    @ApiResponse({ status: 200, description: 'Cache entry deleted' })
    @ApiResponse({ status: 404, description: 'Cache entry not found' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        const cache = await this.cacheService.findOne(id);
        if (!cache) {
            throw new NotFoundException(`Cache entry with ID ${id} not found`);
        }
        return this.cacheService.delete(id);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete all cache entries' })
    @ApiResponse({ status: 200, description: 'All cache entries deleted' })
    async deleteAll() {
        return this.cacheService.deleteAll();
    }
}
