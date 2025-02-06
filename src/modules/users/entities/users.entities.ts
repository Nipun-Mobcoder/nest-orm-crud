import { AbstractEntity } from 'src/database/abstract.entities';
import { Products } from 'src/modules/products/entities/products.entities';
import { Permission, Roles } from 'src/modules/roles/entities/roles.entities';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class Users extends AbstractEntity<Users> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable()
  roles: Roles[];

  @OneToMany(() => Products, (product) => product.user, {
    cascade: true,
    eager: true,
  })
  products: Products[];
}
