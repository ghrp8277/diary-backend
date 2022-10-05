import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserMember } from 'src/auth/entities/user-member.entity';
import { EntityManager } from 'typeorm';
import { SetBoardDto } from './dto/board-set.dto';
import { Board } from './entities/board.entity';
import { BoardInterface } from './interface/board.interface';
import { EmotionInterface } from './interface/emotion.interface';
import { BoardRepository } from './repository/board.repository';
import { EmotionFileRepository } from './repository/emotion-file.repository';

@Injectable()
export class BoardService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,
    @InjectRepository(EmotionFileRepository)
    private readonly emotionFileRepository: EmotionFileRepository,

    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly authService: AuthService,
  ) {}

  // 게시글 작성
  async boardCreate(
    username: string,
    createBoardDto: SetBoardDto,
  ): Promise<string> {
    const { title, content, datetime, image_files_path } = createBoardDto;

    const user = await this.authService.findUserByUsername(username);

    const boardModule: BoardInterface = {
      title,
      content,
      datetime,
    };

    // 게시글 작성
    const board = await this.boardRepository.createBoard(user.id, boardModule);
    // 이모티콘 업로드
    await this.emotionUpload(image_files_path, board.id);

    return 'board upload success!';
  }

  // 이모티콘 업로드
  async emotionUpload(
    image_files_path: string[],
    boardId: number,
  ): Promise<void> {
    await this.emotionFileRepository.emotionUpload(image_files_path, boardId);
  }

  // 이모티콘 수정
  async emotionModify(
    image_file_path: string[],
    boardId: number,
  ): Promise<void> {
    await this.emotionFileRepository.emotionModify(image_file_path, boardId);
  }

  // 게시글 조회
  async boardRead(id: number): Promise<Board> {
    return await this.boardRepository.findBoardById(id);
  }

  // 게시글 전체 조회
  async boardAllRead(username: string, month: number): Promise<Board[]> {
    return await this.boardRepository.findAllBoardByUsername(username, month);
  }

  // 게시글 삭제
  async boardDelete(id: number): Promise<boolean> {
    return await this.boardRepository.deleteBoardById(id);
  }

  // 게시글 수정 (이모티콘 포함)
  async boardUpdate(id: number, updateBoardDto: SetBoardDto): Promise<void> {
    const { title, content, datetime, image_files_path } = updateBoardDto;

    const boardModule = {
      title,
      content,
      datetime,
    };
    // 이모티콘 수정
    await this.emotionModify(image_files_path, id);

    // 게시글 수정
    return await this.boardRepository.updateBoardById(id, boardModule);
  }
}
