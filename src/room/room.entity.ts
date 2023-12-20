import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {User} from "../user/user.entity";
import {Task} from "../calendar/task.entity";
import {Expense} from "../expense/expense.entity";
import {Message} from "../chat/message.entity";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => User, user => user.room)
  members: User[];

  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => User, user => user.pendingRoom)
  pendingUsers: User[];

  @OneToMany(() => Task, task => task.room)
  tasks: Task[];

  @OneToMany(() => Task, task => task.room)
  events: Task[];

  @OneToMany(() => Task, task => task.room)
  expenses: Expense[];

  @OneToMany(() => Message, message => message.room)
  messages: Message[];
}

