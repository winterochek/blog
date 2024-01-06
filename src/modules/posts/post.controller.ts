import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Authenticated, Validated } from '../common/decorators';
import { CreatePostRequestBody, UpdatePostRequestBody } from './requests';
import { User } from 'src/entities';
import { PostDto } from './dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  @HttpCode(200)
  @Authenticated()
  @Validated()
  async create(
    @Req() req: Request & { user: User },
    @Body() createPostRequestBody: CreatePostRequestBody,
  ): Promise<PostDto> {
    const post = await this.postService.create(
      createPostRequestBody,
      req.user.id,
    );
    return PostDto.fromEntity(post);
  }

  @Patch(':id')
  @HttpCode(200)
  @Authenticated()
  @Validated()
  async update(
    @Req() req: Request & { user: User },
    @Body() updatePostRequestBody: UpdatePostRequestBody,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostDto> {
    const post = await this.postService.update(
      updatePostRequestBody,
      id,
      req.user.id,
    );
    return PostDto.fromEntity(post);
  }

  @Get(':id')
  @HttpCode(200)
  @Authenticated()
  async getOne(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostDto> {
    const post = await this.postService.getPostById(id, req.user.id);
    return PostDto.fromEntity(post);
  }

  @Post(':id/like')
  @HttpCode(200)
  @Authenticated()
  async like(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.postService.like(id, req.user.id);
  }

  @Post(':id/dislike')
  @HttpCode(200)
  @Authenticated()
  async dislike(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.postService.dislike(id, req.user.id);
  }

  @Get('me')
  @HttpCode(200)
  @Authenticated()
  async getMine(@Req() req: Request & { user: User }): Promise<PostDto[]> {
    const posts = await this.postService.getPostsByAuthorId(req.user.id);
    return posts.map(PostDto.fromEntity);
  }

  @Get('recommended')
  @HttpCode(200)
  @Authenticated()
  async recommended(@Req() req: Request & { user: User }): Promise<PostDto[]> {
    const posts = await this.postService.getRecommended(req.user.id);
    return posts.map((post) => PostDto.fromEntity(post));
  }

  @Get('')
  @HttpCode(200)
  @Authenticated()
  async getPostsByUserId(
    @Req() req: Request & { user: User },
    @Query('authorId', ParseIntPipe) authorId: number,
  ): Promise<PostDto[]> {
    const posts = await this.postService.getPostsByAuthorId(
      req.user.id,
      authorId,
    );
    return posts.map(PostDto.fromEntity);
  }
}
