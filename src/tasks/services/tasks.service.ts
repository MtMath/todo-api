import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskRepository } from "../repositories/task.repository";
import { TaskListRepository } from "../repositories/task-list.repository";
import { Task } from "../entities/task.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { FilterTasksDto } from "../dto/filter-task.dto";
import { User } from "@app/auth/entities/user.entity";

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TaskRepository,
    private taskListRepository: TaskListRepository
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    if (createTaskDto.taskListId) {
      const taskList = await this.taskListRepository.findOne({
        where: { id: createTaskDto.taskListId, userId: user.id },
      });

      if (!taskList) {
        throw new NotFoundException(
          `Task list with ID "${createTaskDto.taskListId}" not found`
        );
      }
    }

    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTasks(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    if (filterDto.taskListId !== undefined && filterDto.taskListId !== null) {
      const taskList = await this.taskListRepository.findOne({
        where: { id: filterDto.taskListId, userId: user.id },
      });

      if (!taskList) {
        throw new NotFoundException(
          `Task list with ID "${filterDto.taskListId}" not found`
        );
      }
    }

    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async getTasksWithoutList(
    filterDto: FilterTasksDto,
    user: User
  ): Promise<Task[]> {
    const filterWithNullList = { ...filterDto, taskListId: null };
    return this.taskRepository.getTasks(filterWithNullList, user);
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (updateTaskDto.title) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }

    if (updateTaskDto.status) {
      task.status = updateTaskDto.status;
    }

    await this.taskRepository.save(task);
    return task;
  }

  async moveTaskToList(
    taskId: string,
    taskListId: string | null,
    user: User
  ): Promise<Task> {
    const task = await this.getTaskById(taskId, user);

    if (taskListId !== null) {
      const taskList = await this.taskListRepository.findOne({
        where: { id: taskListId, userId: user.id },
      });

      if (!taskList) {
        throw new NotFoundException(
          `Task list with ID "${taskListId}" not found`
        );
      }
    }

    return this.taskRepository.moveTaskToList(taskId, taskListId, user.id);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);
    await this.taskRepository.remove(task);
  }
}
