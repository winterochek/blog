import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Admin } from './admin.entity';

@Entity('user_unblock')
export class UserUnBlock {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'int', name: 'admin_id', nullable: false })
  adminId: number;

  @Column({ type: 'text', name: 'reason', nullable: false })
  reason: string;

  @ManyToOne(() => User, (user) => user.userUnBlocks)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Admin, (admin) => admin.userUnBlocks)
  @JoinColumn([{ name: 'admin_id', referencedColumnName: 'id' }])
  admin: Admin;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
