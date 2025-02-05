import { AbstractEntity } from 'src/database/abstract.entities';
import { Column, Entity, JoinTable, ManyToMany, Unique } from 'typeorm';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

@Entity()
export class Permission extends AbstractEntity<Permission> {
  @Column({
    type: 'enum',
    enum: Resource,
  })
  resource: Resource;

  @Column({
    type: 'enum',
    enum: Action,
    array: true,
  })
  actions: Action[];
}

@Entity()
@Unique(['name'])
export class Roles extends AbstractEntity<Roles> {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission, { cascade: true, eager: true })
  @JoinTable()
  permissions: Permission[];
}
