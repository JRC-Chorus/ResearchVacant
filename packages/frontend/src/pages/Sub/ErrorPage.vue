<script setup lang="ts">
interface Prop {
  title?: string;
  message?: string;
}
defineProps<Prop>();
</script>

<template>
  <p>Error Page</p>
</template>
