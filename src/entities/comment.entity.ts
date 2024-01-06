import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { CommentLike } from './comment-like.entity';
import { CommentDislike } from './comment-dislike.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'text', name: 'title', nullable: true })
  title?: string;

  @Column({ type: 'text', name: 'body', nullable: false })
  body: string;

  @Column({ type: 'int', name: 'author_id', nullable: false })
  authorId: number;

  @Column({ type: 'int', name: 'post_id', nullable: false })
  postId: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => CommentLike, (like) => like.comment)
  likes: CommentLike[];

  @OneToMany(() => CommentDislike, (dislike) => dislike.comment)
  dislikes: CommentDislike[];

  @ManyToOne(() => User, (author) => author.comments)
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;
}
