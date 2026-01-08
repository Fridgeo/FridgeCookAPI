import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // On crée le pool de connexion Node-Postgres avec ton URL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // On l'injecte dans l'adaptateur Prisma 7
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    // Cette ligne est cruciale : elle teste la connexion au démarrage
    try {
      await this.$connect();
    } catch (error) {
      console.error('Échec de la connexion à la base de données:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}