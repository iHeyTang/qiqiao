import { Module } from '@nestjs/common';
import { OssService } from './oss.service';
import { OssController } from './oss.controller';

@Module({
  imports: [],
  controllers: [OssController],
  providers: [OssService],
})
export class OssModule {}
