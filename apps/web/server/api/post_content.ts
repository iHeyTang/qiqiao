import fs from "node:fs";
import { getContentTitle } from "./utils";

export default defineEventHandler((event) => {
  try {
    const url = getRequestURL(event);
    const docPath = url.searchParams.get("doc_path");
    const stat = fs.statSync(`public/posts/${docPath}.md`);
    const content = fs.readFileSync(`public/posts/${docPath}.md`, "utf-8");
    const title = getContentTitle(content);
    return {
      title,
      content: content,
      createdAt: stat.birthtime,
      latestModifiedAt: stat.mtime,
    };
  } catch (e) {
    return;
  }
});
