import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './modules/article/article.module';
import { OssModule } from './modules/oss/oss.module';
import { KnexModule } from 'nest-knexjs';
import { AliOssModule } from '@qiqiao/nestjs-ali-oss';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: process.env.SECRET_DAO_KNEX_CONNECTION,
      },
    }),
    AliOssModule.forRoot({
      config: {
        accessKeyId: process.env.SECRET_ADMIN_SERVER_ALIYUN_STS_ACCESS_KEY_ID,
        accessKeySecret:
          process.env.SECRET_ADMIN_SERVER_ALIYUN_STS_ACCESS_KEY_SECRET,
      },
    }),
    OssModule,
    ArticleModule,
  ],
})
export class AppModule {}
