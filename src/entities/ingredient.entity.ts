import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import type { TranslatableString } from '../types/translatable';
import { RecipeIngredient } from './recipe-ingredient.entity';

@Entity('ingredients')
@Index(['slug'], { unique: true })
export class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, length: 255 })
    slug: string;

    @Column({ type: 'jsonb' })
    name: TranslatableString;

    @Column({ type: 'varchar', length: 500, nullable: true })
    iconUrl: string | null;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @OneToMany(
        () => RecipeIngredient,
        (recipeIngredient) => recipeIngredient.ingredient,
    )
    recipeIngredients: RecipeIngredient[];
}
