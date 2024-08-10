import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import { AliOssModuleOptions } from "./ali-oss-options.interface";
import { AliOssOptionsFactory } from "./ali-oss-options-factory.interface";

export interface AliOssModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  name?: string;
  inject?: any[];
  useClass?: Type<AliOssOptionsFactory>;
  useExisting?: Type<AliOssOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AliOssModuleOptions> | AliOssModuleOptions;
}
