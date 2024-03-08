<template>
  <el-row style="margin-top: 10px; margin-bottom: 10px;">
    <el-col :span="3">
      <el-button type="success" @click="createManyOrgs()">新建组织:</el-button>
    </el-col>
    <el-col :span="21">
      <el-input v-model="新建组织输入" maxlength="2147483647" show-word-limit :autosize="{ maxRows: 1 }" type="textarea"
        placeholder="输入多个组织名，以空格/换行/制表符/中英文逗号分割" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-switch v-model="区分大小写" active-text="区分大小写" />
    </el-col>
    <el-col :span="20">
      <el-input v-model="按名称搜索输入" placeholder="按名称搜索" clearable/>
    </el-col>
  </el-row>
  <div style="margin-top: 10px; margin-bottom: 10px;">
    <el-button @click="toggleAllSelection()">全选/全不选</el-button>
    <el-button @click="reverseSelection()">反选</el-button>
    <el-button @click="clearSelection()">清除选择</el-button>
    <el-switch v-model="删除开关" style="margin-left: 10px;
      --el-switch-on-color: #ff4949; --el-switch-off-color: #e6a23c"
      active-text="启用删除" inactive-text="禁用删除" />
    <el-button v-if="删除开关" v-model="删除按钮"
      style="margin-left: 10px;" type="danger"
      @click="deleteSelectedOrgs()">
      删除选中</el-button>
    <el-button @click="refresh()" style="float: right;">刷新</el-button>
    <!-- @click="clearSelection()"  -->
  </div>
  <el-table ref="主表格" @selection-change="handleSelectionChange"
    :default-sort="{ prop: 'createTime', order: 'descending' }" :data="主表数据" border stripe
    style="width: 100%; --el-table-row-hover-bg-color: #ecf5ff;">
    <el-table-column fixed type="selection" width="fit-content" />
    <el-table-column fixed sortable prop="name" label="名称" width="fit-content" />
    <el-table-column sortable prop="createTime" label="创建时间" width="fit-content" />
    <el-table-column prop="actions" label="操作" width="fit-content">
      <template #default="scope">
        <el-popover placement="top" trigger="click">
          <template #reference>
            <el-button @click="setDefaultNewName(scope.row.name)">重命名</el-button>
          </template>
          <div>旧名称：<el-text class="mx-1">{{ scope.row.name }}</el-text></div>
          <div>新名称：<el-input v-model="新名称" placeholder="输入新名称" clearable/></div>
          <el-button @click="renameOrg(scope.row.name, 新名称)">重命名</el-button>
        </el-popover>
        <el-button v-if="删除开关" type="danger" @click="deleteOrg(scope.row.name, true)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { ElTable, ElMessage } from 'element-plus'
import axios from '@/http-common'

const 新建组织输入 = ref('')
const 按名称搜索输入 = ref('')
const 区分大小写 = ref(false)
const 删除开关 = ref(false)
const 删除按钮 = ref('')
const 新名称 = ref('')
const 主表格 = ref<InstanceType<typeof ElTable>>()
const 多选 = ref<Org[]>([])

interface Org {
  name: string
  createTime: Date
}
const use主表数据store = defineStore('请求结果store', () =>{
  let orgs = reactive([] as Org[])
  const addOrg = (o: Org) => { orgs.push(o) }
  const removeOrg = (name: string) => {
    orgs.forEach( (org, index) => {
      if(org.name === name){
        orgs.splice(index,1);
      }});}
  return { orgs, addOrg, removeOrg }
})
const 主表数据store = use主表数据store()
async function refresh() {
  let { data: res } = await axios.get("/orgs/");
  主表数据store.orgs = res
}
await refresh()
const 主表数据: ref<Org[]> = computed(() =>
  主表数据store.orgs.filter(
    (data) =>
      !按名称搜索输入.value ||
      区分大小写.value ? data.name.includes(按名称搜索输入.value) : data.name.toLowerCase().includes(按名称搜索输入.value.toLowerCase())
  ))

const toggleAllSelection = () => 主表格.value!.toggleAllSelection()
const clearSelection = () => 主表格.value!.clearSelection()
const reverseSelection = () => {
  主表数据.value.forEach((item) => {
    主表格.value!.toggleRowSelection(item, undefined);
  });
}
const handleSelectionChange = (val: Org[]) => { 多选.value = val }
function setDefaultNewName(newName: string) {
  新名称.value = newName
}

async function deleteSelectedOrgs() {
  await Promise.all(主表格.value!.getSelectionRows().map(row => deleteOrg(row.name, false)))
  await refresh()
}

async function createManyOrgs() {
  const userInput: string = 新建组织输入.value
  const splitted: string[] = userInput.split(/[\s,，]+/).filter(Boolean)  // remove empty results
  splitted.forEach(createOrg)
  await refresh()
}

async function createOrg(name: string) {
  try {
    await axios.post("/orgs/"+name);
  } catch (err) {
    ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', })
    return
  }
}

async function renameOrg(oldName: string, newName: string) {
  try {
    await axios.patch("/orgs/" + oldName + "/" + newName);
  } catch (err) {
    ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', })
    return
  }
  await refresh()
}

async function deleteOrg(name: string, refreshNow: Boolean) {
  try{
    await axios.delete("/orgs/"+name);
  }catch(err){
    ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', })
    return
  }
  if (refreshNow) { await refresh() }
}

</script>
