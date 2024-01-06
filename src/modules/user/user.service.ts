import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Request, Response } from 'express';
import {
  EmailVerifyToken,
  PasswordResetToken,
  PostLike,
  User,
} from 'src/entities';
import { And, In, LessThanOrEqual, Not, Repository } from 'typeorm';
import {
  CreateResetPasswordRequestBody,
  SignUpUserRequestBody,
  UpdateUserRequestBody,
  UseResetPasswordRequestBody,
} from './requests';
import { hash, compare } from 'bcrypt';
import { AuthService, TokenService } from '../common/services';
import { FOLLOWERS_ACHIEVEMENTS } from '../common/constants';
import { BusinessException, ErrorCode } from '../common/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(EmailVerifyToken)
    private readonly emailVerifyTokenRepository: Repository<EmailVerifyToken>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {
    dayjs.extend(utc);
  }

  async signUp(
    res: Response,
    signUpUserRequestBody: SignUpUserRequestBody,
  ): Promise<User> {
    let existingUser: User | undefined;
    existingUser = await this.userRepository.findOne({
      where: { email: signUpUserRequestBody.email },
    });

    if (Boolean(existingUser)) {
      throw new BusinessException(ErrorCode.EMAIL_ALREADY_TAKEN);
    }

    existingUser = await this.userRepository.findOne({
      where: { username: signUpUserRequestBody.username },
    });

    if (Boolean(existingUser)) {
      throw new BusinessException(ErrorCode.USERNAME_ALREADY_TAKEN);
    }

    const passwordHash = await hash(signUpUserRequestBody.password, 10);
    const user = await this.userRepository.save({
      username: signUpUserRequestBody.username,
      email: signUpUserRequestBody.email,
      name: signUpUserRequestBody.name,
      password: passwordHash,
    });

    const token = this.tokenService.create();
    await this.emailVerifyTokenRepository.save({ userId: user.id, token });

    const { refreshToken } = this.authService.setHeaders(res, user.id);
    await this.setRefreshToken(refreshToken, user.id);
    return user;
  }

  async update(body: UpdateUserRequestBody, userId: number): Promise<User> {
    try {
      const user = await this.getById(userId);
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      if (user.id !== userId) {
        throw new BusinessException(ErrorCode.DONT_HAVE_PERMISSION);
      }
      const isPasswordBeingUpdated = Boolean(body?.password);
      const passwordHash: string | null = isPasswordBeingUpdated
        ? await hash(body.password, 10)
        : null;

      const isEmailBeingUpdated = Boolean(body?.email);
      if (isEmailBeingUpdated) {
        const token = this.tokenService.create();
        await this.emailVerifyTokenRepository.save({ userId, token });
      }

      const partialUserEntity: Partial<User> = {
        ...user,
        ...body,
      };

      if (isPasswordBeingUpdated) {
        partialUserEntity['password'] = passwordHash;
      }

      if (isEmailBeingUpdated) {
        partialUserEntity['email'] = body.email;
      }

      return await this.userRepository.save(partialUserEntity);
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(req: Request & { user: User }, res: Response): Promise<User> {
    try {
      const { refreshToken } = this.authService.setHeaders(res, req.user.id);
      await this.setRefreshToken(refreshToken, req.user.id);
      return req.user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async signOut(req: Request & { user: User }, res: Response): Promise<User> {
    try {
      this.authService.setHeaders(res, undefined, true);
      const user = await this.getById(req.user.id);
      this.dropRefreshToken(user.id);
      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async refresh(req: Request & { user: User }, res: Response): Promise<User> {
    try {
      const { refreshToken } = this.authService.setHeaders(res, req.user.id);
      await this.setRefreshToken(refreshToken, req.user.id);
      return req.user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async validateByCredentials(email: string, password: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email, blocked: false },
      });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      const isPassMatching = await compare(password, user.password);
      if (!isPassMatching) {
        throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
      }
      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, blocked: false },
      });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email, blocked: false },
      });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getPublicUserInfoById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, blocked: false },
        relations: ['followers', 'following'],
      });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async setRefreshToken(
    plainRefreshToken: string,
    userId: number,
  ): Promise<void> {
    try {
      const refreshToken = await hash(plainRefreshToken, 10);
      await this.userRepository.update({ id: userId }, { refreshToken });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async dropRefreshToken(userId: number): Promise<void> {
    try {
      await this.userRepository.update({ id: userId }, { refreshToken: null });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    try {
      const user = await this.getById(userId);
      const isRefreshTokenMatching = await compare(
        refreshToken,
        user.refreshToken,
      );
      if (!Boolean(isRefreshTokenMatching)) {
        throw new BusinessException(ErrorCode.USER_IS_UNAUTHORIZED);
      }
      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async followUserById(user: User, userIdToFollow: number): Promise<void> {
    try {
      const userWithFollowings = await this.userRepository.findOne({
        where: { id: user.id, blocked: false },
        relations: ['following'],
      });
      const userInFollowings = userWithFollowings.following.find(
        (user) => user.id === userIdToFollow,
      );
      if (Boolean(userInFollowings)) {
        throw new BusinessException(ErrorCode.ALREADY_FOLLOWED_USER);
      }
      const userToFollow = await this.getById(userIdToFollow);
      const newFollowings = [...userWithFollowings.following, userToFollow];
      await this.checkFollowingsToCongratulateUser(newFollowings.length);
      await this.userRepository.update(
        { id: userWithFollowings.id },
        { following: newFollowings },
      );
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async unFollowUserById(user: User, userIdToUnFollow: number): Promise<void> {
    try {
      const userWithFollowings = await this.userRepository.findOne({
        where: { id: user.id, blocked: false },
        relations: ['following'],
      });
      const userInFollowings = userWithFollowings.following.find(
        (user) => user.id === userIdToUnFollow,
      );
      if (!Boolean(userInFollowings)) {
        throw new BusinessException(ErrorCode.ALREADY_UNFOLLOWED_USER);
      }
      const userToUnFollow = await this.getById(userIdToUnFollow);
      await this.userRepository.update(
        { id: userWithFollowings.id },
        {
          following: userInFollowings.following.filter(
            (user) => user.id !== userToUnFollow.id,
          ),
        },
      );
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createResetPasswordToken(
    body: CreateResetPasswordRequestBody,
  ): Promise<void> {
    try {
      const user = await this.getByEmail(body.email);
      const existingToken = await this.passwordResetTokenRepository.findOne({
        where: { userId: user.id, expired: false, used: false },
      });
      if (existingToken) {
        throw new BusinessException(ErrorCode.RESET_PASSWORD_TOKEN_EXISTS);
      }
      const token = this.tokenService.create();
      await this.passwordResetTokenRepository.save({ userId: user.id, token });
      // handle emailing reset password token
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createEmailVerifyToken(email: string): Promise<void> {
    try {
      const user = await this.getByEmail(email);
      const existingToken = await this.emailVerifyTokenRepository.findOne({
        where: { userId: user.id, expired: false, used: false },
      });
      if (existingToken) {
        throw new BusinessException(ErrorCode.EMAIL_VERIFY_TOKEN_EXISTS);
      }
      const token = this.tokenService.create();
      await this.emailVerifyTokenRepository.save({ userId: user.id, token });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async useResetPasswordToken(
    body: UseResetPasswordRequestBody,
    token: string,
  ): Promise<void> {
    try {
      const resetPasswordToken =
        await this.passwordResetTokenRepository.findOne({ where: { token } });
      if (!resetPasswordToken) {
        throw new BusinessException(ErrorCode.RESET_PASSWORD_TOKEN_NOT_FOUND);
      }
      if (resetPasswordToken.used) {
        throw new BusinessException(ErrorCode.RESET_PASSWORD_TOKEN_USED);
      }
      if (resetPasswordToken.expired) {
        throw new BusinessException(ErrorCode.RESET_PASSWORD_TOKEN_EXPIRED);
      }
      await this.passwordResetTokenRepository.update(
        {
          id: resetPasswordToken.id,
        },
        { used: true },
      );
      const passwordHash = await hash(body.password, 10);
      await this.userRepository.update(
        { id: resetPasswordToken.userId },
        { password: passwordHash },
      );
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async useEmailVerifyToken(token: string): Promise<void> {
    try {
      const emailVerifyToken = await this.emailVerifyTokenRepository.findOne({
        where: { token },
      });
      if (!emailVerifyToken) {
        throw new BusinessException(ErrorCode.EMAIL_VERIFY_TOKEN_NOT_FOUND);
      }
      if (emailVerifyToken.expired) {
        throw new BusinessException(ErrorCode.EMAIL_VERIFY_TOKEN_EXPIRED);
      }
      if (emailVerifyToken.used) {
        throw new BusinessException(ErrorCode.EMAIL_VERIFY_TOKEN_USED);
      }
      await this.emailVerifyTokenRepository.update(
        { id: emailVerifyToken.id },
        { used: true },
      );
      await this.userRepository.update(
        { id: emailVerifyToken.userId },
        { emailVerified: true },
      );
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getRecommendedAuthors(userId: number): Promise<User[]> {
    try {
      const postLikes = await this.postLikeRepository.find({
        where: { userId },
        relations: ['post'],
      });
      const authorsIds = postLikes.map((like) => like.post.authorId);
      const authors = await this.userRepository.find({
        where: {
          id: And(In(authorsIds), Not(userId)),
          followers: { id: Not(userId) },
          blocked: false,
        },
        relations: ['followers'],
      });
      return authors;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async checkFollowingsToCongratulateUser(
    followersAmount: number,
  ): Promise<void> {
    try {
      for (const stringAmount of Object.keys(FOLLOWERS_ACHIEVEMENTS)) {
        const amount = parseInt(stringAmount, 10);
        if (amount === followersAmount) {
          // send congratulation on email
        }
      }
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateTokens() {
    try {
      const createdAtToBeExpired = dayjs.utc().subtract(24, 'hour').toDate();
      const expiredPasswordTokens =
        await this.passwordResetTokenRepository.find({
          where: { createdAt: LessThanOrEqual(createdAtToBeExpired) },
        });
      const expiredEmailTokens = await this.emailVerifyTokenRepository.find({
        where: { createdAt: LessThanOrEqual(createdAtToBeExpired) },
      });
      const promises = [
        ...expiredPasswordTokens.map((token) =>
          this.passwordResetTokenRepository.update(
            { id: token.id },
            { expired: true },
          ),
        ),
        ,
        ...expiredEmailTokens.map((token) =>
          this.emailVerifyTokenRepository.update(
            { id: token.id },
            { expired: true },
          ),
        ),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async deleteExpiredTokens() {
    try {
      const createdAtToBeExpired = dayjs.utc().subtract(72, 'hour').toDate();
      const expiredPasswordTokens =
        await this.passwordResetTokenRepository.find({
          where: {
            createdAt: LessThanOrEqual(createdAtToBeExpired),
            expired: true,
          },
        });
      const expiredEmailTokens = await this.emailVerifyTokenRepository.find({
        where: {
          createdAt: LessThanOrEqual(createdAtToBeExpired),
          expired: true,
        },
      });
      const promises = [
        ...expiredPasswordTokens.map((token) =>
          this.passwordResetTokenRepository.delete({ id: token.id }),
        ),
        ,
        ...expiredEmailTokens.map((token) =>
          this.emailVerifyTokenRepository.delete({ id: token.id }),
        ),
      ];
      await Promise.all(promises);
    } catch (error) {
      console.log(error);
    }
  }
}
