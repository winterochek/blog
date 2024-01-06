import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CommentDislike,
  CommentLike,
  EmailVerifyToken,
  PasswordResetToken,
  Post,
  PostBlock,
  PostDislike,
  PostLike,
  PostUnBlock,
  Tag,
  User,
  UserBlock,
  UserUnBlock,
} from './entities';
import { UserModule } from './modules';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from './modules/common/common.module';
import { PostModule } from './modules/posts/post.module';
import { CommentModule } from './modules/comments/comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [
        User,
        Post,
        Comment,
        PostLike,
        PostDislike,
        CommentLike,
        CommentDislike,
        UserBlock,
        UserUnBlock,
        PostBlock,
        PostUnBlock,
        Tag,
        PasswordResetToken,
        EmailVerifyToken,
      ],
      synchronize: true,
    }),
    PassportModule,
    JwtModule.register({ secret: '123', signOptions: { expiresIn: '60s' } }),
    CommonModule,
    UserModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
