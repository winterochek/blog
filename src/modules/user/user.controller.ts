import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  SignUpUserRequestBody,
  SignInUserRequestBody,
  CreateResetPasswordRequestBody,
  UseResetPasswordRequestBody,
  UpdateUserRequestBody,
} from './requests';
import { PublicUserDto, UserDto } from './dto';
import { Local, Refresh } from './decorators';
import { Authenticated, Validated } from '../common/decorators';
import { User } from 'src/entities';
import { Request, Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @HttpCode(200)
  @Validated()
  async signUp(
    @Res() res: Response,
    @Body() registerUserRequestBody: SignUpUserRequestBody,
  ): Promise<UserDto> {
    const user = await this.userService.signUp(res, registerUserRequestBody);
    return UserDto.fromEntity(user);
  }

  @Post('sign-in')
  @HttpCode(200)
  @Validated()
  @Local()
  async signIn(
    @Req() req: Request & { user: User },
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _: SignInUserRequestBody,
  ) {
    const user = await this.userService.signIn(req, res);
    return UserDto.fromEntity(user);
  }

  @Get('')
  @HttpCode(200)
  @Authenticated()
  me(@Req() req: Request & { user: User }): UserDto {
    return UserDto.fromEntity(req.user);
  }

  @Get('recommended')
  @HttpCode(200)
  @Authenticated()
  async recommended(
    @Req() req: Request & { user: User },
  ): Promise<PublicUserDto[]> {
    const authors = await this.userService.getRecommendedAuthors(req.user.id);
    return authors.map((author) => PublicUserDto.fromEntity(author));
  }

  @Get(':id')
  @HttpCode(200)
  @Authenticated()
  async getPublicUserInfo(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getPublicUserInfoById(id);
    return PublicUserDto.fromEntity(user);
  }

  @Patch(':id')
  @HttpCode(200)
  @Authenticated()
  async update(
    @Req() req: Request & { user: User },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRequestBody: UpdateUserRequestBody,
  ): Promise<UserDto> {
    const user = await this.userService.update(
      updateUserRequestBody,
      req.user.id,
    );
    return UserDto.fromEntity(user);
  }

  @Post('sign-out')
  @HttpCode(201)
  @Authenticated()
  async signOut(
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ): Promise<UserDto> {
    const user = await this.userService.signOut(req, res);
    return UserDto.fromEntity(user);
  }

  @Post('refresh-token')
  @HttpCode(200)
  @Refresh()
  async refresh(@Req() req: Request & { user: User }, @Res() res: Response) {
    const user = await this.userService.refresh(req, res);
    return UserDto.fromEntity(user);
  }

  @Post('reset-password')
  @HttpCode(201)
  @Validated()
  createResetPasswordToken(
    @Body() createResetPasswordRequestBody: CreateResetPasswordRequestBody,
  ): Promise<void> {
    return this.userService.createResetPasswordToken(
      createResetPasswordRequestBody,
    );
  }

  @Post('reset-password/:token')
  @HttpCode(200)
  @Validated()
  useResetPasswordToken(
    @Body() useResetPasswordRequestBody: UseResetPasswordRequestBody,
    @Param('token') token: string,
  ): Promise<void> {
    return this.userService.useResetPasswordToken(
      useResetPasswordRequestBody,
      token,
    );
  }

  @Post('verify-email')
  @HttpCode(201)
  @Authenticated()
  createEmailVerifyToken(@Req() req: Request & { user: User }): Promise<void> {
    return this.userService.createEmailVerifyToken(req.user.email);
  }

  @Post('verify-email/:token')
  @HttpCode(201)
  useEmailVerifyToken(@Param('token') token: string): Promise<void> {
    return this.userService.useEmailVerifyToken(token);
  }
}
