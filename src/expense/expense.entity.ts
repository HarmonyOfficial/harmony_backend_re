import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string; // '식비', '주거비', '생활용품', '구독비', '기타' 등

  @Column()
  date: Date;

  @Column()
  person: string; // 소비한 사람의 이름

  @Column()
  amount: number;

  @Column()
  roomId: number; // 소비가 발생한 방의 ID
}
