import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/shared/enums/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
