import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            // clientID: configService.get('KAKAO_CLIENT_ID'),
            // callbackURL: configService.get('KAKAO_CALLBACK_URL')
            clientID: "551071f1b1303f95d37928429fe162ad",
            callbackURL: "http://localhost:3000/v1/auth/kakao/redirect"
        })
    }

    async validator(accessToken: string, refreshToken: string, profile: any, done: any) {
        const profileJson = profile._json;
        const kakaoAccount = profileJson.kakao_account;
        const payload = {
            name: kakaoAccount.profile.nickname,
            kakaoId: profileJson.id,
            email: kakaoAccount.has_email && !kakaoAccount.email_needs_agreement ? kakaoAccount.email : null
        };
        console.log(accessToken, refreshToken)
        done(null, payload);
    }
}