import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { CacheModule } from '../src/cache/cache.module';
import { CacheService } from '../src/cache/cache.service';
import { PrismaService } from '../src/prisma.service';

describe('CacheController (e2e)', () => {
    let app: INestApplication<App>;

    const mockPrismaService = {
        cache_recettes: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        },
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CacheModule],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('/cache (GET)', () => {
        it('should return an array of cache entries', async () => {
            const mockCaches = [
                { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' }, created_at: new Date() },
                { id: 2, search_key: ['oignon'], recipe_data: { title: 'Soupe' }, created_at: new Date() },
            ];
            mockPrismaService.cache_recettes.findMany.mockResolvedValue(mockCaches);

            const response = await request(app.getHttpServer())
                .get('/cache')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should return empty array when no cache entries exist', async () => {
            mockPrismaService.cache_recettes.findMany.mockResolvedValue([]);

            const response = await request(app.getHttpServer())
                .get('/cache')
                .expect(200);

            expect(response.body).toEqual([]);
        });
    });

    describe('/cache/:id (GET)', () => {
        it('should return a cache entry by id', async () => {
            const mockCache = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' }, created_at: new Date() };
            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(mockCache);

            const response = await request(app.getHttpServer())
                .get('/cache/1')
                .expect(200);

            expect(response.body.id).toBe(1);
        });

        it('should return 404 for non-existent id', async () => {
            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(null);

            await request(app.getHttpServer())
                .get('/cache/999')
                .expect(404);
        });

        it('should return 400 for invalid id format', async () => {
            await request(app.getHttpServer())
                .get('/cache/invalid')
                .expect(400);
        });
    });

    describe('/cache (POST)', () => {
        it('should create a new cache entry', async () => {
            const createDto = {
                search_key: { test: true, ingredients: ['test-ingredient'] },
                recipe_data: { title: 'Test Recipe', steps: ['Step 1', 'Step 2'] },
            };
            const mockCreated = { id: 1, ...createDto, created_at: new Date() };
            mockPrismaService.cache_recettes.create.mockResolvedValue(mockCreated);

            const response = await request(app.getHttpServer())
                .post('/cache')
                .send(createDto)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.search_key).toEqual(createDto.search_key);
        });
    });

    describe('/cache/search (POST)', () => {
        it('should find cache by search key', async () => {
            const searchKey = { ingredients: ['tomate'] };
            const mockCache = { id: 1, search_key: searchKey, recipe_data: { title: 'Salade' }, created_at: new Date() };
            mockPrismaService.cache_recettes.findFirst.mockResolvedValue(mockCache);

            const response = await request(app.getHttpServer())
                .post('/cache/search')
                .send({ search_key: searchKey })
                .expect(200);

            expect(response.body.search_key).toEqual(searchKey);
        });

        it('should return null for non-matching search key', async () => {
            mockPrismaService.cache_recettes.findFirst.mockResolvedValue(null);

            const response = await request(app.getHttpServer())
                .post('/cache/search')
                .send({ search_key: { nonexistent: 'key' } })
                .expect(200);

            // NestJS serializes null as empty object in response
            expect(response.body === null || Object.keys(response.body).length === 0).toBe(true);
        });
    });

    describe('/cache/:id (PUT)', () => {
        it('should update a cache entry', async () => {
            const mockCache = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' }, created_at: new Date() };
            const updateDto = { recipe_data: { title: 'Updated Recipe' } };
            const mockUpdated = { ...mockCache, recipe_data: updateDto.recipe_data };

            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(mockCache);
            mockPrismaService.cache_recettes.update.mockResolvedValue(mockUpdated);

            const response = await request(app.getHttpServer())
                .put('/cache/1')
                .send(updateDto)
                .expect(200);

            expect(response.body.recipe_data).toEqual(updateDto.recipe_data);
        });

        it('should return 404 for non-existent id', async () => {
            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(null);

            await request(app.getHttpServer())
                .put('/cache/999')
                .send({ recipe_data: {} })
                .expect(404);
        });
    });

    describe('/cache/:id (DELETE)', () => {
        it('should delete a cache entry', async () => {
            const mockCache = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' }, created_at: new Date() };
            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(mockCache);
            mockPrismaService.cache_recettes.delete.mockResolvedValue(mockCache);

            const response = await request(app.getHttpServer())
                .delete('/cache/1')
                .expect(200);

            expect(response.body.id).toBe(1);
        });

        it('should return 404 for non-existent id', async () => {
            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(null);

            await request(app.getHttpServer())
                .delete('/cache/999')
                .expect(404);
        });
    });

    describe('/cache (DELETE)', () => {
        it('should delete all cache entries', async () => {
            mockPrismaService.cache_recettes.deleteMany.mockResolvedValue({ count: 5 });

            const response = await request(app.getHttpServer())
                .delete('/cache')
                .expect(200);

            expect(response.body.count).toBe(5);
        });
    });
});
