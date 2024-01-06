import { PostDto } from 'src/modules/posts/dto';
import { AdminDto } from './admin.dto';
import { PostBlock } from 'src/entities';

export class PostBlockDto {
  id: number;
  postId: number;
  adminId: number;
  post?: PostDto;
  admin?: AdminDto;

  static fromEntity(postBlock: PostBlock): PostBlockDto {
    return {
      id: postBlock.id,
      postId: postBlock.postId,
      adminId: postBlock.adminId,
      post: postBlock?.post ? PostDto.fromEntity(postBlock.post) : undefined,
      admin: postBlock?.admin
        ? AdminDto.fromEntity(postBlock.admin)
        : undefined,
    };
  }
}
