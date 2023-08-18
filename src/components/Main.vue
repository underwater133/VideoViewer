<template>
  <div class="container">
    <Suspense>
      <Menu class="menu"/>
    </Suspense>
    <Frame ref="frame" id="frame" class="frame"/>
  </div>
</template>

<script lang="ts" setup>
import Menu from './Menu.vue';
import Frame from './Frame.vue';
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  display: flex;
  .menu {
    width: 30%;
    max-width: 300px;
    min-width: 200px;
  }
  .frame {
    flex: 1;
  }
}
</style>