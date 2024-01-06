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
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
import { PostDislike } from './post-dislike.entity';
import { Tag } from './tag.entity';
import { PostBlock } from './post-block.entity';
import { PostUnBlock } from './post-unblock.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'author_id', nullable: false })
  authorId: number;

  @Column({ type: 'text', name: 'title', nullable: false })
  title: string;

  @Column({ type: 'text', name: 'body', nullable: false })
  body: string;

  @Column({ type: 'boolean', name: 'blocked', default: false })
  blocked: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @OneToMany(() => PostDislike, (dislike) => dislike.post)
  dislikes: PostDislike[];

  @OneToMany(() => PostBlock, (block) => block.post)
  blockes: PostBlock[];

  @OneToMany(() => PostUnBlock, (block) => block.post)
  unblockes: PostUnBlock[];

  @ManyToOne(() => User, (author) => author.posts)
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: User;

  @ManyToOne(() => Tag, (tag) => tag.posts)
  tags: Tag[];
}
