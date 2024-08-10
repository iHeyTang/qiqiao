import { knex } from "~/server/dao";

/**
 * 获取文章详情
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const articleId = url.searchParams.get("id");
  if (!articleId) return;
  return await knex("sys_articles")
    .where({ id: articleId })
    .select(
      "id",
      "title",
      "content",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by"
    )
    .whereNotNull("published_at")
    .first();
});
