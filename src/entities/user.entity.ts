import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';
import { CommentLike } from './comment-like.entity';
import { UserBlock } from './user-block.entity';
import { PostDislike } from './post-dislike.entity';
import { PasswordResetToken } from './password-reset-token.entity';
import { UserUnBlock } from './user-unblock.entity';
import { CommentDislike } from './comment-dislike.entity';
import { EmailVerifyToken } from './email-verify-token.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'email', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'name', length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    name: 'username',
    length: 255,
    unique: true,
  })
  username: string;

  @Column({ type: 'varchar', name: 'password', length: 255 })
  password: string;

  @Column({
    type: 'varchar',
    name: 'refresh_token',
    length: 255,
    nullable: true,
  })
  refreshToken: string | null;

  @Column({ type: 'boolean', name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', name: 'blocked', default: false })
  blocked: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments?: Comment[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes?: PostLike[];

  @OneToMany(() => PostDislike, (dislike) => dislike.user)
  postDislikes?: PostDislike[];

  @OneToMany(() => CommentLike, (like) => like.user)
  commentLikes?: CommentLike[];

  @OneToMany(() => CommentDislike, (dislike) => dislike.user)
  commentDislikes?: CommentDislike[];

  @OneToMany(() => UserBlock, (block) => block.user)
  userBlocks?: UserBlock[];

  @OneToMany(() => UserUnBlock, (unBlock) => unBlock.user)
  userUnBlocks?: UserUnBlock[];

  @OneToMany(() => PasswordResetToken, (token) => token.user)
  passwordResetTokens?: PasswordResetToken[];

  @OneToMany(() => EmailVerifyToken, (token) => token.user)
  emailVerifyTokens?: EmailVerifyToken[];

  @ManyToMany(() => User)
  @JoinTable()
  followers?: User[];

  @ManyToMany(() => User)
  @JoinTable()
  following?: User[];
}
