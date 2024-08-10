import { AliOssModuleOptions } from './ali-oss-options.interface';

export interface AliOssOptionsFactory {
  createAliOssOptions(
    connectionName?: string,
  ): Promise<AliOssModuleOptions> | AliOssModuleOptions;
}
