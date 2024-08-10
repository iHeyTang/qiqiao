import { Inject } from "@nestjs/common";
import { AliOssModuleOptions } from "../interfaces/ali-oss-options.interface";
import { getConnectionToken } from "./ali-oss.utils";

export const InjectModel = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectConnection = (connection?: AliOssModuleOptions | string) =>
  Inject(getConnectionToken(connection));
