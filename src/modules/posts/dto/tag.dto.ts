import { Tag } from 'src/entities';
import { PostDto } from './post.dto';

export class TagDto {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  posts: PostDto[];

  static fromEntity(tag: Tag): TagDto {
    return {
      id: tag.id,
      title: tag.title,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      posts: tag?.posts?.map(PostDto.fromEntity) ?? [],
    };
  }
}
