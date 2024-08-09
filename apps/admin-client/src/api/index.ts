import { Api } from "./server";
import OSS from "ali-oss";

export const api = new Api();

export const oss = async () => {
  const { data: credentials } = await api.api.ossControllerCredentials();
  return new OSS({
    accessKeyId: credentials.AccessKeyId,
    accessKeySecret: credentials.AccessKeySecret,
    stsToken: credentials.SecurityToken,
    bucket: "iheytang",
    region: "oss-cn-hangzhou",
  });
};
