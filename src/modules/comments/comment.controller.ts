import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { Authenticated, Validated } from '../common/decorators';
import { User } from 'src/entities';
import { CreateCommentRequestBody, UpdateCommentRequestBody } from './requests';
import { CommentDto } from './dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('')
  @Authenticated()
  @Validated()
  @HttpCode(200)
  async create(
    @Req() req: Request & { user: User },
    @Body() createCommentRequestBody: CreateCommentRequestBody,
  ): Promise<CommentDto> {
    const comment = await this.commentService.create(
      createCommentRequestBody,
      req.user.id,
    );
    return CommentDto.fromEntity(comment);
  }

  @Get('')
  @Authenticated()
  @HttpCode(200)
  async getCommentsByPostId(
    @Query('postId', ParseIntPipe) postId: number,
  ): Promise<CommentDto[]> {
    const comments = await this.commentService.getByPostId(postId);
    return comments.map(CommentDto.fromEntity);
  }

  @Patch(':id')
  @Authenticated()
  @Validated()
  @HttpCode(200)
  async update(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentRequestBody: UpdateCommentRequestBody,
  ): Promise<CommentDto> {
    const comment = await this.commentService.update(
      id,
      updateCommentRequestBody,
      req.user.id,
    );
    return CommentDto.fromEntity(comment);
  }

  @Delete(':id')
  @Authenticated()
  @HttpCode(204)
  async delete(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.commentService.delete(id, req.user.id);
  }

  @Post(':id/like')
  @Authenticated()
  @HttpCode(200)
  async like(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommentDto> {
    const comment = await this.commentService.like(id, req.user.id);
    return CommentDto.fromEntity(comment);
  }

  @Post(':id/dislike')
  @Authenticated()
  @HttpCode(200)
  async dislike(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CommentDto> {
    const comment = await this.commentService.dislike(id, req.user.id);
    return CommentDto.fromEntity(comment);
  }
}
