import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Room} from "../room/room.entity";
import {User} from "../user/user.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  name: string;

  @ManyToMany(() => User, user => user.events)
  attendees: User[];

  @ManyToOne(() => Room, room => room.events)
  room: Room;
}
