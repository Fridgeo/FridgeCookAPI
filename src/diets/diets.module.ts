import { Module } from '@nestjs/common';
import { DietsService } from './diets.service';
import { DietsController } from './diets.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [DietsController],
    providers: [DietsService, PrismaService],
})
export class DietsModule { }
