import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.userRepository.createUser(registerDto);

      const payload: JwtPayload = { id: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error: any) {
      if (error.code === "23505") {
        throw new ConflictException("Username or email already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: [{ email: email }],
    });

    if (!user || !(await this.validatePassword(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayload = { id: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
