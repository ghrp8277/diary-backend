import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService) => {
  const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mariadb',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_DB'),
    entities: ['dist/**/*.entity{.ts,.js}'],
    // 응용프로그램 종료 시 연결이 닫힌다.
    keepConnectionAlive: true,
    // 엔티티가 자동으로 로드된다.
    autoLoadEntities: true,
    // 애플리케이션을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이 타입 변경값들을 해당 테이블을 Drop한 후 다시 생성해준다.
    synchronize: true,
    logging: false,
  };
  console.log(typeORMConfig);
  return typeORMConfig;
};
