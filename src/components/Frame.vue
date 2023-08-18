<template>
  <!-- <div class="frame">
    <div class="list-item" v-for="(item, index) in state.fileList" :key="index">
      <img class="images" :src="'file://' + item.fullName" />
      <span class="filename">{{ item.name }}</span>
    </div>
  </div> -->
  <!-- <el-row :gutter="15">
    <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="4" class="list-item" v-for="(item, index) in state.fileList"
      :key="index">
      <img class="images" :src="'file://' + item.fullName" />
      <span class="filename">{{ item.name }}</span>
    </el-col>
  </el-row> -->
  <div class="wrap">
    <div id='forcenter'></div>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { reactive, onMounted } from 'vue'
interface File {
  name: string,
  fullName: string,
  path: string,
  type: string,
  img?: string
}
const state = reactive<{
  fileList: File[]
}>({
  fileList: []
})
ipcRenderer.on('dirFiles', (event, data) => {
  console.log(data)
  state.fileList = data
})
</script>

<style scoped lang="scss">
// .frame {
//   height: 100vh;
//   background-color: rgb(44, 42, 56);
//   padding: 20px 0 0 20px;
//   overflow-y: scroll;
//   display: flex;
//   justify-content: flex-start;
//   align-content: baseline;
//   flex-wrap: wrap;

//   .list-item {
//     width: 150px;
//     height: 230px;
//     margin: 0 2% 10px 0;

//     &:last-child {
//       margin-bottom: 50px;
//     }

//     .images {
//       width: 100%;
//       height: 200px;
//       display: block;
//       border-radius: 10px;
//     }

//     .filename {
//       color: #fff;
//       display: inline-block;
//       width: 100%;
//       text-overflow: ellipsis;
//       overflow: hidden;
//       white-space: nowrap;
//       word-break: break-all;
//     }
//   }
// }
.el-row {
  height: 100vh;
  background-color: rgb(44, 42, 56);
  padding: 20px 0 0 20px;
  overflow-y: scroll;
  margin: 0 !important;
}

.list-item {
  margin-bottom: 20px;
  // max-width: 180px !important;
  min-width: 140px !important;

  .images {
    width: 100%;
    max-height: 200px;
    display: block;
    border-radius: 10px;
  }

  .filename {
    color: #fff;
    display: inline-block;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
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