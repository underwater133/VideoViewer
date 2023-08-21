<template>
  <div class="father-box">
    <V3waterfall class="waterfall" :list="state.fileList" srcKey="fullName" :gap="12" :colWidth="200"
      :distanceToScroll="200" scrollBodySelector=".father-box" :isMounted="isMounted" :bottomGap="10">
      <template v-slot:default="slotProp">
        <div class="list-item">
          <img class="images" :src="'file://' + slotProp.item.img" />
          <span class="filename">{{ slotProp.item.name }}</span>
        </div>
      </template>
    </V3waterfall>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { reactive, onMounted, ref } from 'vue'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/dist/style.css'
// https://www.npmjs.com/package/v3-waterfall
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

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

</script>

<style scoped lang="scss">
.father-box {
  height: 100vh;
  background-color: rgb(44, 42, 56);
  padding: 20px 0 0 10px;
  overflow-y: scroll;
}

.list-item {
  // margin-bottom: 20px;

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