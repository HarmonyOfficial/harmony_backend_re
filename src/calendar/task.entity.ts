import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Room} from "../room/room.entity";
import {User} from "../user/user.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  name: string;

  @ManyToMany(() => User, user => user.tasks)
  attendees: User[];

  @Column({
    nullable: true,
  })
  repetition: number; // 반복일 수

  @Column({ default: false })
  completed: boolean; // 완료 여부

  @Column({ nullable: true })
  completionImage: string; // 완료 사진 (base64 인코딩된 문자열)

  @ManyToOne(() => Room, room => room.tasks)
  room: Room;
}
