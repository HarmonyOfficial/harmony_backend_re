// user.entity.ts
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import {Room} from "../room/room.entity";
import {Event} from "../calendar/event.entity";
import {Task} from "../calendar/task.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  profileImage: string;

  @ManyToOne(() => Room, room => room.members)
  room: Room;

  @Column({ nullable: true, select: false })
  currentHashedRefreshToken?: string;

  @ManyToOne(() => Room, room => room.pendingUsers)
  pendingRoom: Room;

  // make date column no default value, only insert, update
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinDate: Date;

  @ManyToMany(() => Event, event => event.attendees)
  @JoinTable()
  events: Event[];

  @ManyToMany(() => Task, task => task.attendees)
  @JoinTable()
  tasks: Task[];
}
