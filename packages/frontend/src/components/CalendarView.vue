<script setup lang="ts">
import { AnswerSummary, deepcopy } from '@research-vacant/common';
import { useMainStore } from 'src/stores/main';
import DayBox from './Calendar/DayBox.vue';

interface Prop {
  summary: AnswerSummary;
}
const prop = defineProps<Prop>();

const youbi = ['日', '月', '火', '水', '木', '金', '土'];
const mainStore = useMainStore();
mainStore.initAnsModel(prop.summary);

// 初期生成時点でNGの日付は無効にする
const firstAllAns = deepcopy(mainStore.ansModel);

/**
 * 祝日名を取得する
 */
function getSpecialHolidayName(idx: number, isWindowSize_gt_sm: boolean) {
  const thisDay = mainStore.ansModel[idx - 1]?.date;

  if (thisDay) {
    return mainStore.specialHoliday[thisDay]
      ? isWindowSize_gt_sm
        ? mainStore.specialHoliday[thisDay]
        : '*'
      : '';
  }

  return '';
}
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
        v-for="n in 7 * mainStore.showingWeekCount"
        :key="`none-${n}`"
        class="flex justify-center"
        style="width: 14.28%"
      >
        <div
          class="text-center text-red"
          style="min-width: 4rem; height: 0.5rem"
        >
          {{ getSpecialHolidayName(n, $q.screen.gt.sm) }}
        </div>
        <DayBox
          v-model="mainStore.ansModel[n - 1]"
          :day="n - mainStore.ansModel.findIndex((a) => !!a)"
          :disappear="!mainStore.ansModel[n - 1]"
          :disable="firstAllAns[n - 1]?.ans === 'NG'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
