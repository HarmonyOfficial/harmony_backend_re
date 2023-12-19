// user.entity.ts
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {Room} from "../room/room.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  profileImage: string;

  @ManyToOne(() => Room, room => room.members)
  room: Room;

  @Column({ nullable: true, select: false })
  currentHashedRefreshToken?: string;

  @ManyToOne(() => Room, room => room.pendingUsers)
  pendingRoom: Room;
}
