import { AbstractEntity } from 'src/database/abstract.entities';
import { Users } from 'src/modules/users/entities/users.entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductType } from '../enums/productType.enum';

@Entity()
export class Products extends AbstractEntity<Products> {
  @Column()
  name: string;

  @Column({ unique: true })
  productType: ProductType;

  @Column()
  productDescription: string;

  @Column()
  productPrice: number;

  @ManyToOne(() => Users, (user) => user.products, {})
  @JoinColumn({ name: 'userId' })
  user: Users;
}
