<script setup lang="ts">
interface Prop {
  day: number;
  disable?: boolean;
}
defineProps<Prop>();

const isSelect = defineModel<boolean>();
</script>

<template>
  <q-btn
    round
    dense
    flat
    :label="day"
    @click="isSelect = !isSelect"
    size="1.5rem"
    :class="isSelect ? 'selected' : 'un-selected'"
    class="gt-xs"
  />
  <q-btn
    round
    dense
    flat
    :label="day"
    @click="isSelect = !isSelect"
    size="1rem"
    :class="isSelect ? 'selected' : 'un-selected'"
    class="lt-sm"
  />
</template>

<style scoped lang="scss">
.selected {
  background-color: $primary;
  color: white;
}

.un-selected {
  border: 1px solid #d0d0d0;
}
</style>
