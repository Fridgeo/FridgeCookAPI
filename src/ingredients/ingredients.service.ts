import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';

@Injectable()
export class IngredientsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateIngredientDto) {
        return this.prisma.ingredient.create({
            data: {
                slug: data.slug,
                name: data.name as any,
                iconUrl: data.iconUrl,
            },
        });
    }

    async findAll(skip = 0, take = 10) {
        const [ingredients, total] = await Promise.all([
            this.prisma.ingredient.findMany({
                skip,
                take,
                include: {
                    recipeIngredients: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.ingredient.count(),
        ]);

        return {
            data: ingredients,
            total,
            skip,
            take,
        };
    }

    async findOne(id: string) {
        return this.prisma.ingredient.findUniqueOrThrow({
            where: { id },
            include: {
                recipeIngredients: {
                    include: {
                        recipe: true,
                    },
                },
            },
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.ingredient.findUniqueOrThrow({
            where: { slug },
        });
    }

    async update(id: string, data: UpdateIngredientDto) {
        const updateData: any = {};
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;

        return this.prisma.ingredient.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string) {
        return this.prisma.ingredient.delete({
            where: { id },
        });
    }
}
