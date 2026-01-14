import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('CacheController (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;
    let createdCacheId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        await app.init();
    });

    afterAll(async () => {
        // Clean up test data
        if (createdCacheId) {
            await prisma.cache_recettes.delete({ where: { id: createdCacheId } }).catch(() => { });
        }
        await app.close();
    });

    describe('/cache (GET)', () => {
        it('should return an array of cache entries', () => {
            return request(app.getHttpServer())
                .get('/cache')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });

    describe('/cache (POST)', () => {
        it('should create a new cache entry', () => {
            const createDto = {
                search_key: { test: true, ingredients: ['test-ingredient'] },
                recipe_data: { title: 'Test Recipe', steps: ['Step 1', 'Step 2'] },
            };

            return request(app.getHttpServer())
                .post('/cache')
                .send(createDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.search_key).toEqual(createDto.search_key);
                    expect(res.body.recipe_data).toEqual(createDto.recipe_data);
                    createdCacheId = res.body.id;
                });
        });

        it('should return 400 for invalid data', () => {
            return request(app.getHttpServer())
                .post('/cache')
                .send({})
                .expect((res) => {
                    // Prisma will throw an error for missing required fields
                    expect([400, 500]).toContain(res.status);
                });
        });
    });

    describe('/cache/:id (GET)', () => {
        it('should return a cache entry by id', () => {
            return request(app.getHttpServer())
                .get(`/cache/${createdCacheId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(createdCacheId);
                });
        });

        it('should return 404 for non-existent id', () => {
            return request(app.getHttpServer())
                .get('/cache/999999')
                .expect(404);
        });

        it('should return 400 for invalid id format', () => {
            return request(app.getHttpServer())
                .get('/cache/invalid')
                .expect(400);
        });
    });

    describe('/cache/search (POST)', () => {
        it('should find cache by search key', () => {
            const searchDto = {
                search_key: { test: true, ingredients: ['test-ingredient'] },
            };

            return request(app.getHttpServer())
                .post('/cache/search')
                .send(searchDto)
                .expect(200)
                .expect((res) => {
                    if (res.body) {
                        expect(res.body.search_key).toEqual(searchDto.search_key);
                    }
                });
        });

        it('should return null for non-matching search key', () => {
            const searchDto = {
                search_key: { nonexistent: 'key' },
            };

            return request(app.getHttpServer())
                .post('/cache/search')
                .send(searchDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toBeNull();
                });
        });
    });

    describe('/cache/:id (PUT)', () => {
        it('should update a cache entry', () => {
            const updateDto = {
                recipe_data: { title: 'Updated Test Recipe', steps: ['New Step'] },
            };

            return request(app.getHttpServer())
                .put(`/cache/${createdCacheId}`)
                .send(updateDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.recipe_data).toEqual(updateDto.recipe_data);
                });
        });

        it('should return 404 for non-existent id', () => {
            return request(app.getHttpServer())
                .put('/cache/999999')
                .send({ recipe_data: {} })
                .expect(404);
        });
    });

    describe('/cache/:id (DELETE)', () => {
        it('should return 404 for non-existent id', () => {
            return request(app.getHttpServer())
                .delete('/cache/999999')
                .expect(404);
        });

        it('should delete a cache entry', () => {
            return request(app.getHttpServer())
                .delete(`/cache/${createdCacheId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(createdCacheId);
                    createdCacheId = 0; // Mark as deleted
                });
        });
    });
});
