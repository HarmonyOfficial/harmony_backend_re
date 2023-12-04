// room-member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from '../user/user.entity';

@Entity()
export class RoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // User 엔터티의 ID 또는 UID

  @Column()
  roomId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enteredAt: Date;

  @ManyToOne(() => Room, (room) => room.members)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => User, (user) => user.rooms)
  @JoinColumn({ name: 'userId' })
  user: User;
}
