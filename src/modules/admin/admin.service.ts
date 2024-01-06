import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response, Request } from 'express';
import { compare, hash } from 'bcrypt';
import {
  Admin,
  EmailVerifyToken,
  Post,
  PostBlock,
  PostUnBlock,
  User,
  UserBlock,
  UserUnBlock,
} from 'src/entities';
import { Repository } from 'typeorm';
import { GetUsersQueryOptions, SignUpAdminRequestBody } from './requests';
import { AuthService, TokenService } from '../common/services';
import { BusinessException, ErrorCode } from '../common/exceptions';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(UserBlock)
    private readonly userBlockRepository: Repository<UserBlock>,
    @InjectRepository(UserUnBlock)
    private readonly userUnBlockRepository: Repository<UserUnBlock>,
    @InjectRepository(PostBlock)
    private readonly postBlockRepository: Repository<PostBlock>,
    @InjectRepository(PostUnBlock)
    private readonly postUnBlockRepository: Repository<PostUnBlock>,
    @InjectRepository(EmailVerifyToken)
    private readonly emailVerifyTokenRepository: Repository<EmailVerifyToken>,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(
    res: Response,
    signUpAdminRequestBody: SignUpAdminRequestBody,
  ): Promise<Admin> {
    try {
      const existingAdmin = await this.adminRepository.findOne({
        where: { email: signUpAdminRequestBody.email },
      });

      if (Boolean(existingAdmin)) {
        throw new BusinessException(ErrorCode.EMAIL_ALREADY_TAKEN);
      }

      const passwordHash = await hash(signUpAdminRequestBody.password, 10);
      const admin = await this.adminRepository.save({
        email: signUpAdminRequestBody.email,
        name: signUpAdminRequestBody.name,
        password: passwordHash,
      });

      const { refreshToken } = this.authService.setHeaders(res, admin.id);
      await this.setRefreshToken(refreshToken, admin.id);
      return admin;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(req: Request & { admin: Admin }, res: Response): Promise<Admin> {
    try {
      const { refreshToken } = this.authService.setHeaders(res, req.admin.id);
      await this.setRefreshToken(refreshToken, req.admin.id);
      return req.admin;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async signOut(
    req: Request & { admin: Admin },
    res: Response,
  ): Promise<Admin> {
    try {
      this.authService.setHeaders(res, undefined, true);
      const user = await this.getById(req.admin.id);
      this.dropRefreshToken(user.id);
      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(adminId: number) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id: adminId },
      });

      return admin;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, adminId: number) {
    try {
      const admin = await this.getById(adminId);
      const isRefreshTokenMatching = await compare(
        refreshToken,
        admin.refreshToken,
      );
      if (!Boolean(isRefreshTokenMatching)) {
        // throw exception
      }

      return admin;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserByID(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: [
          'posts',
          'comments',
          'postLikes',
          'postDislikes',
          'commentLikes',
          'commentDislikes',
          'userBlocks',
          'userUnBlocks',
          'passwordResetTokens',
          'emailVerifyTokens',
          'followers',
          'following',
        ],
      });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(queries: GetUsersQueryOptions): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        where: { blocked: queries.blocked },
        relations: [
          'posts',
          'comments',
          'postLikes',
          'postDislikes',
          'commentLikes',
          'commentDislikes',
          'userBlocks',
          'userUnBlocks',
          'passwordResetTokens',
          'emailVerifyTokens',
          'followers',
          'following',
        ],
      });

      return users;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async blockUserByID(
    userId: number,
    adminId: number,
    reason: string,
  ): Promise<UserBlock> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      if (user.blocked) {
        // handle exception
      }
      const userBlock = await this.userBlockRepository.save({
        userId,
        adminId,
        reason,
      });

      await this.userRepository.update({ id: userId }, { blocked: true });

      return userBlock;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async unBlockUserByID(
    userId: number,
    adminId: number,
    reason: string,
  ): Promise<UserUnBlock> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      if (!user.blocked) {
        // handle exception
      }
      const userUnBlock = await this.userUnBlockRepository.save({
        userId,
        adminId,
        reason,
      });

      await this.userRepository.update({ id: userId }, { blocked: false });

      return userUnBlock;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async blockPostByID(
    postId: number,
    adminId: number,
    reason: string,
  ): Promise<PostBlock> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        // handle exception
      }
      if (post.blocked) {
        // handle exception
      }
      const postBlock = await this.postBlockRepository.save({
        postId,
        adminId,
        reason,
      });
      await this.postRepository.update({ id: postId }, { blocked: true });

      return postBlock;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async unBlockPostByID(
    postId: number,
    adminId: number,
    reason: string,
  ): Promise<PostUnBlock> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        // handle exception
      }
      if (!post.blocked) {
        // handle exception
      }
      const postUnBlock = await this.postUnBlockRepository.save({
        postId,
        adminId,
        reason,
      });
      await this.postRepository.update({ id: postId }, { blocked: false });

      return postUnBlock;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async validateByCredentials(email: string, password: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOne({ where: { email } });
      if (!admin) {
        // throw exception
      }
      const isPassMatching = await compare(password, admin.password);
      if (!isPassMatching) {
        // throw exception
      }
      return admin;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyUserEmail(userId: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      if (user.emailVerified) {
        // throw exception
      }
      await this.userRepository.update({ id: userId }, { emailVerified: true });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async changeUserEmail(userId: number, email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND);
      }
      if (user.blocked) {
        // throw exception
      }
      const token = this.tokenService.create();
      await this.emailVerifyTokenRepository.save({ userId, token });
      const updatedUser = await this.userRepository.save({
        ...user,
        emailVerified: false,
        email,
      });
      return updatedUser;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async setRefreshToken(
    plainRefreshToken: string,
    adminId: number,
  ): Promise<void> {
    try {
      const refreshToken = await hash(plainRefreshToken, 10);
      await this.adminRepository.update({ id: adminId }, { refreshToken });
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async dropRefreshToken(adminId: number): Promise<void> {
    try {
      await this.adminRepository.update(
        { id: adminId },
        { refreshToken: null },
      );
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
