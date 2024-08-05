import fs from "node:fs";
import { getFileTitle } from "./utils";

export type TreeNode = {
  path: string;
  name: string;
  isDir: boolean;
  children?: TreeNode[];
};

export default defineEventHandler(() => {
  return fetchTraverseFiles({ entryDir: "", base: "public/posts" });
});

/**
 * 遍历文件夹并返回树状结构
 * @param entryDir
 * @returns
 */
const fetchTraverseFiles = (params: { entryDir: string; base: string }) => {
  const root = fs.readdirSync(`${params.base}${params.entryDir}`);
  const tree: TreeNode[] = [];

  root.forEach((file) => {
    if (file === "index.md") return;
    const path = `${params.base}${params.entryDir}/${file}`;
    const stat = fs.statSync(path);
    const title = getFileTitle(path);

    // 如果是一个目录，递归遍历
    const children = stat.isDirectory()
      ? fetchTraverseFiles({
          entryDir: `${params.entryDir}/${file}`,
          base: params.base,
        })
      : undefined;

    tree.push({
      path: `${params.entryDir}/${file}${stat.isDirectory() ? "/index" : ""}`,
      name: title,
      isDir: stat.isDirectory(),
      children,
    });
  });

  return tree;
};
