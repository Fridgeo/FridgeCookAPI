import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [PrismaService],
})
export class AppModule { }

