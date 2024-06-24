<template>
  <el-row style="margin-top: 10px; margin-bottom: 10px;">
    <el-col :span="6">
      <el-button type="warning" @click="changeMachinesOrg()" v-loading.fullscreen.lock="fullscreenLoading">转移选中的灸疗仪给组织:</el-button>
    </el-col>
    <el-col :span="18">
      <el-input v-model="组织输入" maxlength="2147483647" show-word-limit :autosize="{ maxRows: 1 }" type="textarea"
        placeholder="输入组织名" />
    </el-col>
  </el-row>
  <el-row style="margin-top: 10px; margin-bottom: 10px;">
    <el-col :span="4">
      <el-button type="success" @click="createManyMachines()" v-loading.fullscreen.lock="fullscreenLoading">新建灸疗仪:</el-button>
    </el-col>
    <el-col :span="20">
      <el-input v-model="新建灸疗仪输入" maxlength="2147483647" show-word-limit :autosize="{ maxRows: 1 }" type="textarea"
        placeholder="输入多个灸疗仪id，以空格/换行/制表符/中英文逗号分割" />
    </el-col>
  </el-row>
  <el-row style="margin-top: 10px; margin-bottom: 10px;">
    <el-col :span="4">
      <el-button type="info" @click="setMachineModels()" v-loading.fullscreen.lock="fullscreenLoading">设置型号</el-button>
    </el-col>
    <el-col :span="20">
      <el-input v-model="设置型号输入" maxlength="2147483647" show-word-limit :autosize="{ maxRows: 1 }" type="textarea"
        placeholder="新建的灸疗仪会是这里填入的型号" />
    </el-col>
  </el-row>
  <el-row style="margin-top: 10px; margin-bottom: 10px;">
    <el-col :span="4">
      <el-button type="info" @click="setMachineRemarks()" v-loading.fullscreen.lock="fullscreenLoading">设置备注</el-button>
    </el-col>
    <el-col :span="20">
      <el-input v-model="设置备注输入" maxlength="2147483647" show-word-limit :autosize="{ maxRows: 1 }" type="textarea"
        placeholder="新建的灸疗仪会带上这里填入的备注" />
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-switch v-model="组织区分大小写" active-text="区分大小写" />
    </el-col>
    <el-col :span="20">
      <el-input v-model="按组织搜索输入" placeholder="按组织搜索" clearable/>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-switch v-model="id区分大小写" active-text="区分大小写" />
    </el-col>
    <el-col :span="20">
      <el-input v-model="按id搜索输入" placeholder="按id搜索" clearable/>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="4">
      <el-switch v-model="型号区分大小写" active-text="区分大小写" />
    </el-col>
    <el-col :span="20">
      <el-input v-model="按型号搜索输入" placeholder="按型号搜索" clearable/>
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
      @click="deleteSelectedMachines()" v-loading.fullscreen.lock="fullscreenLoading">
      删除选中</el-button>
    <el-button @click="refresh()" style="float: right;" v-loading.fullscreen.lock="fullscreenLoading">
      刷新</el-button>
    <!-- @click="clearSelection()"  -->
  </div>
  <el-table ref="主表格" @selection-change="handleSelectionChange"
    :default-sort="{ prop: 'connectedAt', order: 'ascending' }" :data="主表数据" border stripe
    style="width: 100%; --el-table-row-hover-bg-color: #ecf5ff;">
    <el-table-column fixed type="selection" width="fit-content" />
    <el-table-column fixed sortable prop="org" label="组织" width="fit-content" />
    <el-table-column fixed sortable prop="id" label="id" width="fit-content" />
    <el-table-column fixed sortable prop="model" label="型号" width="fit-content">
      <template #default="scope">
        <el-input v-model="scope.row.model" @blur="setMachineModel(scope.row.id, scope.row.model, true)">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column fixed sortable prop="remark" label="备注" width="fit-content">
      <template #default="scope">
        <el-input v-model="scope.row.remark" @blur="setMachineRemark(scope.row.id, scope.row.remark, true)">
        </el-input>
      </template>
    </el-table-column>
    <el-table-column fixed sortable prop="connectedAt" label="上线时间(无数据则不在线)" width="fit-content" />
    <el-table-column sortable prop="createTime" label="创建时间" width="fit-content" />
    <el-table-column prop="actions" label="操作" width="fit-content">
      <template #default="scope">
        <el-button type="primary" @click="viewMachineById(scope.row.id)" v-loading.fullscreen.lock="fullscreenLoading">
          查看数据</el-button>
        <el-button v-if="删除开关" type="danger" @click="deleteMachine(scope.row.id, true)" v-loading.fullscreen.lock="fullscreenLoading">
          删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
      v-model="dialogVisible"
      title="艾灸机数据"
      width="90%"
      :show-close="true"
    >
      <div>创建于 {{ dialogCreateTime }}</div>
      <div>组织 {{ dialogOrg }} 的艾灸机 {{ dialogMachineId }}</div>
      <div id="catalystTemperatureChart" ref="catalystTemperatureChart" style="width: 100%; height: 300px">Loading...</div>
      <div id="fanRpmChart" ref="fanRpmChart" style="width: 100%; height: 300px">Loading...</div>
      <div id="aitiaoLifeChart" ref="aitiaoLifeChart" style="width: 100%; height: 300px">Loading...</div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { defineStore } from 'pinia'
