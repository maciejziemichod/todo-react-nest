import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
    let service: TasksService;
    const mockTasksRepository = {
        provide: getRepositoryToken(Task),
        useValue: {
            create: jest.fn(dto => dto),
            save: jest.fn(task => Promise.resolve({ id: Date.now(), done: false, ...task })),
            find: jest.fn(() => Promise.resolve([{ id: Date.now(), content: 'to do', done: false }])),
            update: jest.fn((criteria, _) => Promise.resolve({ affected: criteria.id < 1 ? 0 : 1 })),
            findOneBy: jest.fn(criteria => Promise.resolve(criteria.id < 1 ? null : { id: Date.now(), content: 'to do', done: false })),
            delete: jest.fn(id => Promise.resolve({ affected: id < 1 ? 0 : 1 })),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                mockTasksRepository,
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new task and return it', async () => {
        const dto = { content: 'todo' };

        expect(await service.create(dto)).toEqual({
            id: expect.any(Number),
            content: dto.content,
            done: false,
        });

        expect(mockTasksRepository.useValue.create).toBeCalledWith(dto);
    });

    it('should find all tasks', async () => {
        expect(await service.findAll()).toEqual(expect.arrayContaining([{
            id: expect.any(Number),
            content: expect.any(String),
            done: expect.any(Boolean),
        }]));

        expect(mockTasksRepository.useValue.find).toHaveBeenCalled();
    });

    it('should update a task and return it', async () => {
        expect(await service.update(1, { content: 'updated', done: true })).toEqual({
            id: expect.any(Number),
            content: expect.any(String),
            done: expect.any(Boolean),
        });

        expect(await service.update(1, { content: 'updated' })).toEqual({
            id: expect.any(Number),
            content: expect.any(String),
            done: expect.any(Boolean),
        });

        expect(await service.update(1, { done: true })).toEqual({
            id: expect.any(Number),
            content: expect.any(String),
            done: expect.any(Boolean),
        });

        const notFound = async () => {
            await service.update(0, { done: true });
        }
        expect(notFound).rejects.toThrowError(NotFoundException);

        const badRequest = async () => {
            await service.update(1, {});
        }
        expect(badRequest).rejects.toThrowError(BadRequestException);

        expect(mockTasksRepository.useValue.update).toHaveBeenCalled();

        expect(mockTasksRepository.useValue.findOneBy).toHaveBeenCalled();
    });

    it('should remove a task', async () => {
        expect(() => service.remove(1)).not.toThrowError(NotFoundException);

        expect(() => service.remove(0)).rejects.toThrowError(NotFoundException);

        expect(mockTasksRepository.useValue.delete).toHaveBeenCalledTimes(2);
    });
});
