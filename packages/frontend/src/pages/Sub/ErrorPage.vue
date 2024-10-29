<script setup lang="ts">
import { useMainStore } from 'src/stores/main';

interface Prop {
  title?: string;
  message?: string[];
}
defineProps<Prop>();

const mainStore = useMainStore();
</script>

<template>
  <div class="col row items-center justify-center">
    <q-card flat>
      <q-card-section horizontal>
        <q-card-section class="flex flex-center">
          <q-icon name="cancel" color="negative" size="3rem" />
        </q-card-section>
        <q-card-section>
          <q-card-section>
            <div class="error-title">{{ mainStore.error?.name ?? title }}</div>
          </q-card-section>
          <q-separator inset class="q-my-md" />
          <q-card-section style="white-space: pre-line">
            {{ mainStore.error?.message ?? message?.join('\n') }}
          </q-card-section>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.error-title {
  font-size: 2rem;
  font-weight: bold;
  text-decoration: underline $negative 10px;
}
</style>
