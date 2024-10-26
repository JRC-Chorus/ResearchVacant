<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { MemberStatus } from '@research-vacant/common';
import { useMainStore } from 'src/stores/main';
import CalendarPage from './Sub/CalendarPage.vue';
import ErrorPage from './Sub/ErrorPage.vue';
import LoadingPage from './Sub/LoadingPage.vue';

const mainStore = useMainStore();
const status: Ref<MemberStatus | undefined> = ref();

onMounted(async () => {
  status.value = await mainStore.getAccessStatus();
});
</script>

<template>
  <q-page class="items-center flex">
    <div class="column" style="flex: 1 1 0; min-height: inherit">
      <ErrorPage v-if="mainStore.error" />
      <LoadingPage v-else-if="status === void 0" />
      <CalendarPage v-else :status="status" />
    </div>
  </q-page>
</template>
