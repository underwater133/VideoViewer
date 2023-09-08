<template>
  <div>
    <div v-show="state.currentPath" class="options">
      <div class="search">
        <el-input v-model="state.keyword" class="w-50 m-2" placeholder="Type something" :prefix-icon="Search" />
      </div>
      <div class="refresh">
        <el-button type="info" round :icon="RefreshRight" :loading="state.loading" @click="refresh"></el-button>
      </div>
    </div>
    <Waterfall v-if="state.fileList.length > 0" :list="state.fileList" rowKey="name" backgroundColor="#2C2A38" :gutter="15"
      style="height: 85%; overflow-y: scroll;">
      <template #item="{ item, url, index }">
        <div class="card">
          <LazyImg class="img" :url="'file://' + item.img" style="border-radius: 8px;" @click="playVideo(item.fullName)" />
          <p class="text" style="color: rgb(211, 211, 211);">{{ item.name }}</p>
        </div>
      </template>
    </Waterfall>
    <p v-else style="color: rgb(211, 211, 211); text-align: center;">空空如也</p>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
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
  keyword: string,
  currentPath: string,
  loading: boolean
}>({
  fileList: [],
  keyword: '',
  currentPath: '',
  loading: false
})

const refresh = () => {
  state.loading = true
  emits('setLoading', '文件加载中')
  ipcRenderer.invoke('getDirFiles', state.currentPath, true)
}

const playVideo = (path: string) => {
  ipcRenderer.invoke('playVideo', path)
}

ipcRenderer.on('dirFiles', (event, data) => {
  console.log(data)
  state.fileList = data.fileList
  state.currentPath = data.currentPath
  if (state.loading) {
    state.loading = false
    Message('刷新成功', 'success')
  }
  emits('setLoading', '')
})

</script>

<style scoped lang="scss">
.options {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2C2A38;

  .search {
    width: 300px;
  }
}

::v-deep(img) {
  cursor: pointer;
  -webkit-user-drag: none;
  user-drag: none;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.2)
  }
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  opacity: 0.2;
  background: rgb(66, 66, 78);
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  background: fade(rgb(220, 216, 244), 60%);
}
</style>