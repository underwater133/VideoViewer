<template>
  <div class="menu">
    <div class="title">
      <span>目录</span>
      <div>
        <el-button type="info" size="small" round :icon="RefreshRight" :loading="state.loading" @click="refreshDirTree"
          class="refresh"></el-button>
      </div>
    </div>
    <div>搜索</div>
    <div class="list">
      <el-tree :data="state.dirTree" :props="defaultProps" @node-click="handleNodeClick" />
    </div>
    <el-button class="btns" link>新建目录</el-button>
    <el-button class="btns" link @click="emits('openSettings')">设置</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ipcRenderer } from "electron";
import { Search, RefreshRight } from '@element-plus/icons-vue'
import Message from '../util/message'
interface Tree {
  label: string,
  name: string,
  fullName: string,
  path: string,
  depth: number,
  children: Tree[]
}
const defaultProps = {
  children: 'children',
  label: 'label',
}
const emits = defineEmits<{
  (event: 'openSettings'): void;
  (event: 'setLoading', msg: string): void;
}>()
const state = reactive<{
  dirTree: Tree[],
  preClickMenu: String,
  loading: Boolean
}>({
  dirTree: [],
  preClickMenu: '',
  loading: false
})

const handleNodeClick = (data: Tree) => {
  // 点击相同菜单不重新获取数据
  if (data.children.length == 0 && (state.preClickMenu == '' || state.preClickMenu != data.fullName)) {
    state.preClickMenu = data.fullName
    emits('setLoading', '文件加载中...')
    ipcRenderer.invoke('getDirFiles', data.fullName + '/', false)
  }
}

const getDirTree = (refresh: boolean) => {
  ipcRenderer.invoke('getDirTree', refresh).then(res => {
    state.dirTree = res
    if (state.loading) {
      state.loading = false
      Message('刷新成功', 'success')
    }
  })
}

ipcRenderer.on('changeRootPath', (event, data) => {
  getDirTree(true)
})

const refreshDirTree = () => {
  state.loading = true
  getDirTree(true)
}



getDirTree(false)

// 暴露出接口和方法给父组件使用
export interface API {
  refreshDirTree: Function;
}
defineExpose({
  refreshDirTree,
});
</script>

<style scoped lang="scss">
.menu {
  height: 100vh;
  background-color: rgb(66, 66, 78);
  color: rgb(170, 170, 184);
  font-size: 18px;

  .title {
    border-bottom: 1px solid white;
    font-size: 18px;
    display: flex;
    justify-content: space-between;

    .refresh {
      font-size: 14px;
      color: white;
    }
  }

  .list {
    background-color: rgb(66, 66, 78);
  }

  .btns {
    display: block;
    margin: 5px 0;
    color: rgb(170, 170, 184);
    font-size: 18px;
  }
}


:deep(.el-tree) {
  background-color: rgb(66, 66, 78);
  color: rgb(170, 170, 184);
}

:deep(.el-tree-node:focus>.el-tree-node__content) {
  background-color: rgba(49, 49, 55, 0.8);
}

:deep(.el-tree-node__content:hover) {
  background-color: rgba(49, 49, 55, 0.8);
}
</style>