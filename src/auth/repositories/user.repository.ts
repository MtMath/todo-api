import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const { username, email, password } = registerDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.save(user);

    return user;
  }
}
