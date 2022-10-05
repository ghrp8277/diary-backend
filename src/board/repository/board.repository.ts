import { EntityRepository, Repository } from 'typeorm';
import { Board } from '../entities/board.entity';
import { BoardInterface } from '../interface/board.interface';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  // 게시글 생성
  async createBoard(
    user_id: number,
    boardModule: BoardInterface,
  ): Promise<Board> {
    const { title, content, datetime } = boardModule;

    const board = this.create({
      user_member_id: user_id,
      title,
      content,
      datetime,
    });

    return this.save(board);
  }

  // 게시글 조회
  async findBoardById(id: number): Promise<Board> {
    return await this.createQueryBuilder('board')
      .innerJoin('board.emotion_files', 'emotion_file')
      .select([
        'board.title',
        'board.content',
        'board.datetime',
        'emotion_file.image_file_path',
      ])
      .where('board.id = :id', { id })
      .andWhere('emotion_file.board_id = :id', { id })
      .getOne();
  }

  // 현재 달의 게시글 전체 조회
  async findAllBoardByUsername(
    username: string,
    month: number,
  ): Promise<Board[]> {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), month - 1, 1);
    const lastDay = new Date(date.getFullYear(), month, 0);

    return await this.createQueryBuilder('board')
      .leftJoinAndSelect('board.user_member', 'user_member')
      .leftJoinAndSelect('board.user_oauth', 'user_oauth')
      .innerJoin('board.emotion_files', 'emotion_file')
      .select([
        'board.id',
        'board.title',
        'board.content',
        'board.datetime',
        'emotion_file.image_file_path',
      ])
      .where(
        'user_member.username = :username OR user_oauth.username = :username',
        { username },
      )
      .andWhere(':start < board.datetime AND board.datetime < :end', {
        start: firstDay,
        end: lastDay,
      })
      .orderBy('board.datetime')
      .getMany();
  }

  // 게시글 삭제
  async deleteBoardById(id: number): Promise<boolean> {
    const board = await this.delete({ id });

    if (board.affected > 0) return true;
    else return false;
  }

  // 게시글 수정
  async updateBoardById(
    id: number,
    boardModule: { title: string; content: string; datetime: Date },
  ): Promise<void> {
    const { title, content, datetime } = boardModule;

    await this.update(id, {
      title,
      content,
      datetime,
    });
  }
}
