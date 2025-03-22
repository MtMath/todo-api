import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { TaskList } from "../entities/task-list.entity";
import { User } from "@app/auth/entities/user.entity";

@Injectable()
export class TaskListRepository extends Repository<TaskList> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {
    super(TaskList, dataSource.createEntityManager());
  }

  async createTaskList(
    name: string,
    user: User,
    description?: string,
    color?: string,
    isDefault = false
  ): Promise<TaskList> {
    const lastPosition = await this.findOne({
      where: { userId: user.id },
      order: { position: "DESC" },
      select: ["position"],
    });

    const position = lastPosition ? lastPosition.position + 1 : 0;

    if (isDefault) {
      await this.update(
        { userId: user.id, isDefault: true },
        { isDefault: false }
      );
    } else if (!lastPosition) {
      isDefault = true;
    }

    const taskList = this.create({
      name,
      description,
      color,
      isDefault,
      position,
      user,
      userId: user.id,
    });

    return this.save(taskList);
  }

  async findByUser(userId: string): Promise<TaskList[]> {
    return this.find({
      where: { userId },
      order: { position: "ASC" },
    });
  }

  async findDefaultByUser(userId: string): Promise<TaskList | null> {
    return this.findOne({
      where: { userId, isDefault: true },
    });
  }

  async updatePositions(orderedIds: string[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await queryRunner.manager.update(
          TaskList,
          { id: orderedIds[i] },
          { position: i }
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async setDefaultList(userId: string, listId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        TaskList,
        { userId },
        { isDefault: false }
      );

      await queryRunner.manager.update(
        TaskList,
        { id: listId, userId },
        { isDefault: true }
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
