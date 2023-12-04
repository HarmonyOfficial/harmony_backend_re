import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  name: string;

  @Column('simple-array')
  assignees: string[]; // 여러 명의 담당자

  @Column()
  repetition: number; // 반복일 수

  @Column({ default: false })
  completed: boolean; // 완료 여부

  @Column({ nullable: true })
  completionImage: string; // 완료 사진 (base64 인코딩된 문자열)

  @Column()
  roomId: number; // 소속된 방의 ID
}
