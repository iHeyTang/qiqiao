import {
  Global,
  Module,
  DynamicModule,
  Provider,
  Type,
  OnApplicationShutdown,
} from "@nestjs/common";
import type {
  AliOssModuleAsyncOptions,
  AliOssModuleOptions,
  AliOssOptionsFactory,
} from "./interfaces";
import { getConnectionToken } from "./common/ali-oss.utils";
import { ALI_OSS_MODULE_OPTIONS } from "./ali-oss.constants";
import { defer, lastValueFrom } from "rxjs";
import { STS } from "ali-oss";

@Global()
@Module({})
export class AliOssCoreModule implements OnApplicationShutdown {
  public static forRoot(
    options: AliOssModuleOptions,
    connection?: string
  ): DynamicModule {
    const aliOssModuleOptions: Provider = {
      provide: ALI_OSS_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async () => await this.createConnectionFactory(options),
    };

    return {
      module: AliOssCoreModule,
      providers: [connectionProvider, aliOssModuleOptions],
      exports: [connectionProvider],
    };
  }

  public static forRootAsync(
    options: AliOssModuleAsyncOptions,
    connection?: string
  ): DynamicModule {
    const connectionProvider: Provider = {
      provide: getConnectionToken(connection),
      useFactory: async (options: AliOssModuleOptions) => {
        return await this.createConnectionFactory(options);
      },
      inject: [ALI_OSS_MODULE_OPTIONS],
    };

    return {
      module: AliOssCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), connectionProvider],
      exports: [connectionProvider],
    };
  }

  async onApplicationShutdown(): Promise<any> {}

  public static createAsyncProviders(
    options: AliOssModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<AliOssOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  public static createAsyncOptionsProvider(
    options: AliOssModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ALI_OSS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // `as Type<AliOssOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<AliOssOptionsFactory>,
    ];

    return {
      provide: ALI_OSS_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: AliOssOptionsFactory
      ): Promise<AliOssModuleOptions> => {
        return await optionsFactory.createAliOssOptions();
      },
      inject,
    };
  }

  private static async createConnectionFactory(
    options: AliOssModuleOptions
  ): Promise<STS> {
    return lastValueFrom(
      defer(async () => {
        return new STS(options.config);
      })
    );
  }
}
