<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { useMainStore } from 'src/stores/main';

const mainStore = useMainStore();
const status: Ref<{ status?: string; summary?: object } | undefined> = ref();

onMounted(async () => {
  status.value = await mainStore.getAccessStatus();
});
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <h2>Access Status</h2>
    <p>
      {{ status?.status }}
    </p>
    <p v-if="status?.status !== 'invalidUser'">
      {{ status?.summary }}
    </p>
  </q-page>
</template>
