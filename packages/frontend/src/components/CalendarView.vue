<script setup lang="ts">
import {
  AnswerSummary,
  CheckedOuterPlace,
  PartyDate,
} from '@research-vacant/common';
import { useMainStore } from 'src/stores/main';
import ApproveDayBox from './Calendar/ApproveDayBox.vue';
import DayBox from './Calendar/DayBox.vue';
import FinishedDayBox from './Calendar/FinishedDayBox.vue';
import { isEnableDate } from './Calendar/script';

interface Prop {
  summary: AnswerSummary;
  places?: CheckedOuterPlace[];
  partyDates?: PartyDate[];
}
const prop = defineProps<Prop>();

const youbi = ['日', '月', '火', '水', '木', '金', '土'];
const mainStore = useMainStore();
mainStore.initAnsModel(prop.summary);

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
    <div class="row q-gutter-y-md" style="margin-left: -3px">
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
        <ApproveDayBox
          v-if="places"
          :date="mainStore.ansModel[n - 1]?.date"
          :disappear="!mainStore.ansModel[n - 1]"
          :disable="!isEnableDate(summary, mainStore.ansModel[n - 1]?.date)"
          :ans-dates="summary.ansDates"
          :free-txts="summary.freeTxts"
          :places="places"
        />
        <FinishedDayBox
          v-else-if="partyDates"
          :date="mainStore.ansModel[n - 1]?.date"
          :party-dates="partyDates"
        />
        <DayBox
          v-else
          v-model="mainStore.ansModel[n - 1]"
          :day="n - mainStore.ansModel.findIndex((a) => !!a)"
          :disappear="!mainStore.ansModel[n - 1]"
          :disable="!isEnableDate(summary, mainStore.ansModel[n - 1]?.date)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
