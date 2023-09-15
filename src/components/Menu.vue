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
      <el-tree
        ref="dirTree"
        :data="state.dirTree"
        node-key="fullName"
        :current-node-key="state.currentNodeKey"
        :props="defaultProps"
        highlight-current
        @node-click="handleNodeClick"
      />
    </div>
    <el-button class="btns" link>新建目录</el-button>
    <el-button class="btns" link @click="emits('openSettings')">设置</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
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
  currentNodeKey: string
  preClickMenu: String,
  loading: Boolean
}>({
  dirTree: [],
  currentNodeKey: '',
  preClickMenu: '',
  loading: false
})
const dirTree = ref(null)

const handleNodeClick = (data: Tree) => {
  // 点击相同菜单不重新获取数据
  if (state.preClickMenu == '' || state.preClickMenu != data.fullName) {
    state.preClickMenu = data.fullName
    emits('setLoading', '文件加载中...')
    ipcRenderer.invoke('getDirFiles', data.fullName + '/', false)
    state.currentNodeKey = data.fullName + '/'
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

ipcRenderer.on('openFolder', (event, data) => {
  // console.log(data)
  // @ts-ignore
  // const node = dirTree.value.getCurrentNode()
  // const key = dirTree.value.getCurrentKey() + '/second/'
  // const node = dirTree.value.getNode(key)
  // console.log(key)
  // state.currentNodeKey = key
  // dirTree.value.setCurrentKey(key)
  // dirTree.value.setCurrentNode(node)
  // todo
  // 高亮选择当前选择节点
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

</style>