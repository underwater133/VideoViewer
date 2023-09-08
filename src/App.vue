<template>
  <TitleBar />
  <Main />
</template>
<script lang="ts" setup>
import TitleBar from './components/TitleBar.vue';
import Main from './components/Main.vue';
</script>
<style lang="scss">
.messageBox {
  background-color: #242434;
  border: none;
  color: #fff;
  .el-message-box__title {
    color: #fff;
  }
  .el-message-box__message {
    color: rgb(211, 211, 211);
  }
  .el-button {
    background-color: rgb(238, 241, 255);
    border: none;
    &:hover {
      color: rgb(211, 211, 211);
    }
  }
  .el-button--primary {
    background-color: #2e2e39;
  }

}
</style>
