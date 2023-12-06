import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TemporaryUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column('json')
  userData: any;
}
