import { Controller, Get, Param, StreamableFile, Response, Post, UseInterceptors, UploadedFile, Bind, UploadedFiles, Query } from '@nestjs/common';
import { join } from 'path';
import { Public } from 'src/auth/jwt/jwt.guard';
import { StoreService } from './store.service';
import * as fs from 'fs';
import { diskStorage, memoryStorage } from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('store')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}
    // 기본 이미지 다운로드
    @Public()
    @Get('/emoji/download/basic')
    async getFile(
        @Response({ passthrough: true }) res
    ): Promise<StreamableFile> {
        // emotions 디렉토리 경로
        const emotionsPath = join(process.cwd(), 'emotions');

        const file = fs.createReadStream(join(emotionsPath, 'basic.zip'));
        
        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment;filename=emoji.zip'
        });

        return new StreamableFile(file);
    }

    // 다중 파일 업로드 -> 최대 18개 파일 업로드
    // 기존파일경로 -> 업로드 된 사용자 파일경로 / 이름 - 날짜 -> 업로드한 파일들
    @Public()
    @Post('/emoji/upload/:username')
    @UseInterceptors(
        FilesInterceptor('file', 18, {
            storage: diskStorage({
                destination: 
                function (req, file, callback) {
                    const filesPath = join(__dirname, '..', '..', 'files')
                    const username = req.params.username
                    const userFolderPath = join(filesPath, username)
                    
                    // 업로드한 유저 폴더 생성
                    fs.readdir(userFolderPath, (err) => {
                        // 해당 폴더가 없다면? 생성한다
                        if (err) {
                            fs.mkdirSync(userFolderPath, {
                                // recursive: true 옵션을 주게 되면, 상위 디렉토리가 없더라도 한번에 생성할 수 있게 해준다.
                                recursive: true
                            })

                            callback(null, userFolderPath)
                        } else {
                            callback(null, userFolderPath)
                        }
                    })
                },
                filename: function (req, file, callback) {
                    // 업로드한 폴더에 파일 이름이 동일한 경우 덮어쓰기 함
                    callback(null, file.originalname)
                }
            }),
        }),
    )
    async uploadFile(
        @Param('username') username: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        // 기존 이미지 파일이 저장되어 있다면? 
        // 업로드한 파일은 지정한 폴더에 저장 -> 그후 파일들을 DB에 저장 (DB는 파일이 보관된 경로만 저장)
        await this.storeService.imageFileSave(files);
        return 'true'
    }
}

// if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//   return callback(new Error('only image files are allowed!'), false)
// }
// callback(null, true);