import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { PrismaService } from '../prisma.service';

describe('CacheService', () => {
    let service: CacheService;
    let prisma: PrismaService;

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
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CacheService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<CacheService>(CacheService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of cache entries', async () => {
            const mockCaches = [
                { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' }, created_at: new Date() },
                { id: 2, search_key: ['oignon'], recipe_data: { title: 'Soupe' }, created_at: new Date() },
            ];
            mockPrismaService.cache_recettes.findMany.mockResolvedValue(mockCaches);

            const result = await service.findAll();

            expect(result).toEqual(mockCaches);
            expect(mockPrismaService.cache_recettes.findMany).toHaveBeenCalledWith({
                orderBy: { created_at: 'desc' },
            });
        });

        it('should return empty array when no caches exist', async () => {
            mockPrismaService.cache_recettes.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a cache entry by id', async () => {
            const mockCache = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' }, created_at: new Date() };
            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(mockCache);

            const result = await service.findOne(1);

            expect(result).toEqual(mockCache);
            expect(mockPrismaService.cache_recettes.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should return null when cache not found', async () => {
            mockPrismaService.cache_recettes.findUnique.mockResolvedValue(null);

            const result = await service.findOne(999);

            expect(result).toBeNull();
        });
    });

    describe('findBySearchKey', () => {
        it('should return a cache entry matching search key', async () => {
            const searchKey = { ingredients: ['tomate', 'oignon'] };
            const mockCache = { id: 1, search_key: searchKey, recipe_data: { title: 'Ratatouille' }, created_at: new Date() };
            mockPrismaService.cache_recettes.findFirst.mockResolvedValue(mockCache);

            const result = await service.findBySearchKey(searchKey);

            expect(result).toEqual(mockCache);
            expect(mockPrismaService.cache_recettes.findFirst).toHaveBeenCalledWith({
                where: {
                    search_key: {
                        equals: searchKey,
                    },
                },
            });
        });

        it('should return null when no matching cache found', async () => {
            mockPrismaService.cache_recettes.findFirst.mockResolvedValue(null);

            const result = await service.findBySearchKey({ ingredients: ['inexistant'] });

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new cache entry', async () => {
            const createDto = {
                search_key: { ingredients: ['poulet', 'riz'] },
                recipe_data: { title: 'Poulet au riz', steps: ['Cuire le riz', 'Griller le poulet'] },
            };
            const mockCreated = { id: 1, ...createDto, created_at: new Date() };
            mockPrismaService.cache_recettes.create.mockResolvedValue(mockCreated);

            const result = await service.create(createDto);

            expect(result).toEqual(mockCreated);
            expect(mockPrismaService.cache_recettes.create).toHaveBeenCalledWith({
                data: {
                    search_key: createDto.search_key,
                    recipe_data: createDto.recipe_data,
                },
            });
        });
    });

    describe('update', () => {
        it('should update a cache entry', async () => {
            const updateDto = { recipe_data: { title: 'Salade updated' } };
            const mockUpdated = { id: 1, search_key: ['tomate'], recipe_data: updateDto.recipe_data, created_at: new Date() };
            mockPrismaService.cache_recettes.update.mockResolvedValue(mockUpdated);

            const result = await service.update(1, updateDto);

            expect(result).toEqual(mockUpdated);
            expect(mockPrismaService.cache_recettes.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { recipe_data: updateDto.recipe_data },
            });
        });

        it('should update only provided fields', async () => {
            const updateDto = { search_key: { ingredients: ['nouveau'] } };
            mockPrismaService.cache_recettes.update.mockResolvedValue({ id: 1, ...updateDto });

            await service.update(1, updateDto);

            expect(mockPrismaService.cache_recettes.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { search_key: updateDto.search_key },
            });
        });
    });

    describe('delete', () => {
        it('should delete a cache entry', async () => {
            const mockDeleted = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' }, created_at: new Date() };
            mockPrismaService.cache_recettes.delete.mockResolvedValue(mockDeleted);

            const result = await service.delete(1);

            expect(result).toEqual(mockDeleted);
            expect(mockPrismaService.cache_recettes.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });

    describe('deleteAll', () => {
        it('should delete all cache entries', async () => {
            const mockResult = { count: 5 };
            mockPrismaService.cache_recettes.deleteMany.mockResolvedValue(mockResult);

            const result = await service.deleteAll();

            expect(result).toEqual(mockResult);
            expect(mockPrismaService.cache_recettes.deleteMany).toHaveBeenCalled();
        });
    });
});
