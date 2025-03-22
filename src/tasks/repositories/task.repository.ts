import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { TaskList } from "../entities/task-list.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "../interfaces/task.interface";
import { User } from "@app/auth/entities/user.entity";
import { FilterTasksDto } from "../dto/filter-task.dto";

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, taskListId } = createTaskDto;

    const qb = this.createQueryBuilder("task").where("task.userId = :userId", {
      userId: user.id,
    });

    if (taskListId) {
      qb.andWhere("task.taskListId = :taskListId", { taskListId });
    } else {
      qb.andWhere("task.taskListId IS NULL");
    }

    const lastTask = await qb
      .orderBy("task.position", "DESC")
      .select("task.position")
      .getOne();

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = this.create({
      title,
      description,
      status: TaskStatus.PENDING,
      position,
      taskListId: taskListId || undefined,
      user,
    });

    await this.save(task);
    return task;
  }

  async getTasks(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    const { status, search, taskListId } = filterDto;
    const query = this.createQueryBuilder("task");

    query.where("task.userId = :userId", { userId: user.id });

    if (taskListId) {
      query.andWhere("task.taskListId = :taskListId", { taskListId });
    } else if (taskListId === null) {
      query.andWhere("task.taskListId IS NULL");
    }

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      query.andWhere(
        "(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))",
        { search: `%${search}%` }
      );
    }

    query.orderBy("task.taskListId", "ASC").addOrderBy("task.position", "ASC");

    return await query.getMany();
  }

  async moveTaskToList(
    taskId: string,
    taskListId: string | null,
    userId: string
  ): Promise<Task> {
    const task = await this.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error(`Task with ID "${taskId}" not found`);
    }

    const qb = this.createQueryBuilder("task").where("task.userId = :userId", {
      userId,
    });

    if (taskListId) {
      qb.andWhere("task.taskListId = :taskListId", { taskListId });
    } else {
      qb.andWhere("task.taskListId IS NULL");
    }

    const lastTask = await qb
      .orderBy("task.position", "DESC")
      .select("task.position")
      .getOne();

    const position = lastTask ? lastTask.position + 1 : 0;

    task.taskListId = taskListId || "undefined";
    task.position = position;

    return this.save(task);
  }

  async updateTaskPositions(
    orderedTaskIds: string[],
    taskListId: string | null,
    userId: string
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 0; i < orderedTaskIds.length; i++) {
        const task = await queryRunner.manager.findOne(Task, {
          where: { id: orderedTaskIds[i], userId },
        });

        if (task) {
          await queryRunner.manager.update(
            Task,
            { id: orderedTaskIds[i] },
            { position: i, taskListId: taskListId ?? undefined }
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
