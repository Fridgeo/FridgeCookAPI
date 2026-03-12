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
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheService } from './cache.service';
import { CreateCacheDto, UpdateCacheDto, SearchCacheDto } from './cache.dto';

@ApiTags('Recipes Cache')
@Controller('recipes')
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
  @Header('Content-Type', 'application/json; charset=utf-8')
  @ApiOperation({ summary: 'Search cache by search_key' })
  @ApiResponse({
    status: 200,
    description: 'The matching cached recipe or null',
  })
  async search(@Body() searchDto: SearchCacheDto) {
    if (!searchDto.search_key) {
      throw new NotFoundException('search_key is required for searching');
    }
    if (process.env.DEBUG_SEARCH === 'true') {
      // eslint-disable-next-line no-console
      console.log('Received search request with search_key:', searchDto.search_key);
    }
    const result = await this.cacheService.findBySearchKey(searchDto.search_key);
    if (process.env.DEBUG_SEARCH === 'true') {
      // eslint-disable-next-line no-console
      console.log('Search result:', result);
    }
    if (result === null) {
      // Nest/Express envoie un body vide quand on retourne null; on renvoie donc le JSON littéral.
      return 'null' as any;
    }
    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Create a cache entry' })
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
