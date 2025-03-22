import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from "class-validator";
import { TaskStatus } from "../interfaces/task.interface";

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: "Status must be one of: PENDING, IN_PROGRESS, COMPLETED",
  })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsUUID(4, { message: "Task list ID must be a valid UUID v4" })
  @ValidateIf((o) => o.taskListId !== null)
  @IsOptional()
  taskListId?: string | null;
}
