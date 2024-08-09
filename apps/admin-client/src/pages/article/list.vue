<template>
  <el-button type="primary" @click="handleClickNew">新建</el-button>
  <el-button type="primary" @click="handleClickRefresh">刷新</el-button>

  <el-table
    v-loading="loading"
    :data="data?.data.list || []"
    style="width: 100%"
  >
    <el-table-column prop="title" label="标题">
      <template #default="{ row }">
        {{ row.title || "未命名文章" }}
      </template>
    </el-table-column>
    <el-table-column prop="updated_at" label="最近更新时间" width="180">
      <template #default="{ row }">
        {{
          row.updated_at && dayjs(row.updated_at).format("YYYY-MM-DD HH:mm:ss")
        }}
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="创建时间" width="180">
      <template #default="{ row }">
        {{
          row.updated_at && dayjs(row.updated_at).format("YYYY-MM-DD HH:mm:ss")
        }}
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="handleClickEdit(row.id)">
          编辑
        </el-button>
        <el-popconfirm
          title="确定删除吗?"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="handleCommitDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { api } from "@/api";
import { dayjs, ElMessage, ElPopconfirm } from "element-plus";
import { useRequest } from "vue-request";
import { useRouter } from "vue-router";

const router = useRouter();

const {
  data,
  loading,
  refresh: refreshList,
} = useRequest(api.api.articleControllerList, {
  defaultParams: [{ pageSize: 10, current: 1 }],
});

const handleClickRefresh = () => {
  refreshList();
};

const { run: handleCommitNew } = useRequest(api.api.articleControllerCreate, {
  manual: true,
  onSuccess: (res) => {
    router.push(`/article/edit/${res.data.id}`);
  },
});

const handleClickNew = () => {
  handleCommitNew({ title: "", content: "" });
};

const handleClickEdit = (id: string) => {
  router.push(`/article/edit/${id}`);
};

const { run: handleCommitDelete } = useRequest(
  api.api.articleControllerDelete,
  {
    manual: true,
    onSuccess: () => {
      ElMessage("删除成功");
      refreshList();
    },
  }
);
</script>
