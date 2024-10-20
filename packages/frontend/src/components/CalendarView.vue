<script setup lang="ts">
import { MemberStatus } from '../../../backend/src/schema/app';
import DayBox from './Calendar/DayBox.vue';

interface Prop {
  status: MemberStatus;
}
defineProps<Prop>();

const youbi = ['日', '月', '火', '水', '木', '金', '土'];
</script>

<template>
  <div class="fit">
    <div class="row q-gutter-none q-pb-md">
      <div
        v-for="n in 7"
        :key="n"
        class="flex justify-center"
        style="width: 14.28%"
      >
        {{ youbi[n - 1] }}
      </div>
    </div>
    <div class="row q-gutter-x-none q-gutter-y-md">
      <div
        v-for="n in 7 * 5"
        :key="`none-${n}`"
        class="flex justify-center"
        style="width: 14.28%"
      >
        <DayBox :day="n" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
