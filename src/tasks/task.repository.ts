import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
// import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from 'src/shared/enums/task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

// Inheritance
@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        // new Brackets((qb) => {
        //   qb.where(
        //     'task.title ILIKE :search OR task.description ILIKE :search',
        //     { search: `%${search}%` },
        //   );
        // }),

        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async findTask(id: string, user: User): Promise<Task | null> {
    return await this.findOne({
      where: {
        id,
        user,
      },
    });
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }
}

// Composition
// @Injectable()
// export class TaskRepository {
//   constructor(
//     @InjectRepository(Task)
//     readonly repo: Repository<Task>,
//   ) {}
// }