import { ref, computed, reactive, nextTick } from 'vue'
import { ElTable, ElMessage } from 'element-plus'
import * as echarts from 'echarts';
import axios from '@/http-common'

const 组织输入 = ref('')
const 新建灸疗仪输入 = ref('')
const 设置型号输入 = ref('')
const 设置备注输入 = ref('')
const 按组织搜索输入 = ref('')
const 组织区分大小写 = ref(false)
const 按id搜索输入 = ref('')
const id区分大小写 = ref(false)
const 按型号搜索输入 = ref('')
const 型号区分大小写 = ref(false)
const 删除开关 = ref(false)
const 删除按钮 = ref('')
const 主表格 = ref<InstanceType<typeof ElTable>>()
const 多选 = ref<AijiuMachine[]>([])
const dialogVisible = ref(false)
const dialogOrg = ref("")
const dialogMachineId = ref("")
const dialogCreateTime = ref("")
const dialogContent = ref({})
const fullscreenLoading = ref(false)

interface AijiuMachine {
  org: string
  id: string
  model: string
  remark: string
  connectedAt: Date
  createTime: Date
}
const use主表数据store = defineStore('请求结果store', () =>{
  let aijiuMachines = reactive([] as AijiuMachine[])
  const addMachine = (o: AijiuMachine) => { aijiuMachines.push(o) }
  const removeMachine = (id: string) => {
    aijiuMachines.forEach( (aijiuMachine, index) => {
      if(aijiuMachine.id === id){
        aijiuMachines.splice(index,1);
      }});}
  return { aijiuMachines, addMachine, removeMachine }
})
const 主表数据store = use主表数据store()
async function refresh() {
  try{
    fullscreenLoading.value = true
    主表数据store.aijiuMachines = (await axios.get("/machines/")).data;
  }catch(err){
    if (err.response == undefined)
      ElMessage({ showClose: true, message: err.message, type: 'error', });
    else
      ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', });
  }finally{
    fullscreenLoading.value = false
  }
}
await refresh()
const 主表数据: ref<AijiuMachine[]> = computed(() =>
  主表数据store.aijiuMachines.filter(
    (data) =>
      (!按id搜索输入.value ||
      id区分大小写.value ? data.id.includes(按id搜索输入.value) : data.id.toLowerCase().includes(按id搜索输入.value.toLowerCase()))
      &&
      (!按组织搜索输入.value ||
      组织区分大小写.value ? data.org.includes(按组织搜索输入.value) : data.org.toLowerCase().includes(按组织搜索输入.value.toLowerCase()))
      &&
      (!按型号搜索输入.value ||
      (型号区分大小写.value ? (data.model?.includes(按型号搜索输入.value)) : (data.model?.toLowerCase().includes(按型号搜索输入.value.toLowerCase()))))
  ))

const toggleAllSelection = () => 主表格.value!.toggleAllSelection()
const clearSelection = () => 主表格.value!.clearSelection()
const reverseSelection = () => {
  主表数据.value.forEach((item: AijiuMachine) => {
    主表格.value!.toggleRowSelection(item, undefined);
  });
}
const handleSelectionChange = (val: AijiuMachine[]) => { 多选.value = val }

