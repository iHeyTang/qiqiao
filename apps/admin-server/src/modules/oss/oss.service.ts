import { Injectable } from '@nestjs/common';
import { pick } from 'src/utils/object';
import { STS } from 'ali-oss';
import { ConfigService } from '@nestjs/config';
import { InjectConnection as AliOssInjectConnection } from '@qiqiao/nestjs-ali-oss';

@Injectable()
export class OssService {
  constructor(
    @AliOssInjectConnection() private readonly sts: STS,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取 OSS 临时凭证
   * @returns
   */
  public async getCredentials() {
    const arn = this.configService.get<string>(
      'SECRET_ADMIN_SERVER_ALIYUN_STS_ACCESS_ROLE_ARN',
    );
    const res = await this.sts.assumeRole(arn, '', 3000);
    return pick(res.credentials, [
      'AccessKeyId',
      'AccessKeySecret',
      'SecurityToken',
    ]);
  }
}
