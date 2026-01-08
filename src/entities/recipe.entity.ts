import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import type { TranslatableString, Step } from '../types/translatable';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Diet } from './diet.entity';

@Entity('recipes')
@Index(['slug'], { unique: true })
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, length: 255 })
    slug: string;

    @Column({ type: 'jsonb' })
    title: TranslatableString;

    @Column({ type: 'jsonb', nullable: true })
    description: TranslatableString | null;

    @Column({ type: 'jsonb' })
    steps: Step[];

    @Column({ type: 'int' })
    prepTime: number;

    @Column({ type: 'int' })
    cookingTime: number;

    @Column({ type: 'int' })
    servings: number;

    @Column({ type: 'int' })
    difficulty: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @OneToMany(
        () => RecipeIngredient,
        (recipeIngredient) => recipeIngredient.recipe,
        { cascade: true, eager: true },
    )
    recipeIngredients: RecipeIngredient[];

    @ManyToMany(() => Diet, (diet) => diet.recipes, { eager: true })
    @JoinTable({
        name: 'recipe_diets',
        joinColumn: { name: 'recipeId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'dietId', referencedColumnName: 'id' },
    })
    diets: Diet[];
}
