<template>
  <div class="titleBar">
    <span class="appName">Video Viewer</span>
    <div class="win-btns">
      <div class="img">
        <img :src="iconSrcs[0]" @click="emits('openSettings')" />
      </div>
      <div class="img">
        <img :src="iconSrcs[1]" @click="minimizeWin" />
      </div>
      <div class="img">
        <img v-show="!isMax" :src="iconSrcs[2]" @click="maximizeWin" />
        <img v-show="isMax" :src="iconSrcs[3]" @click="maximizeWin" />
      </div>
      <div class="img">
        <img :src="iconSrcs[4]" @mouseover="mouseOnClose" @mouseleave="mouseLeaveClose" @click="closeWin" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron"; // script标签内，引入ipcRenderer
import { reactive, ref, nextTick } from 'vue'

const isMax = ref(false)
const iconSrcs = reactive([
  `src/assets/icon/settings.png`,
  `src/assets/icon/win-min.png`,
  `src/assets/icon/win-max.png`,
  `src/assets/icon/win-win.png`,
  `src/assets/icon/win-close.png`
])

const emits = defineEmits<{
  (event: 'openSettings'): void;
}>()

const mouseOnClose = () => {
  nextTick(() => {
    iconSrcs[3] = `src/assets/icon/win-close-white.png`
  })
}

const mouseLeaveClose = () => {
  nextTick(() => {
    iconSrcs[3] = `src/assets/icon/win-close.png`
  })
}

const minimizeWin = () => {
  ipcRenderer.send('window-min') // 通知主进程我要进行窗口最小化操作
}
const maximizeWin = () => {
  isMax.value = !isMax.value
  ipcRenderer.send('window-max') // 通知主进程我要进行最大化 或 还原
}
const closeWin = () => {
  ipcRenderer.send('window-close') // 通知主进程我要关闭
}

</script>

<style scoped lang="scss"></style>