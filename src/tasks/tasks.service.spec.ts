/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from 'src/shared/enums/task-status.enum';
import { rejects } from 'assert';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findTask: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    // initialize a NestJS module with tasksService & tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('call tasksRepository.getTasks and return the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      tasksRepository.getTasks.mockResolvedValue([]);
      const result = await tasksService.getTasks({}, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('call taskRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
        user: mockUser,
      };

      tasksRepository.findTask.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('call taskRepository.findOne and handle an error', async () => {
      tasksRepository.findTask.mockResolvedValue(null);
      await expect(
        tasksService.getTaskById('someId', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