async function deleteSelectedMachines() {
  await Promise.all(主表格.value!.getSelectionRows().map((row: { id: string; }) => deleteMachine(row.id, false)))
  await refresh()
}

async function createManyMachines() {
  const userInput: string = 新建灸疗仪输入.value
  const splitted: string[] = userInput.split(/[\s,，]+/).filter(Boolean)  // remove empty results
  await Promise.all(splitted.map(createMachine))
  await refresh()
}

async function createMachine(id: string) {
  // TODO: 只有root组织或者有权限的组织能创建机器
  try {
    fullscreenLoading.value = true
    await axios.post("/machines/id/"+id+"/"+"root");
    if (设置型号输入.value) {
      await axios.patch(`machines/model/${id}/${设置型号输入.value}`)
    }
    if (设置备注输入.value) {
      await axios.patch(`machines/remark/${id}/${设置备注输入.value}`)
    }
  } catch (err) {
    if (err.response == undefined)
      ElMessage({ showClose: true, message: err.message, type: 'error', });
    else
      ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', });
    return
  }finally{
    fullscreenLoading.value = false
  }
}

async function setMachineModels() {
  await Promise.all(主表格.value!.getSelectionRows().map((row: { id: string; }) => setMachineModel(row.id, 设置型号输入.value, false)))
  await refresh()
}

async function setMachineModel(id: string, model: string, refreshNow: Boolean) {
  try{
    fullscreenLoading.value = true
    await axios.patch(`/machines/model/${id}/${model}`);
  }catch(err){
    if (err.response == undefined)
      ElMessage({ showClose: true, message: err.message, type: 'error', });
    else
      ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', });
    return
  }finally{
    fullscreenLoading.value = false
  }
  if (refreshNow) { await refresh() }
}

async function setMachineRemarks() {
  await Promise.all(主表格.value!.getSelectionRows().map((row: { id: string; }) => setMachineRemark(row.id, 设置备注输入.value, false)))
  await refresh()
}

async function setMachineRemark(id: string, remark: string, refreshNow: Boolean) {
  try{
    fullscreenLoading.value = true
    await axios.patch(`/machines/remark/${id}/${remark}`);
  }catch(err){
    if (err.response == undefined)
      ElMessage({ showClose: true, message: err.message, type: 'error', });
    else
      ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', });
    return
  }finally{
    fullscreenLoading.value = false
  }
  if (refreshNow) { await refresh() }
}

async function changeMachinesOrg() {
  await Promise.all(主表格.value!.getSelectionRows().map((row: { id: string; }) => changeMachineOrg(row.id, 组织输入.value, false)))
  await refresh()
}

async function changeMachineOrg(id: string, newOrg: string, refreshNow: Boolean) {
  try{
    fullscreenLoading.value = true
    await axios.patch("/machines/id/"+id+"/"+newOrg);
  }catch(err){
    if (err.response == undefined)
      ElMessage({ showClose: true, message: err.message, type: 'error', });
    else
      ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', });
    return
  }finally{
    fullscreenLoading.value = false
  }
  if (refreshNow) { await refresh() }
}

async function deleteMachine(id: string, refreshNow: Boolean) {
  // TODO: 只有root组织或者有权限的组织能删除机器
  try{
    fullscreenLoading.value = true
    await axios.delete("/machines/id/"+id);
  }catch(err){
    if (err.response == undefined)
      ElMessage({ showClose: true, message: err.message, type: 'error', });
    else
      ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', });
    return
  }finally{
    fullscreenLoading.value = false
  }
  if (refreshNow) { await refresh() }
}

