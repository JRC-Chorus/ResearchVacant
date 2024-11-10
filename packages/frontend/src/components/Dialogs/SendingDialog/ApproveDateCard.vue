<script setup lang="ts">
import { ref } from 'vue';
import MiniCalendar from './MiniCalendar.vue';
import { RvDate } from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';

interface Prop {
  targetDate: RvDate;
}
defineProps<Prop>();

const mainStore = useMainStore()
const expanded = ref(false)

// TODO: 表示情報を定義しておく
</script>

<template>
  <q-card class="my-card" flat bordered>
    <MiniCalendar :target-date="targetDate" />

    <q-card-section>
      <div class="text-overline text-primary">Overline</div>
      <div class="text-h5 q-mt-sm q-mb-xs">{{ dayjs(targetDate).format(mainStore.showingDateFormat) }}</div>
      <!-- TODO: 場所（リンクを踏めるようにする），参加状況，予約の要否について表示する -->
      <div class="text-caption text-grey">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-card-section>

    <q-card-actions>
      <div>
        回答一覧
      </div>

      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <!-- TODO: 参加者の回答一覧を表示する（日付内の一覧と同じコンポーネントを呼び出す） -->
        <q-card-section class="text-subtitle2">
          SAMPLE TEXT
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
