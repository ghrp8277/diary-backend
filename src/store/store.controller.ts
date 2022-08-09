import { Controller, Get, Param, StreamableFile, Response, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { join } from 'path';
import { Public } from 'src/auth/jwt/jwt.guard';
import { StoreService } from './store.service';
import * as fs from 'fs';
import { memoryStorage } from 'multer';
import { ImageFileInterface } from 'src/store/interface/image.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Public()
@Controller('store')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}
    // 기본 이미지 다운로드
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

    @Post('/emoji/upload')
    @UseInterceptors(
        FileInterceptor('file', {
        storage: memoryStorage(),
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log(file)
        return 'true'
    }

    /*
    TINYBLOB : 2^8 - 1 [256 Bytes]
    BLOB : 2^16 - 1 [64KB]
    MEDIUMBLOB : 2^24 - 1 [8 MB]
    LONGBLOB : 2^32 - 1 [4GB] 
    */
    // 이미지 업로드
    @Post('/image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
        }),
    )
    async uploadImageFile(@UploadedFile() file: Express.Multer.File) {
        const imageFileModule: ImageFileInterface = {
            name: file.originalname,
            image_file: file.buffer.toString('utf8'),
            mimeType: file.mimetype,
        };
        await this.storeService.imageFileSave(imageFileModule);
        return 'success image file upload';
    }
}

// if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//   return callback(new Error('only image files are allowed!'), false)
// }
// callback(null, true);