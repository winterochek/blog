import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [CommonModule],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
