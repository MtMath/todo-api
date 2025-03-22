import {
  IsArray,
  ArrayMinSize,
  IsUUID,
  IsOptional,
  ValidateIf,
} from "class-validator";

export class ReorderTasksDto {
  @IsArray()
  @ArrayMinSize(1, { message: "At least one task ID is required" })
  @IsUUID(4, { each: true, message: "Each ID must be a valid UUID v4" })
  ids!: string[];

  @IsUUID(4, { message: "Task list ID must be a valid UUID v4" })
  @ValidateIf((o) => o.taskListId !== null)
  @IsOptional()
  taskListId!: string | null;
}
