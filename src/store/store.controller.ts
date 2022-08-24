import { Controller, Get, Param, StreamableFile, Response, Post, UseInterceptors, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import { Public } from 'src/auth/jwt/jwt.guard';
import { StoreService } from './store.service';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as moment from 'moment';

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
        FilesInterceptor('files', 18, {
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
                    const today = moment().format('YYYYMMDD HH:mm:ss')
                    // 업로드한 폴더에 파일 이름이 동일한 경우 덮어쓰기 함
                    callback(null, `${today}-${file.originalname}`)
                },
            }),
            fileFilter: function (req, file, callback) {
                if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    callback(null, true)
                }
                else callback(new HttpException(
                    {
                        message: 1,
                        error: 'only image files are allowed!'
                    },
                    HttpStatus.BAD_REQUEST
                ), false)
            },
            limits: {
                // 필드명 사이즈 최대값
                fieldNameSize: 150,
                // 파일 사이즈 (2MB)
                fileSize: 2097152,
                // 파일 최대 개수
                files: 18,
            }
        }),
    )
    async uploadFile(
        @Param('username') username: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        // 업로드한 파일은 지정한 폴더에 저장 -> 그후 파일들을 DB에 저장 (DB는 파일이 보관된 경로만 저장)
        return await this.storeService.imageFileSave(username, files);
    }

    @Public()
    @Get('/test')
    async test() {
        const isDelete = await this.storeService.emojiInfoDelete(17)
        console.log(isDelete)
    }
}