import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  IsUUID,
  ValidateIf,
} from "class-validator";
import { TaskStatus } from "../interfaces/task.interface";

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: "Title cannot be longer than 100 characters" })
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: "Description cannot be longer than 500 characters",
  })
  description?: string;

  @IsEnum(TaskStatus, {
    message: "Status must be one of: PENDING, IN_PROGRESS, COMPLETED",
  })
  @IsOptional()
  status?: TaskStatus;

  @IsUUID(4, { message: "Task list ID must be a valid UUID v4" })
  @ValidateIf((o) => o.taskListId !== null)
  @IsOptional()
  taskListId?: string | null;
}
