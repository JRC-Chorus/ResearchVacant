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
      <q-card-section class="q-pa-none">
        <q-card-section class="row items-center">
          <q-icon name="cancel" color="negative" size="3rem" />
          <div class="error-logo-txt">Error</div>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <q-card-section>
            <div class="error-title">{{ mainStore.error?.message ?? title }}</div>
          </q-card-section>
          <q-separator inset class="q-my-md" />
          <q-card-section style="white-space: pre-line">
            {{ mainStore.error?.cause ?? message?.join('\n') }}
          </q-card-section>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.error-logo-txt {
  color: $negative;
  font-weight: 500;
  font-size: 2rem;
  margin-left: 1rem;
}

.error-title {
  font-size: 2rem;
  font-weight: bold;
  text-decoration: underline $negative 10px;
}
</style>
