import { knex } from "~/server/dao";

/**
 * 获取文章列表
 */
export default defineEventHandler(() => {
  return knex("sys_articles")
    .select("id", "title", "created_at", "updated_at")
    .whereNotNull("published_at")
    .orderBy("published_at", "desc");
});
