<template>
  <div class="menu">
    <div class="title">
      <span>目录</span>
      <div>
        <el-button type="info" size="small" round :icon="RefreshRight" :loading="state.loading" @click="refreshDirTree"
          class="refresh"></el-button>
      </div>
    </div>
    <div>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="keyword">
      </el-input>
    </div>
    <div class="list">
      <el-tree ref="dirTree" :data="state.dirTree" node-key="fullName" :current-node-key="state.currentNodeKey"
        :props="defaultProps" highlight-current @node-click="handleNodeClick" :expand-on-click-node="false" :filter-node-method="filterNode" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { ipcRenderer } from "electron";
import { RefreshRight } from '@element-plus/icons-vue'
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
  loading: Boolean,
}>({
  dirTree: [],
  currentNodeKey: '',
  loading: false,
})
const dirTree = ref(null)

const handleNodeClick = (data: Tree) => {
  emits('setLoading', '文件加载中...')
  ipcRenderer.invoke('getDirFiles', data.fullName + '/', false)
  state.currentNodeKey = data.fullName + '/'
}

const filterNode = (keyword: string, data: Tree) => {
  if (!keyword) return true
  return data.label.indexOf(keyword) !== -1
}

const keyword = ref('')
watch(keyword, (keyword: string) => {
  console.log(dirTree.value)
  // @ts-ignore
  dirTree.value.filter(keyword)
})

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
  nextTick(() => {
    const key = data
    // @ts-ignore
    const node = dirTree.value.getNode(key)
    if (node) {
      // @ts-ignore
      dirTree.value.setCurrentKey(key)
      // @ts-ignore
      dirTree.value.store.nodesMap[key].expanded = true
    }
  })
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

<style scoped lang="scss"></style>