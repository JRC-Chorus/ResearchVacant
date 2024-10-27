<script setup lang="ts">
// 再読み込みの確認ダイアログを表示
window.onbeforeunload = (e) => {
  e.preventDefault()
};
</script>

<template>
  <router-view />
</template>
