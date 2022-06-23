import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { SetBoardDto } from './dto/board-set.dto';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('BOARD API')
@Controller('board/:username')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  // 게시글 작성
  @ApiOperation({
    summary: '다이어리 글 작성',
    description: '게시글 작성 시 생성 역할 api\n이모티콘 경로 리스트 포함',
  })
  @ApiBody({ type: SetBoardDto })
  @Post('/create')
  async createBoard(
    @Param('username') username: string,
    @Body() createBoardDto: SetBoardDto,
  ): Promise<string> {
    return await this.boardService.boardCreate(username, createBoardDto);
  }
  
  // 게시글 삭제
  @Delete('/delete/:id')
  async deleteBoard(
    @Param('username') username: string,
    @Param('id', ParseIntPipe) boardId: number
  ) {
    return await this.boardService.boardDelete(boardId);
  }
  
  // 게시글 수정
  @Put('/update/:id')
  async updateBoard(
    @Param('username') username: string,
    @Param('id', ParseIntPipe) boardId: number,
    @Body() uploadBoardDto: SetBoardDto
  ) {
    return await this.boardService.boardUpdate(boardId, uploadBoardDto);
  }

  // 게시글 조회
  @Get('/read/:id')
  async readBoard(
    @Param('username') username: string,
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return await this.boardService.boardRead(boardId);
  }

  // 게시글 전체 조회
  @Get('/read')
  async allReadBoard(
    @Param('username') username: string,
    @Query('month') month: number
  ) {
    return await this.boardService.boardAllRead(username, month);
  }
}