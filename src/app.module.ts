import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RecetteModule } from './recette/recette.module';
@Module({
  imports: [RecetteModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
