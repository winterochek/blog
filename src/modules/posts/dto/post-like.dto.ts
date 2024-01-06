import { PostLike } from 'src/entities';
import { PublicUserDto } from 'src/modules/user/dto';
import { PostDto } from './post.dto';

export class PostLikeDto {
  public id: number;
  public postId: number;
  public userId: number;
  public createdAt: Date;
  public updatedAt: Date;
  public user: PublicUserDto;
  public post: PostDto;
  static fromEntity(postLike: PostLike): PostLikeDto {
    return {
      id: postLike.id,
      postId: postLike.postId,
      userId: postLike.userId,
      createdAt: postLike.createdAt,
      updatedAt: postLike.updatedAt,
      user: postLike?.user
        ? PublicUserDto.fromEntity(postLike.user)
        : undefined,
      post: postLike?.post ? PostDto.fromEntity(postLike.post) : undefined,
    };
  }
}
