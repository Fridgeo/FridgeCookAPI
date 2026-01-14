import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCacheDto, UpdateCacheDto } from './cache.dto';

@Injectable()
export class CacheService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.cache_recettes.findMany({
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(id: number) {
        return this.prisma.cache_recettes.findUnique({
            where: { id },
        });
    }

    async findBySearchKey(searchKey: object) {
        return this.prisma.cache_recettes.findFirst({
            where: {
                search_key: {
                    equals: searchKey,
                },
            },
        });
    }

    async create(data: CreateCacheDto) {
        return this.prisma.cache_recettes.create({
            data: {
                search_key: data.search_key,
                recipe_data: data.recipe_data,
            },
        });
    }

    async update(id: number, data: UpdateCacheDto) {
        return this.prisma.cache_recettes.update({
            where: { id },
            data: {
                ...(data.search_key && { search_key: data.search_key }),
                ...(data.recipe_data && { recipe_data: data.recipe_data }),
            },
        });
    }

    async delete(id: number) {
        return this.prisma.cache_recettes.delete({
            where: { id },
        });
    }

    async deleteAll() {
        return this.prisma.cache_recettes.deleteMany();
    }
}
