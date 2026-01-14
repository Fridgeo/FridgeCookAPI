import { Module } from '@nestjs/common';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [CacheController],
    providers: [CacheService, PrismaService],
})
export class CacheModule { }
