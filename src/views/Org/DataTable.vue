<template>
  <el-row style="margin-top: 10px; margin-bottom: 10px;">
    <el-col :span="3">
    <el-button
      type="success"
      @click="createManyOrgs()"
      >新建组织:</el-button>
    </el-col>
    <el-col :span="21">
    <el-input
      v-model="新建组织输入"
      maxlength="2147483647"
      show-word-limit
      :autosize="{ maxRows: 1 }"
      type="textarea"
      placeholder="输入多个组织名，以空格/换行/制表符/中英文逗号分割"
    />
    </el-col>
  </el-row>
  <div style="margin-top: 10px; margin-bottom: 10px;">
    <el-button @click="toggleAllSelection()">全选/全不选</el-button>
    <el-button @click="reverseSelection()">反选</el-button>
    <el-button @click="clearSelection()">清除选择</el-button>
    <el-switch
      v-model="删除开关"
      style="margin-left: 10px;
      --el-switch-on-color: #ff4949;
      --el-switch-off-color: #e6a23c"
      active-text="启用删除" inactive-text="禁用删除"
    />
    <el-button
      v-if="删除开关"
      v-model="删除按钮"
      style="margin-left: 10px;"
      type="danger">删除选中</el-button>
    <!-- @click="clearSelection()"  -->
  </div>
  <el-table ref="tableRef" @selection-change="handleSelectionChange"
    :default-sort="{ prop: 'createTime', order: 'descending' }"
    :data="tableData" border stripe style="width: 100%">
    <el-table-column fixed type="selection" width="fit-content" />
    <el-table-column fixed sortable prop="name" label="名称" width="fit-content" />
    <el-table-column sortable prop="createTime" label="创建时间" width="fit-content" />
    <el-table-column prop="actions" label="操作" width="fit-content">
      <template #default="scope">
        <el-button @click="handleEdit(scope.$index, scope.row)" >重命名</el-button>
        <el-button v-if="删除开关" type="danger" @click="deleteOrg(scope.row)" >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import axios from '@/http-common'

const 新建组织输入 = ref('')
const 删除开关 = ref(false)
const 删除按钮 = ref('')

interface Org {
  name: string
  createTime: Date
}
const handleEdit = (row: Org) => {
  console.log(index, row)
}
const handleDelete = (row: Org) => {
  console.log(index, row)
}
const tableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Org[]>([])
const toggleAllSelection = () => tableRef.value!.toggleAllSelection()
const clearSelection = () => tableRef.value!.clearSelection()
const reverseSelection = () => {
  tableData.forEach((item) => {
    tableRef.value!.toggleRowSelection(item, undefined);
  });
}
const handleSelectionChange = (val: Org[]) => {
  multipleSelection.value = val
}

const { data: res } = await axios.get("/orgs");
console.log(res)
let tableData: Org[] = res

async function createManyOrgs() {
  const userInput: string = 新建组织输入.value
  const splitted: string[] = userInput.split(/[\s,，]+/).filter(Boolean)  // remove empty results
  splitted.forEach(createOrg)
  const { data: res } = await axios.get("/orgs");
  tableData = res
}

async function createOrg(name: string) {
  await axios.post("/orgs/"+name);
}

async function renameOrg(row: Org, newName: string) {
  await axios.patch("/orgs/${row.name}/${newName}");
  const { data: res } = await axios.get("/orgs");
  tableData = res
}

async function deleteOrg(row: Org) {
  await axios.delete("/orgs/"+row.name);
  const { data: res } = await axios.get("/orgs");
  tableData = res
}

</script>
