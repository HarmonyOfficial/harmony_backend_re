import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {User} from "../user/user.entity";

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
}

