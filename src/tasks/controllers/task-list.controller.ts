import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TaskListService } from "../services/task-list.service";
import { User } from "@app/auth/entities/user.entity";
import { JwtAuthGuard } from "@app/auth/guards/jwt-auth.guard";
import { GetUser } from "@app/common/decorators/get-user.decorator";
import { TaskList } from "../entities/task-list.entity";
import { CreateTaskListDto } from "../dto/create-task-list.dto";
import { MoveTaskDto } from "../dto/move-task.dto";
import { ReorderTaskListsDto } from "../dto/reorder-task-lists.dto";
import { ReorderTasksDto } from "../dto/reorder-tasks.dto";
import { UpdateTaskListDto } from "../dto/update-task-list.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("task-lists")
export class TaskListController {
  constructor(private taskListService: TaskListService) {}

  @Post()
  createTaskList(
    @Body() createTaskListDto: CreateTaskListDto,
    @GetUser() user: User
  ): Promise<TaskList> {
    return this.taskListService.createTaskList(createTaskListDto, user);
  }

  @Get()
  getTaskLists(@GetUser() user: User): Promise<TaskList[]> {
    return this.taskListService.getTaskLists(user);
  }

  @Get(":id")
  getTaskListById(
    @Param("id", ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<TaskList> {
    return this.taskListService.getTaskListById(id, user);
  }

  @Patch(":id")
  updateTaskList(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTaskListDto: UpdateTaskListDto,
    @GetUser() user: User
  ): Promise<TaskList> {
    return this.taskListService.updateTaskList(id, updateTaskListDto, user);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTaskList(
    @Param("id", ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<void> {
    return this.taskListService.deleteTaskList(id, user);
  }

  @Patch(":id/default")
  setDefaultList(
    @Param("id", ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<TaskList> {
    return this.taskListService.setDefaultList(id, user);
  }

  @Post("reorder")
  @HttpCode(HttpStatus.OK)
  reorderTaskLists(
    @Body() reorderTaskListsDto: ReorderTaskListsDto,
    @GetUser() user: User
  ): Promise<void> {
    return this.taskListService.reorderTaskLists(reorderTaskListsDto, user);
  }

  @Patch("tasks/:taskId/move")
  moveTask(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Body() moveTaskDto: MoveTaskDto,
    @GetUser() user: User
  ): Promise<void> {
    return this.taskListService.moveTask(taskId, moveTaskDto, user);
  }

  @Post("tasks/reorder")
  @HttpCode(HttpStatus.OK)
  reorderTasks(
    @Body() reorderTasksDto: ReorderTasksDto,
    @GetUser() user: User
  ): Promise<void> {
    return this.taskListService.reorderTasks(reorderTasksDto, user);
  }
}
