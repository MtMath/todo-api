import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { AuthModule } from "@app/auth/auth.modules";
import { TasksController } from "./controllers/tasks.controller";
import { TasksService } from "./services/tasks.service";
import { TaskRepository } from "./repositories/task.repository";
import { TaskListController } from "./controllers/task-list.controller";
import { TaskListRepository } from "./repositories/task-list.repository";
import { TaskListService } from "./services/task-list.service";

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController, TaskListController],
  providers: [
    TasksService,
    TaskListService,
    TaskRepository,
    TaskListRepository,
  ],
})
export class TasksModule {}
