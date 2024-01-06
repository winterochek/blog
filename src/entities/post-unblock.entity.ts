import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Admin } from './admin.entity';

@Entity('post_unblock')
export class PostUnBlock {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'post_id', nullable: false })
  postId: number;

  @Column({ type: 'int', name: 'admin_id', nullable: false })
  adminId: number;

  @Column({ type: 'text', name: 'reason', nullable: false })
  reason: string;

  @ManyToOne(() => Post, (post) => post.unblockes)
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => Admin, (admin) => admin.postUnBlocks)
  @JoinColumn([{ name: 'admin_id', referencedColumnName: 'id' }])
  admin: Admin;
}
