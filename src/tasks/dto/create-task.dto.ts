import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsUUID,
  ValidateIf,
  IsEnum,
} from "class-validator";
import { TaskStatus } from "../interfaces/task.interface";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  @MaxLength(100, { message: "Title cannot be longer than 100 characters" })
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: "Description cannot be longer than 500 characters",
  })
  description?: string;

  @IsEnum(TaskStatus, {
    message: `Status must be one of the following values: ${Object.values(TaskStatus).join(", ")}`,
  })
  @IsOptional()
  status?: string;

  @IsUUID(4, { message: "Task list ID must be a valid UUID v4" })
  @ValidateIf((o) => o.taskListId !== null)
  taskListId!: string;
}
