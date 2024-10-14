<script setup lang="ts">
import { useMainStore } from 'src/stores/main';

const mainStore = useMainStore();
const accessStatus = () => {
  const tmpStatus = mainStore.getAccessStatus();
  if (
    tmpStatus &&
    tmpStatus.status !== 'invalidUser' &&
    tmpStatus.status !== 'beforeOpening'
  ) {
    return {
      status: tmpStatus.status,
      summary: tmpStatus.summary,
    };
  } else {
    return {
      status: tmpStatus?.status,
    };
  }
};
console.log(accessStatus());
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <h2>Access Status</h2>
    <p>
      {{ accessStatus()?.status }}
    </p>
    <p v-if="accessStatus()?.status !== 'invalidUser'">
      {{ accessStatus()?.summary }}
    </p>
  </q-page>
</template>
