import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
    let controller: TasksController;
    const mockTasksService = {
        create: jest.fn(dto => {
            return {
                id: Date.now(),
                done: false,
                ...dto,
            }
        }),

        findAll: jest.fn(() => {
            return [
                {
                    id: 1,
                    content: 'to do 1',
                    done: false,
                },
                {
                    id: 2,
                    content: 'to do 2',
                    done: true,
                },
            ];
        }),

        update: jest.fn((id, dto) => {
            if (Object.values(dto).every(property => property === undefined)) {
                throw new BadRequestException();
            }

            return {
                id,
                content: 'original',
                done: false,
                ...dto,
            };
        }),

        remove: jest.fn(id => {
            if (id < 1) {
                throw new NotFoundException();
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [TasksService],
        }).overrideProvider(TasksService).useValue(mockTasksService).compile();

        controller = module.get<TasksController>(TasksController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a task', () => {
        const dto = { content: 'to do' };

        expect(controller.create(dto)).toEqual({
            id: expect.any(Number),
            content: dto.content,
            done: false,
        });

        expect(mockTasksService.create).toHaveBeenCalledWith(dto);
    });

    it('should find all tasks', () => {
        expect(controller.findAll()).toEqual(expect.arrayContaining([{
            id: expect.any(Number),
            content: expect.any(String),
            done: expect.any(Boolean),
        }]));

        expect(mockTasksService.findAll).toHaveBeenCalled();
    });

    it('should update a task', () => {
        const id = 1;
        const dto1 = {
            content: 'updated content',
        }
        const dto2 = {
            done: true,
        }
        const dto3 = {
            content: 'updated content',
            done: true,
        }
        const dto4 = {};

        expect(controller.update(id, dto1)).toEqual({
            id,
            content: dto1.content,
            done: expect.any(Boolean),
        });

        expect(controller.update(id, dto2)).toEqual({
            id,
            content: expect.any(String),
            done: dto2.done,
        });

        expect(controller.update(id, dto3)).toEqual({
            id,
            content: dto3.content,
            done: dto3.done,
        });

        expect(() => controller.update(id, dto4)).toThrowError(BadRequestException);

        expect(mockTasksService.update).toHaveBeenCalledTimes(4);
    });

    it('should delete a task', () => {
        expect(() => controller.remove(1)).not.toThrowError(NotFoundException);

        expect(() => controller.remove(0)).toThrowError(NotFoundException);

        expect(mockTasksService.remove).toHaveBeenCalledTimes(2);
    });
});
