import {
  IsString,
  IsOptional,
  MaxLength,
  IsHexColor,
  IsBoolean,
} from "class-validator";

export class UpdateTaskListDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: "Name cannot be longer than 100 characters" })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: "Description cannot be longer than 500 characters",
  })
  description?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
