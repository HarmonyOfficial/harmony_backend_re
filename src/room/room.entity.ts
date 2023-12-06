import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column('simple-array')
  members: string[];
}
