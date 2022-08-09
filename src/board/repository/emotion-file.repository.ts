import { EntityRepository, Repository } from 'typeorm';
import { EmotionFile } from '../entities/emotion-file.entity';

@EntityRepository(EmotionFile)
export class EmotionFileRepository extends Repository<EmotionFile> {
  // 이모티콘 생성
  async emotionUpload(image_files_path: string[], boardId: number): Promise<void> {
    const imageReg = /(.*?)\.(jpg|jpeg|png|gif|bmp)$/;
    
    for (const image_file_path of image_files_path) {
      // 이미지 파일 검사
      if (image_file_path.match(imageReg)) {
        const emotion = this.create({
          image_file_path,
          image_file_name: this.extractFilename(image_file_path),
          board_id: boardId
        });

        this.save(emotion);
      }
    }
  }

  // 이모티콘 수정
  async emotionModify(image_files_path: string[], boardId: number) {
    const imageReg = /(.*?)\.(jpg|jpeg|png|gif|bmp)$/;

    for (const image_file_path of image_files_path) {
      // 이미지 파일 검사
      if (image_file_path.match(imageReg)) {
        await this.createQueryBuilder('emotion_file')
        .update(EmotionFile)
        .set({ 
          image_file_path,
          image_file_name: this.extractFilename(image_file_path)
        })
        .where('board_id = :id', { id: boardId })
        // .andWhere('image_file_path = :image_file_path', { image_file_path })
        .execute();
      }
    }
  }

  // 파일 명 가져오기
  extractFilename(path: string) {
    if (path.substring(0, 12) == "C:\\fakepath\\")
      return path.substring(12); // modern browser
    var x: number;
    x = path.lastIndexOf('/');
    if (x >= 0) // Unix-based path
      return path.substring(x+1);
    x = path.lastIndexOf('\\');
    if (x >= 0) // Windows-based path
      return path.substring(x+1);
    return path; // just the filename
  }
}
