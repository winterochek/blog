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

@Entity('email_verify_token')
export class EmailVerifyToken {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'varchar', name: 'title', nullable: false })
  token: string;

  @Column({ type: 'boolean', name: 'expired', default: false })
  expired: boolean;

  @Column({ type: 'boolean', name: 'used', default: false })
  used: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.emailVerifyTokens)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}