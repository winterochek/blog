import { Post } from 'src/entities';
import { CommentDto } from 'src/modules/comments/dto';
import { PublicUserDto } from 'src/modules/user/dto';
import { PostLikeDto } from './post-like.dto';
import { PostDislikeDto } from './post-dislike.dto';
import { TagDto } from './tag.dto';
import { PostUnBlockDto } from './post-unblock.dto';
import { PostBlockDto } from './post-block.dto';

export class PostDto {
  id: number;
  authorId: number;
  title: string;
  body: string;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comments: CommentDto[];
  likes: PostLikeDto[];
  dislikes: PostDislikeDto[];
  blockes: PostBlockDto[];
  unblockes: PostUnBlockDto[];
  author: PublicUserDto;
  tags: TagDto[];

  static fromEntity(post: Post): PostDto {
    return {
      id: post.id,
      authorId: post.authorId,
      title: post.title,
      body: post.body,
      blocked: post.blocked,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      comments: post?.comments?.map(CommentDto.fromEntity) ?? [],
      likes: post?.likes?.map(PostLikeDto.fromEntity) ?? [],
      dislikes: post?.dislikes?.map(PostDislikeDto.fromEntity) ?? [],
      author: post?.author ? PublicUserDto.fromEntity(post.author) : undefined,
      tags: post?.tags?.map(TagDto.fromEntity) ?? [],
      blockes: post?.blockes?.map(PostBlockDto.fromEntity) ?? [],
      unblockes: post?.unblockes?.map(PostUnBlockDto.fromEntity) ?? [],
    };
  }
}
