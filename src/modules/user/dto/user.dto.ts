import { User } from 'src/entities';
import {
  CommentDislikeDto,
  CommentDto,
  CommentLikeDto,
} from 'src/modules/comments/dto';
import { PostDislikeDto, PostDto, PostLikeDto } from 'src/modules/posts/dto';
import { UserBlockDto } from './user-block.dto';
import { UserUnBlockDto } from './user-unblock.dto';
import { EmailVerifyTokenDto } from './email-verify-token.dto';
import { PasswordResetTokenDto } from './password-reset-token.dto';

export class UserDto {
  public id: number;
  public email: string;
  public name: string;
  public username: string;
  public emailVerified: boolean;
  public blocked: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public posts: PostDto[];
  public comments: CommentDto[];
  public postLikes: PostLikeDto[];
  public postDislikes: PostDislikeDto[];
  public commentLikes: CommentLikeDto[];
  public commentDislikes: CommentDislikeDto[];
  public userBlocks: UserBlockDto[];
  public userUnBlocks: UserUnBlockDto[];
  public passwordResetTokens: PasswordResetTokenDto[];
  public emailVerifyTokens: EmailVerifyTokenDto[];
  public followers: UserDto[];
  public following: UserDto[];

  static fromEntity(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      emailVerified: user.emailVerified,
      blocked: user.blocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      posts: user?.posts?.map(PostDto.fromEntity) ?? [],
      comments: user?.comments?.map(CommentDto.fromEntity) ?? [],
      postDislikes: user?.postDislikes?.map(PostDislikeDto.fromEntity) ?? [],
      postLikes: user?.postLikes?.map(PostLikeDto.fromEntity) ?? [],
      commentLikes: user?.commentLikes?.map(CommentLikeDto.fromEntity) ?? [],
      commentDislikes:
        user?.commentDislikes?.map(CommentDislikeDto.fromEntity) ?? [],
      userBlocks: user?.userBlocks?.map(UserBlockDto.fromEntity) ?? [],
      userUnBlocks: user?.userUnBlocks?.map(UserUnBlockDto.fromEntity) ?? [],
      passwordResetTokens:
        user?.passwordResetTokens?.map(PasswordResetTokenDto.fromEntity) ?? [],
      emailVerifyTokens:
        user?.emailVerifyTokens?.map(EmailVerifyTokenDto.fromEntity) ?? [],
      followers: user?.followers?.map(UserDto.fromEntity) ?? [],
      following: user?.following?.map(UserDto.fromEntity) ?? [],
    };
  }
}

export class PublicUserDto {
  public id: number;
  public username: string;
  public createdAt: Date;
  public posts: any[];
  public comments: any[];
  public postLikes: PostLikeDto[];
  public postDislikes: PostDislikeDto[];
  public commentLikes: CommentLikeDto[];
  public commentDislikes: CommentDislikeDto[];
  public followers: PublicUserDto[];
  public following: PublicUserDto[];

  static fromEntity(user: User): PublicUserDto {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      posts: user?.posts?.map(PostDto.fromEntity) ?? [],
      comments: user?.comments?.map(CommentDto.fromEntity) ?? [],
      postDislikes: user?.postDislikes?.map(PostDislikeDto.fromEntity) ?? [],
      postLikes: user?.postLikes?.map(PostLikeDto.fromEntity) ?? [],
      commentLikes: user?.commentLikes?.map(CommentLikeDto.fromEntity) ?? [],
      commentDislikes:
        user?.commentDislikes?.map(CommentDislikeDto.fromEntity) ?? [],
      followers: user?.followers
        ? user.followers.map(PublicUserDto.fromEntity)
        : [],
      following: user?.following
        ? user.following.map(PublicUserDto.fromEntity)
        : [],
    };
  }
}
