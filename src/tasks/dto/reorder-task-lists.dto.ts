import { IsArray, ArrayMinSize, IsUUID } from "class-validator";

export class ReorderTaskListsDto {
  @IsArray()
  @ArrayMinSize(1, { message: "At least one task list ID is required" })
  @IsUUID(4, { each: true, message: "Each ID must be a valid UUID v4" })
  ids!: string[];
}
