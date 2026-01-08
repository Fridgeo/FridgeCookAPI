import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';

@Entity('recipe_ingredients')
@Index(['recipeId', 'ingredientId'], { unique: true })
export class RecipeIngredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    recipeId: string;

    @Column({ type: 'uuid' })
    ingredientId: string;

    @Column({ type: 'float' })
    quantity: number;

    @Column({ type: 'varchar', length: 50 })
    unit: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'recipeId' })
    recipe: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients, {
        eager: true,
    })
    @JoinColumn({ name: 'ingredientId' })
    ingredient: Ingredient;
}
