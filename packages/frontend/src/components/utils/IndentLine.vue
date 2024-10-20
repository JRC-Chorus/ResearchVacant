<script setup lang="ts">
import { defineProps } from 'vue';

interface Prop {
  title: string;
  maxWidth?: string;
}
defineProps<Prop>();
</script>

<template>
  <div class="row q-gutter-xs">
    <span
      class="flex"
      style="min-width: 10rem"
      :style="{ maxWidth: `min(${maxWidth ?? '15rem'}, 90%)` }"
    >
      {{ title }}
    </span>
    <span class="col" style="min-width: 10rem"><slot /></span>
  </div>
</template>
