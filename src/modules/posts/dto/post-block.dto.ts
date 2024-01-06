import { AdminDto } from 'src/modules/admin/dto';
import { PostDto } from './post.dto';
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
