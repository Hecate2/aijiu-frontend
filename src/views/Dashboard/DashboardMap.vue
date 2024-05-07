<template>
  <button
    class="backParent"
    v-show="currentadcode != 100000"
    @click="returnLastMap(currentMap?.parentadcode)"
  >
    返回
  </button>
  <div id="myMap" ref="myMap"></div>
</template>
 
<script setup>
import * as echarts from "echarts";
import * as turf from '@turf/turf'
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
// import mapdata from "./city-data.json";
import { onMounted, ref, watch, getCurrentInstance } from "vue";
import axios_global from 'axios'
import axios from '@/http-common'
 
const gps_data = (await axios.get("/machines/gps/")).data;
console.log(gps_data);

// 定义当前所有的地图
let allMap = new Map();
 
// 当前地图
let currentMap = ref(null);
// echarts实例
let myChart,
  currentadcode = ref(100000);
const init = () => {
  allMap.set(100000, {
    name: "中国",
    adcode: 100000,
    url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
    childrenNum: 34,
    center: [0, 0],
    hasRegister: false, // 是否已经注册在echarts
  });
  currentMap.value = allMap.get(currentadcode.value);
  myChart = echarts.init(document.getElementById("myMap"));
  // renderChart(currentMap.value, data, dataMap);
  renderChart(currentMap.value);
  // 图表跟随屏幕自适应
  window.addEventListener("resize", () => {
    myChart.resize();
  });
  // 地图点击事件
  myChart.on("click", (params) => {
    let n = getMapKey(params.name, allMap);
    if (allMap.get(n)?.childrenNum == 0) return;
    currentadcode.value = n;
  });
};
// 根据map中数值，获取key
const getMapKey = (value, map) => {
  let arriterator = map.values(),
    res = 0;
  for (const iterator of arriterator) {
    if (iterator.name == value) {
      res = iterator.adcode;
      break;
    }
  }
  // console.log(res);
  return res;
};
function getCurrentadcode(mapdata) {
  let currentMap = new Map();
 
  mapdata.features.map((item) => {
    if (item.properties.name != "") {
      let cityinfo = {
        name: item.properties.name,
        adcode: item.properties.adcode,
        childrenNum: item.properties.childrenNum,
        url: `https://geo.datav.aliyun.com/areas_v3/bound/${item.properties.adcode}_full.json`,
 
        center: item.properties.center,
        parentadcode: item.properties.parent?.adcode,
        hasRegister: false,
      };
      currentMap.set(cityinfo.adcode, cityinfo);
    }
  });
  return currentMap;
}
// 根据城市名称name
function getCurrentadcodebyname(mapdata) {
  let currentMap = new Map();
 
  mapdata.features.map((item) => {
    if (item.properties.name != "") {
      let cityinfo = {
        name: item.properties.name,
        adcode: item.properties.adcode,
        childrenNum: item.properties.childrenNum,
        url: `https://geo.datav.aliyun.com/areas_v3/bound/${item.properties.adcode}_full.json`,
        center: item.properties.center,
        parentadcode: item.properties.parent?.adcode,
        hasRegister: false,
      };
      currentMap.set(cityinfo.name, cityinfo);
    }
  });
  return currentMap;
}
// 获取地图json, 绘制地图
// const renderChart = async (cMap, dataArr, dataMap) => {
const renderChart = async (cMap) => {
  // myChart.showLoading(); // 加载动画
  // 访问当前的地图数据
  let { data: mapdata } = await axios_global.get(cMap?.url);
  console.log(mapdata)
  let currentName = cMap?.name;
  
  let provinces_machine_count = {}
  let polygons = Object.fromEntries(mapdata.features.map(province => [
    province.properties.name === "" ? "南海诸岛" : province.properties.name, turf.multiPolygon(province.geometry.coordinates)
  ]));
  gps_data.forEach(machine => {
    const position = turf.point([machine.degreeE, machine.degreeN])
    for (const [name, polygon] of Object.entries(polygons)) {
      if (booleanPointInPolygon(position, polygon)) {
        if (name in provinces_machine_count) {
          provinces_machine_count[name] += 1
        } else {
          provinces_machine_count[name] = 1
        }
        break;
      }
    }
  });
  console.log(provinces_machine_count)
  // console.log(Object.keys(provinces_machine_count).map(function(k) { return {name: k, value: provinces_machine_count[k]}; }))
 
  // 判断是否注册过
  if (!cMap?.hasRegister) {
    echarts.registerMap(currentName, mapdata);
    // 当前地图下的地区信息
    let currentCityMap = getCurrentadcode(mapdata);
 
    allMap = new Map([...allMap, ...currentCityMap]);
    allMap.get(cMap?.adcode).hasRegister = true;
  }
 
  let option = {
    tooltip: {
      position: "right",
      color: "#F7C034",
      formatter(d) {
        // console.log(d);
        return `<div>${d.name}:${
          d?.data?.value || 0
        }</div>`;
      },
    },
    title: {
      text: `${currentName}地图`,
      left: "center",
      top: "2%",
      textStyle: {
        color: "#000",
      },
    },
    //热力图配置
    visualMap: {
      left: "left",
      orient: "vertical",
      itemWidth: 10,
      min: Object.keys(provinces_machine_count).length >= 34 ? 
           Math.min.apply(null, Object.keys(provinces_machine_count).map(function(x) { return provinces_machine_count[x]} )) : 0,
      max: Math.max.apply(null, Object.keys(provinces_machine_count).map(function(x) { return provinces_machine_count[x]} )),
      align: "center",
      bottom: "10%",
      inRange: {
        color: [
          "#F8F8FF",
          "#dcfffc",
          "#c5e3be",
          "#e3ff00",
          "#ffcc78",
          "#DC143C",
        ],
      },
      calculable: true,
    },
    //层级地图配置
    series: [
      {
        name: `${currentName}地图`,
        map: currentName,
        type: "map",
        roam: true,
        scaleLimit: {
          min: 0.5,
          max: 4,
        },
        label: {
          normal: {
            formatter(d) {
              return `${d.name}`;
            },
            show: false,
            textStyle: {
              color: "#000",
              fontSize: 14,
            },
          },
          emphasis: {
            show: true,
            textStyle: {
              color: "#000",
            },
          },
        },
        itemStyle: {
          normal: {
            areaColor: "#F8F8FF",
            borderColor: "#5EC9F9",
            borderWidth: 1,
          },
          emphasis: {
            areaColor: "#FFFF00",
            shadowColor: "#1773c3",
            shadowBlur: 20,
          },
        },
        // markPoint: {
        //   symbol: "circle",
        //   itemStyle: {
        //     color: "#F7C034",
        //     // borderColor:'#000'
        //   },
        //   label: {
        //     normal: {
        //       show: true,
        //     },
        //     emphasis: {
        //       show: true,
        //     },
        //   },
        //   // data: dataArr,
        //   data: [
        //     {
        //       name: "广东省",
        //       coord: [20, 20],
        //     },
        //   ],
        //   blur: {},
        // },
        // data: dataMap,
        // data: [
        //   {name:"北京市",value:100,},
        //   {name:"上海市",value:80,},
        //   {name:"广东省",value:120,},
        //   {name:"黑龙江省",value:10,},
        //   {name:"台湾省",value:100,},
        // ],
        data: Object.keys(provinces_machine_count).map(function(k) { return {name: k, value: provinces_machine_count[k]}; }),
      },
    ],
  };
  myChart.clear();
  myChart.setOption(option, true);
};
onMounted(() => {
  init();
});
// 监听currentadcode地图值
watch(currentadcode, async (newval, oldval) => {
  let nextMap = allMap.get(newval);
  // 如果存在子节点
  if (nextMap?.childrenNum && nextMap.childrenNum > 0) {
    currentMap.value = nextMap;
    if (currentMap.value.parentadcode == undefined) {
      currentMap.value.parentadcode = oldval;
    }
    // console.log("nextMap: ", nextMap);
    // if (nextMap.adcode != 100000) {
    //   query.code = nextMap.adcode;
    //   queryData.code = nextMap.adcode;
    // } else {
    //   delete query.code;
    //   queryData.code = "";
    // }
    // const data = await getDeptList();
    // const dataMap = await getDeptHotMap();
    // renderChart(nextMap, data, dataMap);
    renderChart(nextMap);
  }
});
// 返回上级地图
const returnLastMap = (adcode) => {
  currentadcode.value = adcode;
};
</script>
 
<style scoped>
/* 这里是组件的样式 */
#myMap {
  width: 100%;
  height: 800px;
}
</style>