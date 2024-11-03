<script setup lang="ts">
interface Prop {
  title: string;
  minWidth?: string;
  maxWidth?: string;
}
defineProps<Prop>();
</script>

<template>
  <div class="row q-gutter-xs">
    <span
      class="flex"
      :style="{
        minWidth: minWidth ?? '10rem',
        maxWidth: `min(${maxWidth ?? '15rem'}, 90%)`,
      }"
    >
      {{ title }}
    </span>
    <span
      class="col"
      :style="{
        minWidth: minWidth ?? '10rem',
      }"
    >
      <slot />
    </span>
  </div>
</template>
