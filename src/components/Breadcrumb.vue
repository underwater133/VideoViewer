<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item v-for="item in bcList" @click="toPath(item.path)">
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ipcRenderer } from "electron";
import { getCurrentWebContents } from '@electron/remote'
import Store from '../util/store';
const emits = defineEmits<{
  (event: 'setLoading', msg: string): void;
}>()

interface Breadcrumb {
  path: string,
  label: string
}
const bcList = ref<Breadcrumb[]>([])

const toPath = (path: string) => {
  if (!path) return
  emits('setLoading', '文件加载中...')
  ipcRenderer.invoke('getDirFiles', path, false)
  const winId = getCurrentWebContents().id
  ipcRenderer.sendTo(winId, 'openFolder', path.slice(0, path.length - 1))
}

ipcRenderer.on('setBreadcrumb', (event, data) => {
  // console.log(data)
  data = data.slice(0, data.length - 1)
  const rootPath = Store.get('rootPath') as string
  const relativePath = data.slice(rootPath.length)
  const labelArr = relativePath.split('/')
  const list: Breadcrumb[] = [
    { label: '根目录', path: '' }
  ]
  labelArr.forEach((item: string, index: number, arr: Array<string>) => {
    const obj = {
      label: item,
      path: ''
    }
    if (index == 0) {
      obj.path = rootPath + item + '/'
    } else {
      obj.path = arr[index - 1] + '/'
    }
    list.push(obj)
  })
  bcList.value = list
})
</script>