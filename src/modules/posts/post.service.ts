import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, PostLike, Tag } from 'src/entities';
import { In, Not, Repository } from 'typeorm';
import { CreatePostRequestBody, UpdatePostRequestBody } from './requests';
import { BusinessException, ErrorCode } from '../common/exceptions';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}
  async create(
    createPostRequestBody: CreatePostRequestBody,
    authorId: number,
  ): Promise<Post> {
    try {
      const post = await this.postRepository.save({
        authorId,
        title: createPostRequestBody.title,
        body: createPostRequestBody.body,
      });
      if (createPostRequestBody.tags.length) {
        try {
          const tags: Tag[] = [];
          for (const title of createPostRequestBody.tags) {
            if (tags.length < 10) {
              const tag = await this.tagRepository.save({ title });
              tags.push(tag);
            }
          }
          post.tags = tags;
        } catch (error) {
          // throw exception
        }
      }
      return post;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getPostById(id: number, authorId?: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id, blocked: false },
        relations: [
          'comments',
          'comments.likes',
          'comments.dislikes',
          'comments.author',
          'likes',
          'dislikes',
          'author',
          'tags',
          'blocks',
          'unblocks',
        ],
      });
      if (!post) {
        // throw exception
      }
      if (!authorId || post.authorId !== authorId) {
        return { ...post, blockes: undefined, unblockes: undefined };
      }
      return post;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getPostsByAuthorId(userId: number, authorId?: number): Promise<Post[]> {
    try {
      let posts: Post[];
      if (authorId && authorId !== userId) {
        posts = await this.postRepository.find({
          where: { authorId, blocked: false },
          order: { createdAt: { direction: 'ASC' } },
          relations: [
            'comments',
            'comments.likes',
            'comments.dislikes',
            'comments.author',
            'likes',
            'dislikes',
            'author',
            'tags',
          ],
        });
      } else {
        posts = await this.postRepository.find({
          where: { authorId },
          order: { createdAt: { direction: 'ASC' } },
          relations: [
            'comments',
            'comments.likes',
            'comments.dislikes',
            'comments.author',
            'likes',
            'dislikes',
            'author',
            'tags',
            'blockes',
            'unblockes',
          ],
        });
      }
      return posts;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getPostsByTagId(tagId: number): Promise<Post[]> {
    try {
      const posts = await this.postRepository.find({
        where: { tags: { id: tagId }, blocked: false },
        relations: [
          'comments',
          'comments.likes',
          'comments.dislikes',
          'comments.author',
          'likes',
          'dislikes',
          'author',
          'tags',
        ],
      });
      if (!Boolean(posts.length)) {
        // throw exception
      }
      return posts;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    updatePostRequestBody: UpdatePostRequestBody,
    postId: number,
    authorId: number,
  ): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId, blocked: false },
      });
      if (!post) {
        // throw exception
      }
      if (post.authorId !== authorId) {
        // throw exception
      }
      return await this.postRepository.save({
        id: postId,
        ...updatePostRequestBody,
      });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(postId: number, authorId: number): Promise<void> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId, blocked: false },
      });
      if (!post) {
        // throw exception
      }
      if (post.authorId !== authorId) {
        // throw exception
      }
      await this.postRepository.delete({ id: postId });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async like(postId: number, userId: number): Promise<void> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['likes'],
      });
      if (!post) {
        // throw exception
      }
      if (post.blocked) {
        // throw exception
      }
      if (post.authorId === userId) {
        // throw exception
      }
      const hasLiked = Boolean(
        post?.likes && post.likes.find((like) => like.userId === userId),
      );
      if (hasLiked) {
        // throw exception
      }
      await this.postLikeRepository.save({ postId, userId });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async dislike(postId: number, userId: number): Promise<void> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['likes'],
      });
      if (!post) {
        // throw exception
      }
      if (post.blocked) {
        // throw exception
      }
      if (post.authorId === userId) {
        // throw exception
      }
      const hasDisliked = Boolean(
        post?.dislikes && post.dislikes.find((like) => like.userId === userId),
      );
      if (hasDisliked) {
        // throw exception
      }
      await this.postLikeRepository.save({ postId, userId });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getRecommended(userId: number): Promise<Post[]> {
    try {
      const alreadyLiked = await this.postRepository.find({
        where: { likes: { userId }, authorId: Not(userId), blocked: false },
      });
      const authorsIds = alreadyLiked?.map((post) => post.authorId) ?? [];
      const posts = await this.postRepository.find({
        where: { authorId: In(authorsIds), likes: { userId: Not(userId) } },
      });
      return posts;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
