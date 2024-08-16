import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AliOssModule } from '@qiqiao/nestjs-ali-oss';
import { KnexModule } from 'nest-knexjs';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { OssModule } from './modules/oss/oss.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
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
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
