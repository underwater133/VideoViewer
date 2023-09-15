<template>
  <div>
    <TitleBar />
    <Main @setTheme="setTheme"/>
  </div>
</template>
<script lang="ts" setup>
import TitleBar from './components/TitleBar.vue';
import Main from './components/Main.vue';
import Store from './util/store';

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
}

const appTheme = Store.get('theme')
setTheme(appTheme as string)

</script>
<style lang="scss"></style>
