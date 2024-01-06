import { Comment } from 'src/entities';
import { PostDto } from 'src/modules/posts/dto';
import { PublicUserDto } from 'src/modules/user/dto';

export class CommentDto {
  id: number;
  title?: string;
  body: string;
  authorId: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
  //   likes: CommentLikeDto[];
  //   dislikes: CommentDislikeDto[];
  author: PublicUserDto;
  post: PostDto;

  static fromEntity(comment: Comment): CommentDto {
    return {
      id: comment.id,
      title: comment?.title,
      body: comment.body,
      authorId: comment.authorId,
      postId: comment.postId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      //   likes: comment?.likes
      //     ? comment.likes.map(CommentLikeDto.fromEntity)
      //     : undefined,
      //   dislikes: comment?.dislikes
      //     ? comment.dislikes.map(CommentDislikeDto.fromEntity)
      //     : undefined,
      author: comment?.author
        ? PublicUserDto.fromEntity(comment.author)
        : undefined,
      post: comment?.post ? PostDto.fromEntity(comment.post) : undefined,
    };
  }
}
