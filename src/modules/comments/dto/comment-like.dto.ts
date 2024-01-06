import { CommentLike } from 'src/entities';
import { PublicUserDto } from 'src/modules/user/dto';
import { CommentDto } from './comment.dto';

export class CommentLikeDto {
  id: number;
  userId: number;
  commentId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: PublicUserDto;
  comment?: CommentDto;

  static fromEntity(commentLike: CommentLike): CommentLikeDto {
    return {
      id: commentLike.id,
      userId: commentLike.userId,
      commentId: commentLike.commentId,
      createdAt: commentLike.createdAt,
      updatedAt: commentLike.updatedAt,
      user: commentLike?.user
        ? PublicUserDto.fromEntity(commentLike.user)
        : undefined,
      comment: commentLike?.comment
        ? CommentDto.fromEntity(commentLike.comment)
        : undefined,
    };
  }
}
