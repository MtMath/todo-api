import { IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: "Username or email is required" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}
