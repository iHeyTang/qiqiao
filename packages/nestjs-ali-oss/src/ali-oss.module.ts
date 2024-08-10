import { DynamicModule, Module } from '@nestjs/common';
import { AliOssCoreModule } from './ali-oss-core.module';
import { AliOssModuleAsyncOptions, AliOssModuleOptions } from './interfaces';

@Module({})
export class AliOssModule {
  public static forRoot(
    options: AliOssModuleOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: AliOssModule,
      imports: [AliOssCoreModule.forRoot(options, connection)],
    };
  }

  public static forRootAsync(
    options: AliOssModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: AliOssModule,
      imports: [AliOssCoreModule.forRootAsync(options, connection)],
    };
  }
}
