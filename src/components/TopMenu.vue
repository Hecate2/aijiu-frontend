<script lang="ts">
import { RouterLink } from 'vue-router';
import routes from '../router/routes';
</script>

<template>
    <el-menu
      :default-active="$route.path"
      class="el-menu-top"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <div class="flex-grow" />
      <template  v-for="route in routes" :key="route.name">
        <el-menu-item :index="route.path" :router="true" style="display: flex; padding-left: 0; padding-right: 0;">
          <RouterLink class="router-link" :to="{path:route.path}" style="flex: 1; padding-left: 20px; padding-right: 20px;">
            {{ route.name }}
          </RouterLink>
        </el-menu-item>
      </template>
    </el-menu>
</template>

<script lang="ts" setup>
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  routes.forEach((route) => {
    if (route.path === key)
      document.title = route.name
  })
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
