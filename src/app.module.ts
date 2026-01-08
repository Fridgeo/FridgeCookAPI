import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { DietsModule } from './diets/diets.module';

@Module({
  imports: [RecipesModule, IngredientsModule, DietsModule],
  providers: [PrismaService],
})
export class AppModule { }
