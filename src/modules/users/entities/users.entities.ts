import { AbstractEntity } from 'src/database/abstract.entities';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Users extends AbstractEntity<Users> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;
}
