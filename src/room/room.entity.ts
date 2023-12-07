import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from 'typeorm';
import {User} from "../user/user.entity";

@Entity()
export class Room {
  @Column({primary:true, unique:true})
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => User, user => user.room)
  members: User[];

  @ManyToOne(() => User, user => user.ownedRooms)
  owner: User;
}
