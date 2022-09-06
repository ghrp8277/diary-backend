import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StoreService } from 'src/store/service/store.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly storeService: StoreService) {}

  // @Cron('0 * * * * *')
  // async test() {
  //     const isDelete = await this.storeService.emojiInfoDelete(17)

  //     this.logger.log(`cron!!! ${new Date()} ${isDelete}`)
  // }

  // 매일마다 이미지 파일이 등록된 기간이 이주일이 지나고 승인이 되지 않는 파일들은 삭제한다.
  async deleteImageFile() {
    // 이모지 정보에 등록된 날짜 값을 비교 후
    // 조건이 맞는 이미지파일의 경로 정보를 가져와 변수에 저장 후
    // 디비에 있는 이미지파일 정보를 삭제하고 성공했다면
    // 해당 파일들을 전부 삭제
    // const isDelete = await this.storeService.emojiInfoDelete(17)
    // if (isDelete) {
    //     const filesPath = join(__dirname, '..', '..', 'files')
    //     const username = req.params.username
    //     const userFolderPath = join(filesPath, username)
    //     fs.rmdir()
    // }
  }
}
