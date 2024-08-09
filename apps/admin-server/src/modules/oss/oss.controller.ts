import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { OssService } from './oss.service';

class OssCredentials {
  @ApiProperty()
  'AccessKeyId': string;
  @ApiProperty()
  'AccessKeySecret': string;
  @ApiProperty()
  'SecurityToken': string;
}

@Controller({ path: 'oss' })
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('/credentials')
  @ApiOkResponse({ type: OssCredentials })
  async credentials(): Promise<OssCredentials> {
    return this.ossService.getCredentials();
  }
}
