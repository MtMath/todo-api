import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(4, { message: "Username must be at least 4 characters long" })
  @MaxLength(20, { message: "Username cannot be longer than 20 characters" })
  username!: string;

  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(32, { message: "Password cannot be longer than 32 characters" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
  })
  password!: string;
}
