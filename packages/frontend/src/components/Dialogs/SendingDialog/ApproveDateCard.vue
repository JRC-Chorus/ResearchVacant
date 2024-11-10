<script setup lang="ts">
// import { ref } from 'vue';
import {
  AnsStatus,
  AnswerSummary,
  CheckedOuterPlace,
  RvDate,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';
import MiniCalendar from './MiniCalendar.vue';

interface Prop {
  targetDate: RvDate;
  summary: AnswerSummary;
  places: CheckedOuterPlace[];
}
const prop = defineProps<Prop>();

const mainStore = useMainStore();
// const expanded = ref(false);

// 表示情報を定義しておく
const placeId = mainStore.markedDates[prop.targetDate];
const placeObj = prop.places.filter((p) => p.placeId === placeId)[0];
const ansList = prop.summary.ansDates.filter(
  (ans) => ans.date === prop.targetDate
)[0].ans;
const getAnsCount = (status: AnsStatus) =>
  ansList.filter((ans) => ans.status === status)[0].ansPersonNames.length ?? 0;

// カード内の表示項目
const cardItems = [
  {
    icon: 'place',
    iconColor: 'red-5',
    label: placeObj.placeName,
    caption: placeObj.isNeedReserve ? '予約が必要な施設です' : '予約は不要です',
    captionClass: 'text-negative',
  },
  {
    icon: 'check',
    iconColor: 'primary',
    label: `${getAnsCount('OK')}人が参加予定`,
    caption: `保留：${getAnsCount('Pending')}人，欠席：${getAnsCount('NG')}人`,
  },
];
</script>

<template>
  <q-card class="card" flat bordered>
    <MiniCalendar :target-date="targetDate" class="q-ma-md" />

    <q-separator inset />

    <q-card-section>
      <div
        class="text-primary text-bold q-mt-sm q-mb-md"
        style="font-size: 1.2rem; text-decoration: underline"
      >
        {{ dayjs(targetDate).format(mainStore.showingDateFormat) }}
      </div>

      <q-list>
        <q-item v-for="item in cardItems" :key="item.label">
          <q-item-section avatar>
            <q-icon :name="item.icon" :color="item.iconColor" size="1.5rem" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label caption :class="item.captionClass">
              {{ item.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- 回答一覧等を表示する場合には活用 -->
    <!-- <q-card-actions>
      <div>回答一覧</div>

      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions> -->

    <!-- <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subtitle2"> SAMPLE TEXT </q-card-section>
      </div>
    </q-slide-transition> -->
  </q-card>
</template>

<style scoped lang="scss">
.card {
  max-width: 15rem;
}
</style>
