import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [IngredientsController],
    providers: [IngredientsService, PrismaService],
})
export class IngredientsModule { }
