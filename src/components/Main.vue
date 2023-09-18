<template>
  <div class="container">
    <Suspense>
      <Menu ref="menu" @setLoading="setLoading" />
    </Suspense>
    <Frame ref="frame" id="frame" @setLoading="setLoading" />
  </div>
</template>

<script lang="ts" setup>
import Menu, { API as MenuAPI } from './Menu.vue';
import Frame from './Frame.vue';
import { ElMessageBox, ElLoading } from 'element-plus'
import { ref } from 'vue'
import { ipcRenderer, shell } from 'electron';

let loadingInstance: any = null

const menu = ref<MenuAPI | null>(null)

let isShowMessageBox = false // 防止弹出多个提示框

ipcRenderer.on('errorTips', (event, msg) => {
  if (!isShowMessageBox) {
    isShowMessageBox = true
    ElMessageBox.confirm(msg, 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false,
      customClass: 'messageBox'
    }
    ).then(() => {
      if (msg.includes('no such file or directory')) {
        menu.value!.refreshDirTree()
      } else if (msg.includes('ffmpeg')) {
        shell.openExternal('https://www.gyan.dev/ffmpeg/builds/')
      }
      isShowMessageBox = false
    })
  }
})

const setLoading = (msg: string) => {
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      fullscreen: true,
      lock: true,
      text: msg,
      background: 'rgba(0, 0, 0, 0.7)'
    })
  } else {
    loadingInstance.close()
    loadingInstance = null
  }
}

</script>

<style scoped lang="scss">
.container {
  margin-top: 30px;
  width: 100vw;
  display: flex;
}

.leftTitle {
  display: inline-block;
  width: 60%;
}
</style>