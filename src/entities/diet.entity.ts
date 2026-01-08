import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import type { TranslatableString } from '../types/translatable';
import { Recipe } from './recipe.entity';

@Entity('diets')
@Index(['slug'], { unique: true })
export class Diet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, length: 255 })
    slug: string;

    @Column({ type: 'jsonb' })
    name: TranslatableString;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @ManyToMany(() => Recipe, (recipe) => recipe.diets)
    recipes: Recipe[];
}
