import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Task } from "./task.entity";
import { User } from "@app/auth/entities/user.entity";

@Entity("task_lists")
export class TaskList {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: false })
  isDefault!: boolean;

  @Column({ default: "#4A6FA5" })
  color!: string;

  @Column({ default: 0 })
  position!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.taskLists)
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @OneToMany(() => Task, (task) => task.taskList)
  tasks!: Task[];
}
