/**
 * 用于给 @qiqiao/admin-client 生成接口文档的工具
 */
import axios from "axios";
import { generateApi } from "swagger-typescript-api";

type Config = {
  swaggerUrl: string;
  output: string;
};

export default function autoUpdateApis(config: Config) {
  let preSwaggerDoc = "";
  const timer = setInterval(async () => {
    // 检查接口文档是否更新
    try {
      const res = await axios(config.swaggerUrl, { data: "json" });
      const doc = JSON.stringify(res.data);
      if (doc === preSwaggerDoc) return;
      await updateApis(config);
      preSwaggerDoc = doc;
    } catch (e: any) {
      console.error("Failed to fetch swagger doc", e.message);
    }
  }, 3000);
  return timer;
}

function updateApis(config: Config) {
  return generateApi({
    name: "server.ts",
    // set to `false` to prevent the tool from writing to disk
    output: config.output,
    url: config.swaggerUrl,
    httpClientType: "axios",
    defaultResponseAsSuccess: false,
    generateClient: true,
    generateRouteTypes: false,
    generateResponses: true,
    toJS: false,
    extractRequestParams: false,
    extractRequestBody: false,
    extractEnums: false,
    unwrapResponseData: false,
    prettier: {
      printWidth: 120,
      tabWidth: 2,
      trailingComma: "all",
      parser: "typescript",
    },
  });
}
