import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsHexColor,
  IsBoolean,
} from "class-validator";

export class CreateTaskListDto {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MaxLength(100, { message: "Name cannot be longer than 100 characters" })
  name!: string;

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
