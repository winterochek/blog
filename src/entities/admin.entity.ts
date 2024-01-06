import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserUnBlock } from './user-unblock.entity';
import { UserBlock } from './user-block.entity';
import { PostBlock } from './post-block.entity';
import { PostUnBlock } from './post-unblock.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'email', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name: string;

  @Column({ type: 'varchar', name: 'password', length: 255 })
  password: string;

  @Column({
    type: 'varchar',
    name: 'refresh_token',
    length: 255,
    nullable: true,
  })
  refreshToken: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => UserBlock, (block) => block.admin)
  userBlocks?: UserBlock[];

  @OneToMany(() => UserUnBlock, (unBlock) => unBlock.admin)
  userUnBlocks?: UserUnBlock[];

  @OneToMany(() => PostBlock, (block) => block.admin)
  postBlocks?: PostBlock[];

  @OneToMany(() => PostUnBlock, (unBlock) => unBlock.admin)
  postUnBlocks?: PostUnBlock[];
}
