<script setup lang="ts">
import { RvDate } from '@research-vacant/common';
import { useMainStore } from 'src/stores/main';

interface Prop {
  targetDate: RvDate;
}
const prop = defineProps<Prop>();

const mainStore = useMainStore();

const isTargetDate = (n: number) =>
  mainStore.ansModel[n - 1]?.date === prop.targetDate;
</script>

<template>
  <div class="container">
    <template v-for="n in 7 * mainStore.showingWeekCount" :key="`none-${n}`">
      <q-icon
        :name="isTargetDate(n) ? 'star' : 'fiber_manual_record'"
        :size="isTargetDate(n) ? '1.5rem' : '.7rem'"
        :color="isTargetDate(n) ? 'red' : 'grey-5'"
        class="fit"
        :class="!mainStore.ansModel[n - 1] ? 'hide' : ''"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: repeat(7, 14.28%);
  grid-auto-rows: 20px;
}

.hide {
  visibility: hidden;
}

.day {
  font-size: 10px;
  font-weight: bold;
}
</style>
