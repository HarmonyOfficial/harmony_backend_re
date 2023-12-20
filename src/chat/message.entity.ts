import {Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Room} from "../room/room.entity";
import {User} from "../user/user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.events)
  room: Room;

  @OneToOne(() => User, user => user.id)
  sender: User;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
