import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, CommentDislike, CommentLike } from 'src/entities';
import { Repository } from 'typeorm';
import { PostService } from '../posts/post.service';
import { CreateCommentRequestBody, UpdateCommentRequestBody } from './requests';
import { BusinessException, ErrorCode } from '../common/exceptions';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postService: PostService,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(CommentDislike)
    private readonly commentDislikeRepository: Repository<CommentDislike>,
  ) {}

  async create(
    body: CreateCommentRequestBody,
    authorId: number,
  ): Promise<Comment> {
    try {
      const post = await this.postService.getPostById(body.postId);
      if (!post) {
        // throw exception
      }
      const comment = await this.commentRepository.save({ ...body, authorId });
      return comment;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    commentId: number,
    body: UpdateCommentRequestBody,
    authorId: number,
  ): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId, postId: body.postId },
      });
      if (!comment) {
        // throw exception
      }
      if (comment.authorId !== authorId) {
        // throw exception
      }
      return await this.commentRepository.save({ ...comment, ...body });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(commentId: number, authorId: number): Promise<void> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });
      if (!comment) {
        // throw exception
      }
      if (comment.authorId !== authorId) {
        // throw exception
      }
      await this.commentRepository.delete({ id: commentId });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async like(commentId: number, authorId: number): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['likes', 'dislikes'],
      });
      if (!comment) {
        // throw exception
      }
      if (comment.authorId !== authorId) {
        // throw exception
      }
      const hasLiked =
        Boolean(comment?.likes && comment.likes.length) &&
        Boolean(comment.likes.find((like) => like.userId === authorId));
      if (hasLiked) {
        // throw exception
      }
      await this.commentLikeRepository.save({ commentId, userId: authorId });
      return await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['likes', 'dislikes'],
      });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async dislike(commentId: number, authorId: number): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['likes', 'dislikes'],
      });
      if (!comment) {
        // throw exception
      }
      if (comment.authorId !== authorId) {
        // throw exception
      }
      const hasDisliked =
        Boolean(comment?.dislikes && comment.dislikes.length) &&
        Boolean(
          comment.dislikes.find((dislike) => dislike.userId === authorId),
        );
      if (hasDisliked) {
        // throw exception
      }
      await this.commentDislikeRepository.save({ commentId, userId: authorId });
      return await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['likes', 'dislikes'],
      });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getByPostId(postId: number): Promise<Comment[]> {
    try {
      //  handle 404 case
      await this.postService.getPostById(postId);
      const comments = await this.commentRepository.find({
        where: { postId },
        relations: ['author', 'likes', 'dislikes'],
      });
      if (!comments || !comments.length) {
        // throw exception
      }
      return comments;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
