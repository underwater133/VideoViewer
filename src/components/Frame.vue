<template>
  <div class="frame">
    <div v-show="state.currentPath" class="options">
      <div class="search">
        <el-input v-model="state.keyword" @change="search" class="w-50 m-2" placeholder="请输入名称或tag，多个tag以空格分隔" :prefix-icon="Search" />
      </div>
      <div class="refresh">
        <el-button type="info" round :icon="RefreshRight" :loading="state.loading" @click="refresh"></el-button>
      </div>
    </div>
    <Waterfall
      v-if="state.showList.length > 0"
      :list="state.showList"
      rowKey="name"
      :gutter="20"
      class="waterfall"
      :breakpoints="breakpoints"
      default-expanded-keys
      >
      <template #item="{ item, url, index }">
        <div class="card">
          <LazyImg v-if="item.type == 'folder'" class="folder" :url="'src/assets/folder.png'" @click="openFolder(item.fullName)"></LazyImg>
          <LazyImg v-else class="img" :url="'file://' + item.img" style="border-radius: 8px;" @click="playVideo(item.fullName)" />
          <p class="text">{{ item.name }}</p>
        </div>
      </template>
    </Waterfall>
    <p v-else class="text" style="text-align: center;">空空如也</p>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { getCurrentWebContents } from '@electron/remote'
import { reactive } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import Message from "../util/message";

const emits = defineEmits<{
  (event: 'setLoading', msg: string): void;
}>()

interface File {
  name: string,
  fullName: string,
  path: string,
  type: string,
  img?: string,
}
const state = reactive<{
  fileList: File[],
  showList: File[],
  keyword: string,
  currentPath: string,
  loading: boolean
}>({
  fileList: [],
  showList: [],
  keyword: '',
  currentPath: '',
  loading: false
})

const breakpoints = {
  1920: { //当屏幕宽度小于等于1920
    rowPerView: 4,
  },
  1080: { //当屏幕宽度小于等于1080
    rowPerView: 3,
  },
  720: { //当屏幕宽度小于等于720
    rowPerView: 2,
  },
  480: { //当屏幕宽度小于等于480
    rowPerView: 1
  }
}

const search = () => {
  state.showList = state.fileList.filter(item => item.name.includes(state.keyword))
}

const refresh = () => {
  state.loading = true
  emits('setLoading', '文件加载中')
  ipcRenderer.invoke('getDirFiles', state.currentPath, true)
}

let timer: any = null
const openFolder = (path: string) => {
  if (!timer) {
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
    }, 250)
  } else {
    emits('setLoading', '文件加载中...')
    ipcRenderer.invoke('getDirFiles', path + '/', true)
    const winId = getCurrentWebContents().id
    ipcRenderer.sendTo(winId, 'openFolder', path + '/')
  }
}
const playVideo = (path: string) => {
  ipcRenderer.invoke('playVideo', path)
}

ipcRenderer.on('dirFiles', (event, data) => {
  // console.log(data)
  state.fileList = data.fileList
  state.showList = data.fileList
  state.currentPath = data.currentPath
  if (state.loading) {
    state.loading = false
    Message('刷新成功', 'success')
  }
  emits('setLoading', '')
})

</script>

<style scoped lang="scss">
::v-deep(.img img) {
  cursor: pointer;
  -webkit-user-drag: none;
  user-drag: none;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.2)
  }
}
</style>