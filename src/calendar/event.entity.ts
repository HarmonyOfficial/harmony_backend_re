import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  name: string;

  @Column('simple-array')
  assignees: string[]; // 여러 명의 담당자

  @Column()
  roomId: number; // 소속된 방의 ID
}
