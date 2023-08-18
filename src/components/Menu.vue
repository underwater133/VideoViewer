<template>
  <div class="menu">
    <div class="title">
      <span>目录</span>
      <div>搜索</div>
    </div>
    <div class="list">
      <el-tree :data="state.dirTree" :props="defaultProps" @node-click="handleNodeClick" />

    </div>
    <button>新建目录</button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { ipcRenderer } from "electron";
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
const state = reactive<{
  dirTree: Tree[]
}>({
  dirTree: []
})

const handleNodeClick = (data: Tree) => {
  if (data.children.length == 0) {
    ipcRenderer.invoke('getDirFiles', data.fullName + '/')
  }
}

const getDirTree = () => {
  ipcRenderer.invoke('getDirTree').then(res => {
    state.dirTree = res
  })
}

getDirTree()
onMounted(() => {

})
</script>

<style scoped lang="scss">
.menu {
  height: 100vh;
  background-color: rgb(66, 66, 78);

  .title {
    border-bottom: 1px solid white;
    color: rgb(170, 170, 184);
  }

  .list {
    background-color: rgb(66, 66, 78);
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