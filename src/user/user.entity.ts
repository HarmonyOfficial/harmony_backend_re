// user.entity.ts
import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from 'typeorm';
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

  @Column({ nullable: true })
  roomId: number;

  @Column({ nullable: true })
  exists: boolean;

  @Column({ nullable: true })
  currentHashedRefreshToken?: string;
}
