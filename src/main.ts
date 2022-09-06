import { NestFactory } from '@nestjs/core';
import * as expressBasicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as moment from 'moment';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // cors
  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });

  // moment
  moment().locale('ko');

  // prefix version
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('VERSION'));

  // mvc
  app.useStaticAssets(path.join(__dirname, '../', 'files'), {
    prefix: `/${configService.get('VERSION')}/`,
  });
  app.setBaseViewsDir(path.join(__dirname, '../', 'public', 'notice'));
  app.setViewEngine('hbs');

  // pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // swagger 문서
  app.use(
    ['/docs', 'docs-json'],
    expressBasicAuth({
      // 로그인 화면이 뜨게 하는 설정
      challenge: true,
      // users: { ID : Password } 형식으로 아이디와 비밀번호를 지정해줍니다.
      users: {
        [configService.get('SWAGGER_USER')]:
          configService.get('SWAGGER_PASSWORD'),
      },
    }),
  );

  // 압축 미들웨어 패키지 (gzip 압축을 활성화합니다.)
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('DIARY API 문서')
    .setDescription('다이어리 공용 API 문서입니다.')
    .setVersion(configService.get('VERSION'))
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(configService.get('PORT'));
}
bootstrap();
