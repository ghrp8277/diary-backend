import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/auth/jwt/jwt.guard';
import { BuyerService } from './buyer.service';

@Public()
@Controller('buyer/:username')
export class BuyerController {
    constructor(private readonly buyerService: BuyerService) {}

    @Get('/products')
    async getEmojiFilesInfo(@Param('username') username: string) {
        return await this.buyerService.findAllProduct();
    }
}
