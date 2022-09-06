import { UserMember } from 'src/auth/entities/user-member.entity';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Product } from './product.entity';

  @Entity({ name: 'favorite' })
  export class Favorite extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Product, (product: Product) => product.favorite)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product: Product;

    @OneToOne(() => UserMember, (userMemeber: UserMember) => userMemeber.favorite)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    userMember: UserMember;

    @Column({
      name: 'is_favorites',
      nullable: false,
      default: false,
      comment: '즐겨찾기 여부',
      type: 'boolean',
    })
    is_favorites: boolean;
  }
  