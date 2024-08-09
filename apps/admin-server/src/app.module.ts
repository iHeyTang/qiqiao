import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './modules/article/article.module';
import { OssModule } from './modules/oss/oss.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OssModule, ArticleModule],
})
export class AppModule {}
