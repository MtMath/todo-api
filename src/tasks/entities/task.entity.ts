import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TaskStatus } from "../interfaces/task.interface";
import { User } from "@app/auth/entities/user.entity";
import { TaskList } from "./task-list.entity";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  user!: User;

  @Column()
  userId!: string;

  @ManyToOne(() => TaskList, (taskList) => taskList.tasks, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "taskListId" })
  taskList!: TaskList;

  @Column({ nullable: true })
  taskListId!: string;

  @Column({ default: 0 })
  position!: number;
}
