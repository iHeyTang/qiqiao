import { knex as originKnex } from "@qiqiao/dao";

export const knex = originKnex({
  client: "pg",
  connection: process.env.SECRET_DAO_KNEX_CONNECTION,
});
