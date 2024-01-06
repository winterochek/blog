import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { UserBlockDto, UserDto } from '../user/dto';
import { Admin } from 'src/entities';
import {
  GetUsersQueryOptions,
  PostBlockRequestBody,
  PostUnblockRequestBody,
  SignInAdminRequestBody,
  SignUpAdminRequestBody,
  UpdateUserEmailRequestBody,
  UserBlockRequestBody,
  UserUnblockRequestBody,
} from './requests';
import { AdminDto, PostBlockDto, PostUnblockDto, UserUnblockDto } from './dto';
import { Local } from '../user/decorators';
import { Validated } from '../common/decorators';
import { Authenticated } from './decorators';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('sign-up')
  @HttpCode(200)
  @Validated()
  async signUp(
    @Res() res: Response,
    @Body() registerAdminRequestBody: SignUpAdminRequestBody,
  ): Promise<AdminDto> {
    const admin = await this.adminService.signUp(res, registerAdminRequestBody);
    return AdminDto.fromEntity(admin);
  }

  @Post('sign-in')
  @HttpCode(200)
  @Validated()
  @Local()
  async signIn(
    @Req() req: Request & { admin: Admin },
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _: SignInAdminRequestBody,
  ): Promise<AdminDto> {
    const admin = await this.adminService.signIn(req, res);
    return AdminDto.fromEntity(admin);
  }

  @Post('sign-out')
  @HttpCode(200)
  @Authenticated()
  async signOut(
    @Req() req: Request & { admin: Admin },
    @Res() res: Response,
  ): Promise<AdminDto> {
    const admin = await this.adminService.signOut(req, res);
    return AdminDto.fromEntity(admin);
  }

  @Get('users/:id')
  @Authenticated()
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.adminService.getUserByID(id);
    return UserDto.fromEntity(user);
  }

  @Get('users')
  @Authenticated()
  async getUsers(@Query() queries: GetUsersQueryOptions): Promise<UserDto[]> {
    const users = await this.adminService.getAllUsers(queries);
    return users.map(UserDto.fromEntity);
  }

  @Post('users/:id/block')
  @Authenticated()
  async blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { admin: Admin },
    @Body() userBlockRequestBody: UserBlockRequestBody,
  ): Promise<UserBlockDto> {
    const userBlock = await this.adminService.blockUserByID(
      id,
      req.admin.id,
      userBlockRequestBody.reason,
    );
    return UserBlockDto.fromEntity(userBlock);
  }

  @Post('users/:id/unblock')
  @Authenticated()
  async unblockUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { admin: Admin },
    @Body() userUnblockRequestBody: UserUnblockRequestBody,
  ): Promise<UserUnblockDto> {
    const userUnblock = await this.adminService.unBlockUserByID(
      id,
      req.admin.id,
      userUnblockRequestBody.reason,
    );
    return UserUnblockDto.fromEntity(userUnblock);
  }

  @Post('users/:id/verify-email')
  @Authenticated()
  async verifyUserEmail(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.verifyUserEmail(id);
  }

  @Post('users/:id/change-email')
  @Authenticated()
  async changeUserEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserEmailRequestBody: UpdateUserEmailRequestBody,
  ): Promise<UserDto> {
    const user = await this.adminService.changeUserEmail(
      id,
      updateUserEmailRequestBody.email,
    );
    return UserDto.fromEntity(user);
  }

  @Post('posts/:id/block')
  @Authenticated()
  async postBlock(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { admin: Admin },
    @Body() postBlockRequestBody: PostBlockRequestBody,
  ): Promise<PostBlockDto> {
    const postBlock = await this.adminService.blockPostByID(
      id,
      req.admin.id,
      postBlockRequestBody.reason,
    );
    return PostBlockDto.fromEntity(postBlock);
  }

  @Post('posts/:id/unblock')
  @Authenticated()
  async postUnblock(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { admin: Admin },
    @Body() postUnblockRequestBody: PostUnblockRequestBody,
  ): Promise<PostBlockDto> {
    const postUnblock = await this.adminService.unBlockPostByID(
      id,
      req.admin.id,
      postUnblockRequestBody.reason,
    );
    return PostUnblockDto.fromEntity(postUnblock);
  }
}
