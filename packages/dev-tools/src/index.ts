import path from "node:path";
import adminClientApiGenerator from "./admin-client-api-generator";

function bootstrap() {
  adminClientApiGenerator({
    swaggerUrl: "http://localhost:8000/api-doc/json",
    output: path.resolve(process.cwd(), "../../apps/admin-client/src/api"),
  });
}

bootstrap();
