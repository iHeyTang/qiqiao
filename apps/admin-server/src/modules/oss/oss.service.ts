import { Injectable } from '@nestjs/common';
import { pick } from 'src/utils/object';
import { STS } from 'ali-oss';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OssService {
  private readonly sts: STS;

  constructor(private configService: ConfigService) {
    this.sts = new STS({
      accessKeyId: this.configService.get<string>('ALIYUN_STS_ACCESS_KEY_ID'),
      accessKeySecret: this.configService.get<string>(
        'ALIYUN_STS_ACCESS_KEY_SECRET',
      ),
    });
  }

  /**
   * 获取 OSS 临时凭证
   * @returns
   */
  public async getCredentials() {
    const res = await this.sts.assumeRole(
      'acs:ram::1529211876482523:role/iheytang-oss',
      '',
      3000,
    );
    return pick(res.credentials, [
      'AccessKeyId',
      'AccessKeySecret',
      'SecurityToken',
    ]);
  }
}
