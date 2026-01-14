import { Test, TestingModule } from '@nestjs/testing';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { NotFoundException } from '@nestjs/common';

describe('CacheController', () => {
    let controller: CacheController;
    let service: CacheService;

    const mockCacheService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findBySearchKey: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteAll: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CacheController],
            providers: [
                {
                    provide: CacheService,
                    useValue: mockCacheService,
                },
            ],
        }).compile();

        controller = module.get<CacheController>(CacheController);
        service = module.get<CacheService>(CacheService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of cache entries', async () => {
            const mockCaches = [
                { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' } },
                { id: 2, search_key: ['oignon'], recipe_data: { title: 'Soupe' } },
            ];
            mockCacheService.findAll.mockResolvedValue(mockCaches);

            const result = await controller.findAll();

            expect(result).toEqual(mockCaches);
            expect(mockCacheService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a cache entry by id', async () => {
            const mockCache = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' } };
            mockCacheService.findOne.mockResolvedValue(mockCache);

            const result = await controller.findOne(1);

            expect(result).toEqual(mockCache);
            expect(mockCacheService.findOne).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when cache not found', async () => {
            mockCacheService.findOne.mockResolvedValue(null);

            await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('search', () => {
        it('should return cache matching search key', async () => {
            const searchDto = { search_key: { ingredients: ['tomate'] } };
            const mockCache = { id: 1, search_key: searchDto.search_key, recipe_data: { title: 'Salade' } };
            mockCacheService.findBySearchKey.mockResolvedValue(mockCache);

            const result = await controller.search(searchDto);

            expect(result).toEqual(mockCache);
            expect(mockCacheService.findBySearchKey).toHaveBeenCalledWith(searchDto.search_key);
        });

        it('should return null when no match found', async () => {
            const searchDto = { search_key: { ingredients: ['inexistant'] } };
            mockCacheService.findBySearchKey.mockResolvedValue(null);

            const result = await controller.search(searchDto);

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new cache entry', async () => {
            const createDto = {
                search_key: { ingredients: ['poulet'] },
                recipe_data: { title: 'Poulet rôti' },
            };
            const mockCreated = { id: 1, ...createDto, created_at: new Date() };
            mockCacheService.create.mockResolvedValue(mockCreated);

            const result = await controller.create(createDto);

            expect(result).toEqual(mockCreated);
            expect(mockCacheService.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('update', () => {
        it('should update a cache entry', async () => {
            const updateDto = { recipe_data: { title: 'Salade updated' } };
            const mockCache = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' } };
            const mockUpdated = { ...mockCache, recipe_data: updateDto.recipe_data };

            mockCacheService.findOne.mockResolvedValue(mockCache);
            mockCacheService.update.mockResolvedValue(mockUpdated);

            const result = await controller.update(1, updateDto);

            expect(result).toEqual(mockUpdated);
            expect(mockCacheService.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('should throw NotFoundException when cache not found', async () => {
            mockCacheService.findOne.mockResolvedValue(null);

            await expect(controller.update(999, { recipe_data: {} })).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete a cache entry', async () => {
            const mockCache = { id: 1, search_key: ['tomate'], recipe_data: { title: 'Salade' } };
            mockCacheService.findOne.mockResolvedValue(mockCache);
            mockCacheService.delete.mockResolvedValue(mockCache);

            const result = await controller.delete(1);

            expect(result).toEqual(mockCache);
            expect(mockCacheService.delete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when cache not found', async () => {
            mockCacheService.findOne.mockResolvedValue(null);

            await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteAll', () => {
        it('should delete all cache entries', async () => {
            const mockResult = { count: 5 };
            mockCacheService.deleteAll.mockResolvedValue(mockResult);

            const result = await controller.deleteAll();

            expect(result).toEqual(mockResult);
            expect(mockCacheService.deleteAll).toHaveBeenCalled();
        });
    });
});
