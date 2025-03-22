import { IsUUID, IsOptional, ValidateIf } from "class-validator";

export class MoveTaskDto {
  @IsUUID(4, { message: "Task list ID must be a valid UUID v4" })
  @ValidateIf((o) => o.taskListId !== null)
  @IsOptional()
  taskListId!: string | null;
}
