<template>
  <div>
    <TitleBar @openSettings="openSettings"/>
    <Main />
    <el-dialog v-model="settingVisible" title="设置" width="50%" center class="settings" :close-on-click-modal="false"
      :modal="false" style="min-width: 600px;">
      <p>
        <span class="leftTitle">根目录路径：{{ settings.rootPath }}</span>
        <el-button link @click="setRootPath">设置根目录</el-button>
      </p>
      <p>
        <span class="leftTitle">默认播放器：{{ settings.defaultPlayer == 'start' ? '跟随系统' : settings.defaultPlayer }}</span>
      <div>
        <el-button link @click="setDefaultPlayer('system')">跟随系统</el-button>
        <el-button link @click="setDefaultPlayer('custom')">设置</el-button>
      </div>
      </p>
      <p>
        <span class="leftTitle">主题</span>
      <!-- <div>
        <el-button link @click="setTheme('dark')">暗黑</el-button>
        <el-button link @click="setTheme('light')">明亮</el-button>
      </div> -->
        <el-radio-group class="theme-btns" v-model="settings.theme" size="small" @change="setTheme">
          <el-radio-button label="theme-light">明亮</el-radio-button>
          <el-radio-button label="theme-dark">暗黑</el-radio-button>
        </el-radio-group>
      </p>
      <p>
        <span class="leftTitle">缓存</span>
        <el-button link @click="clearCache">清空缓存</el-button>
      </p>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="settingVisible = false">取消</el-button>
          <el-button type="primary" @click="settingVisible = false">
            应用
          </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import TitleBar from './components/TitleBar.vue';
import Main from './components/Main.vue';
import Store from './util/store';
import { ref, reactive } from 'vue'
import { dialog } from '@electron/remote'
import { ElMessageBox } from 'element-plus'
import Message from './util/message'
import { ipcRenderer } from 'electron';

const settingVisible = ref(false)
const settings = reactive({
  rootPath: Store.get('rootPath') || '',
  defaultPlayer: Store.get('defaultPlayer') || '跟随系统',
  theme: Store.get('theme') || 'theme-light'
})

if (!Store.get('theme')) {
  Store.set('theme', 'theme-light')
}

const setTheme = (theme: string) => {
  document.body.classList.forEach((name, index, list) => {
    if(name.includes('theme')) {
      list.remove(name)
    }
  })
  document.body.classList.add(theme)
  Store.set('theme', theme)
}

setTheme(settings.theme as string)

const clearCache = () => {
  ElMessageBox.confirm(
    '该操作会清空缓存，可能会影响访问目录和文件的速度，是否清空缓存？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      closeOnClickModal: false,
      customClass: 'messageBox'
    }
  )
    .then(() => {
      ipcRenderer.invoke('clearStore').then(res => {
        Message('清空缓存成功', 'success')
      })
    })
}

const openSettings = () => {
  settingVisible.value = true
}

const setRootPath = () => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(res => {
    if (!res.canceled) {
      const path = res.filePaths[0] + '\\'
      ipcRenderer.invoke('setRootPath', path)
      settings.rootPath = path
      Store.set('rootPath', path)
    }
  })
}

const setDefaultPlayer = (type: string) => {
  if (type == 'system') {
    Store.set('defaultPlayer', 'start')
    settings.defaultPlayer = '跟随系统'
  } else {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'player', extensions: ['exe'] }
      ]
    }).then(res => {
      if (!res.canceled) {
        const path = res.filePaths[0]
        settings.defaultPlayer = path
        Store.set('defaultPlayer', path)
      }
    })
  }
}

</script>
<style lang="scss"></style>
