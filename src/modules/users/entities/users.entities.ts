import { AbstractEntity } from 'src/database/abstract.entities';
import { Products } from 'src/modules/products/entities/products.entities';
import { Column, Entity, JoinColumn, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Users extends AbstractEntity<Users> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Products, (product) => product.user, {
    cascade: true,
    eager: true,
  })
  products: Products[];
}
