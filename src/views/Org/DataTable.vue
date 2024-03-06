<template>
  <div style="margin-top: 20px">
    <el-button @click="toggleAllSelection()">全选/全不选</el-button>
    <el-button @click="reverseSelection()">反选</el-button>
    <el-button @click="clearSelection()">清除选择</el-button>
    <el-button type="danger">删除选中</el-button>
    <!-- @click="clearSelection()"  -->
  </div>
  <el-table ref="tableRef" @selection-change="handleSelectionChange"
    :default-sort="{ prop: 'createTime', order: 'descending' }"
    :data="tableData" border stripe style="width: 100%">
    <el-table-column fixed type="selection" width="100%" />
    <el-table-column fixed sortable prop="name" label="名称" width="100%" />
    <el-table-column sortable prop="createTime" label="创建时间" />
    <el-table-column prop="actions" label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >重命名</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'

interface Org {
  name: string
  createTime: Date
}
const handleEdit = (index: number, row: Org) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: Org) => {
  console.log(index, row)
}
const tableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Org[]>([])
const toggleAllSelection = () => tableRef.value!.toggleAllSelection()
const clearSelection = () => tableRef.value!.clearSelection()
const reverseSelection = () => {
  tableData.forEach((item) => {
    tableRef.value!.toggleRowSelection(item);
  });
}
const handleSelectionChange = (val: Org[]) => {
  multipleSelection.value = val
}

const tableData: Org[] = [
  { name: "测试ROOT", createTime: new Date() },
  { name: "另一个org", createTime: new Date() },
  { name: "测试ROOT", createTime: new Date() },
  { name: "另一个org", createTime: new Date() },
  { name: "测试ROOT", createTime: new Date() },
  { name: "另一个org", createTime: new Date() },
  { name: "测试ROOT", createTime: new Date() },
  { name: "另一个org", createTime: new Date() },
]
</script>
