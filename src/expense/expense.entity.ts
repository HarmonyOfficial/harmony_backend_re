import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, CreateDateColumn} from 'typeorm';
import {User} from "../user/user.entity";
import {Room} from "../room/room.entity";

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  author:User;

  @Column()
  amount: number;

  @ManyToOne(() => Room)
  room: Room;
}
