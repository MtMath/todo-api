import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { TaskListRepository } from "../repositories/task-list.repository";
import { TaskRepository } from "../repositories/task.repository";
import { TaskList } from "../entities/task-list.entity";
import { User } from "@app/auth/entities/user.entity";
import { CreateTaskListDto } from "../dto/create-task-list.dto";
import { MoveTaskDto } from "../dto/move-task.dto";
import { ReorderTaskListsDto } from "../dto/reorder-task-lists.dto";
import { ReorderTasksDto } from "../dto/reorder-tasks.dto";
import { UpdateTaskListDto } from "../dto/update-task-list.dto";

@Injectable()
export class TaskListService {
  constructor(
    private taskListRepository: TaskListRepository,
    private taskRepository: TaskRepository
  ) {}

  async createTaskList(
    createTaskListDto: CreateTaskListDto,
    user: User
  ): Promise<TaskList> {
    const { name, description, color, isDefault } = createTaskListDto;

    return this.taskListRepository.createTaskList(
      name,
      user,
      description,
      color,
      isDefault
    );
  }

  async getTaskLists(user: User): Promise<TaskList[]> {
    return this.taskListRepository.findByUser(user.id);
  }

  async getTaskListById(id: string, user: User): Promise<TaskList> {
    const taskList = await this.taskListRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!taskList) {
      throw new NotFoundException(`Task list with ID "${id}" not found`);
    }

    return taskList;
  }

  async updateTaskList(
    id: string,
    updateTaskListDto: UpdateTaskListDto,
    user: User
  ): Promise<TaskList> {
    const taskList = await this.getTaskListById(id, user);

    if (updateTaskListDto.isDefault === true && !taskList.isDefault) {
      await this.taskListRepository.setDefaultList(user.id, id);
      taskList.isDefault = true;
    }

    if (updateTaskListDto.name) {
      taskList.name = updateTaskListDto.name;
    }

    if (updateTaskListDto.description !== undefined) {
      taskList.description = updateTaskListDto.description;
    }

    if (updateTaskListDto.color) {
      taskList.color = updateTaskListDto.color;
    }

    await this.taskListRepository.save(taskList);
    return taskList;
  }

  async deleteTaskList(id: string, user: User): Promise<void> {
    const taskList = await this.getTaskListById(id, user);

    if (taskList.isDefault) {
      throw new ConflictException("Cannot delete the default task list");
    }

    const defaultList = await this.taskListRepository.findDefaultByUser(
      user.id
    );

    if (defaultList && defaultList.id !== id) {
      const tasks = await this.taskRepository.find({
        where: { taskListId: id, userId: user.id },
      });

      for (const task of tasks) {
        await this.taskRepository.moveTaskToList(
          task.id,
          defaultList.id,
          user.id
        );
      }
    }

    await this.taskListRepository.remove(taskList);
  }

  async reorderTaskLists(
    reorderDto: ReorderTaskListsDto,
    user: User
  ): Promise<void> {
    const userLists = await this.taskListRepository.findByUser(user.id);
    const userListIds = userLists.map((list) => list.id);

    const allIdsValid = reorderDto.ids.every((id) => userListIds.includes(id));
    if (!allIdsValid) {
      throw new NotFoundException("One or more task lists not found");
    }

    await this.taskListRepository.updatePositions(reorderDto.ids);
  }

  async setDefaultList(id: string, user: User): Promise<TaskList> {
    const taskList = await this.getTaskListById(id, user);

    if (taskList.isDefault) {
      return taskList;
    }

    await this.taskListRepository.setDefaultList(user.id, id);
    taskList.isDefault = true;

    return taskList;
  }

  async moveTask(
    taskId: string,
    moveTaskDto: MoveTaskDto,
    user: User
  ): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }

    if (moveTaskDto.taskListId !== null) {
      const targetList = await this.taskListRepository.findOne({
        where: { id: moveTaskDto.taskListId, userId: user.id },
      });

      if (!targetList) {
        throw new NotFoundException(
          `Task list with ID "${moveTaskDto.taskListId}" not found`
        );
      }
    }

    await this.taskRepository.moveTaskToList(
      taskId,
      moveTaskDto.taskListId,
      user.id
    );
  }

  async reorderTasks(reorderDto: ReorderTasksDto, user: User): Promise<void> {
    const tasks = await this.taskRepository.find({
      where: { userId: user.id },
      select: ["id"],
    });

    const userTaskIds = tasks.map((task) => task.id);

    const allIdsValid = reorderDto.ids.every((id) => userTaskIds.includes(id));
    if (!allIdsValid) {
      throw new NotFoundException("One or more tasks not found");
    }

    if (reorderDto.taskListId !== null) {
      const targetList = await this.taskListRepository.findOne({
        where: { id: reorderDto.taskListId, userId: user.id },
      });

      if (!targetList) {
        throw new NotFoundException(
          `Task list with ID "${reorderDto.taskListId}" not found`
        );
      }
    }

    await this.taskRepository.updateTaskPositions(
      reorderDto.ids,
      reorderDto.taskListId,
      user.id
    );
  }
}
