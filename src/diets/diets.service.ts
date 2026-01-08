import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDietDto, UpdateDietDto } from './dto/diet.dto';

@Injectable()
export class DietsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateDietDto) {
        return this.prisma.diet.create({
            data: {
                slug: data.slug,
                name: data.name as any,
            },
        });
    }

    async findAll(skip = 0, take = 10) {
        const [diets, total] = await Promise.all([
            this.prisma.diet.findMany({
                skip,
                take,
                include: {
                    recipes: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.diet.count(),
        ]);

        return {
            data: diets,
            total,
            skip,
            take,
        };
    }

    async findOne(id: string) {
        return this.prisma.diet.findUniqueOrThrow({
            where: { id },
            include: {
                recipes: true,
            },
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.diet.findUniqueOrThrow({
            where: { slug },
        });
    }

    async update(id: string, data: UpdateDietDto) {
        const updateData: any = {};
        if (data.slug !== undefined) updateData.slug = data.slug;
        if (data.name !== undefined) updateData.name = data.name;

        return this.prisma.diet.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string) {
        return this.prisma.diet.delete({
            where: { id },
        });
    }
}
