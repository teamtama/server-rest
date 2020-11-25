import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityInput } from './dto/create-community.dto';
import { UpdateCommunityInput } from './dto/update-community.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { AuthenticateGuard } from '../common/guards/authenticate.guard';
import { Public } from '../common/decorators/public.decorator';
import { CreateCommunityCommentInput } from './dto/create-community-comment.dto';
import { UpdateCommunityCommentInput } from './dto/update-community-comment.dto';

@UseGuards(AuthenticateGuard)
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  createCommunity(
    @Req() req,
    @Body() createCommunityInput: CreateCommunityInput,
  ) {
    const user = req.user;
    return this.communityService.createCommunity(user, createCommunityInput);
  }

  @Patch(':communityId')
  updateCommunity(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Req() req,
    @Body() updateCommunityInput: UpdateCommunityInput,
  ) {
    const user = req.user;
    return this.communityService.updateCommunity(
      communityId,
      user,
      updateCommunityInput,
    );
  }

  @Delete(':communityId')
  deleteCommunity(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Req() req,
  ) {
    const user = req.user;
    return this.communityService.deleteCommunity(communityId, user);
  }

  @Public()
  @Get()
  getCommunityList() {
    return this.communityService.getCommunityList();
  }

  @Public()
  @Get(':communityId')
  getCommunity(@Param('communityId', ParseIntPipe) communityId: number) {
    return this.communityService.getCommunity(communityId);
  }

  @Post(':communityId/comment')
  createComment(
    @Param('communityId', ParseIntPipe) communityId: number,
    @Req() req,
    @Body() createCommunityCommentInput: CreateCommunityCommentInput,
  ) {
    const user = req.user;
    return this.communityService.createComment(
      communityId,
      user,
      createCommunityCommentInput,
    );
  }

  @Patch(':communityId/comment/:commentId')
  updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
    @Body() updateCommunityCommentInput: UpdateCommunityCommentInput,
  ) {
    const user = req.user;
    return this.communityService.updateComment(
      commentId,
      user,
      updateCommunityCommentInput,
    );
  }

  @Delete(':communityId/comment/:commentId')
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
  ) {
    const user = req.user;
    return this.communityService.deleteComment(commentId, user);
  }

  @Post(':communityId/like')
  like(@Param('communityId', ParseIntPipe) communityId: number, @Req() req) {
    const user = req.user;
    return this.communityService.like(communityId, user);
  }

  @Delete(':communityId/unlike')
  unlike(@Param('communityId', ParseIntPipe) communityId: number, @Req() req) {
    const user = req.user;
    return this.communityService.unlike(communityId, user);
  }
}