async function viewMachineById(id: String) {
  try {
    // Make an asynchronous request to fetch data from your backend server
    dialogContent.value = "Loading..."
    dialogOrg.value = ""
    dialogMachineId.value = ""
    dialogCreateTime.value = ""
    dialogVisible.value = true
    const response = await axios.get(`/machines/id/${id}`);
    dialogOrg.value = response.data.org
    dialogMachineId.value = response.data.id
    dialogCreateTime.value = response.data.createTime
    dialogContent.value = response.data

    let catalystTemperatureChart = echarts.init(document.getElementById('catalystTemperatureChart'));
    let catalystTemperatureData = response.data.catalystTemperature.map((d: any) => [new Date(d.timestamp), d.temperature])
    catalystTemperatureData.sort(function(a: any, b: any) { return a[0] - b[0]; });
    var fanRpmChart = echarts.init(document.getElementById('fanRpmChart'));
    var fanRpmChartData = response.data.fanRpm.map((d: any) => [new Date(d.timestamp), d.rpm])
    fanRpmChartData.sort(function(a: any, b: any) { return a[0] - b[0]; });
    var aitiaoLifeChart = echarts.init(document.getElementById('aitiaoLifeChart'));
    var aitiaoLifeChartData = response.data.aitiaoLife.map((d: any) => [new Date(d.timestamp), d.aitiao_life])
    aitiaoLifeChartData.sort(function(a: any, b: any) { return a[0] - b[0]; });
    var option = {
      width: '100%',
      title: {
        text: '三元催化温度'
      },
      tooltip: {
        trigger: 'axis',
        position: (pos: any, params: any, el: any, elRect: any, size: any) => {
          var obj: any = { top: 10 };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        },
        formatter: function (params: any) {
          params = params[0].data;
          var date = new Date(params[0]);
          return (
            date +
            ' : ' +
            params[1]
          );
        },
        axisPointer: {
          animation: true
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        },
        // min: Math.round(Math.min(response.data.catalystTemperature.map((d: any) => d.temperature)) / 10 - 1) * 10,
        // max: Math.round(Math.max(response.data.catalystTemperature.map((d: any) => d.temperature)) / 10 + 1) * 10 ,
      },
      series: [
        {
          name: '三元催化温度',
          type: 'line',
          showSymbol: false,
          data: catalystTemperatureData
        }
      ]
    };
    option && catalystTemperatureChart.setOption(option, true);

    option = {
      width: '100%',
      title: {
        text: '散热风机转速'
      },
      tooltip: {
        trigger: 'axis',
        position: (pos: any, params: any, el: any, elRect: any, size: any) => {
          var obj: any = { top: 10 };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        },
        formatter: function (params: any) {
          params = params[0].data;
          var date = new Date(params[0]);
          return (
            date +
            ' : ' +
            params[1]
          );
        },
        axisPointer: {
          animation: true
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        },
        // min: Math.round(Math.min(response.data.catalystTemperature.map((d: any) => d.temperature)) / 10 - 1) * 10,
        // max: Math.round(Math.max(response.data.catalystTemperature.map((d: any) => d.temperature)) / 10 + 1) * 10 ,
      },
      series: [
        {
          name: '散热风机转速',
          type: 'line',
          showSymbol: false,
          data: fanRpmChartData
        }
      ]
    };
    option && fanRpmChart.setOption(option, true);

    option = {
      width: '100%',
      title: {
        text: '艾条剩余寿命'
      },
      tooltip: {
        trigger: 'axis',
        position: (pos: any, params: any, el: any, elRect: any, size: any) => {
          var obj: any = { top: 10 };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        },
        formatter: function (params: any) {
          params = params[0].data;
          var date = new Date(params[0]);
          return (
            date +
            ' : ' +
            params[1]
          );
        },
        axisPointer: {
          animation: true
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        },
        // min: Math.round(Math.min(response.data.catalystTemperature.map((d: any) => d.temperature)) / 10 - 1) * 10,
        // max: Math.round(Math.max(response.data.catalystTemperature.map((d: any) => d.temperature)) / 10 + 1) * 10 ,
      },
      series: [
        {
          name: '艾条剩余寿命',
          type: 'line',
          showSymbol: false,
          data: aitiaoLifeChartData
        }
      ]
    };
    option && aitiaoLifeChart.setOption(option, true);

  } catch (err) {
    if (err.response == undefined) {
      ElMessage({ showClose: true, message: err.message, type: 'error', });
      dialogContent.value = err.message
    }
    else {
      ElMessage({ showClose: true, message: err.response.data.detail, type: 'error', });
      dialogContent.value = err.response.data.detail
    }
    return
  }
}
</script>
