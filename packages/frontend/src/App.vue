<script setup lang="ts">
import { useMainStore } from './stores/main';

const mainStore = useMainStore();

// 再読み込みの確認ダイアログを表示
window.onbeforeunload = (e) => {
  if (import.meta.env.PROD && !mainStore.isEnableReload) {
    e.preventDefault();
  }
};
</script>

<template>
  <router-view />
</template>
