import { AliOssModuleOptions } from "../interfaces";
import { DEFAULT_CONNECTION_NAME } from "../ali-oss.constants";

export function getConnectionToken(
  connection: AliOssModuleOptions | string = DEFAULT_CONNECTION_NAME
): string {
  if (typeof connection === "string") {
    return connection;
  }
  return `${connection.name || DEFAULT_CONNECTION_NAME}`;
}
