import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private tasksRepository: Repository<Task>) { }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.tasksRepository.create(createTaskDto);

        return this.tasksRepository.save(task);
    }

    findAll(): Promise<Task[]> {
        return this.tasksRepository.find();
    }

    async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        if (Object.values(updateTaskDto).every(property => property === undefined)) {
            throw new BadRequestException('at least one property must be provided');
        }

        const { affected } = await this.tasksRepository.update({ id }, updateTaskDto);

        if (!affected) {
            throw new NotFoundException();
        }

        return this.tasksRepository.findOneBy({ id }) as Promise<Task>;
    }

    async remove(id: number): Promise<void> {
        const { affected } = await this.tasksRepository.delete(id);

        if (!affected) {
            throw new NotFoundException();
        }
    }
}
