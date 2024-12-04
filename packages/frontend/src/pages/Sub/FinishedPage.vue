<script setup lang="ts">
import { AnswerSummary } from '@research-vacant/common';
import dayjs from 'dayjs';
import CalendarView from 'src/components/CalendarView.vue';
import LeftSideView from 'src/components/LeftSideView.vue';

interface Prop {
  summary: AnswerSummary;
  isManager: boolean;
}
defineProps<Prop>();
</script>

<template>
  <q-card flat class="col column">
    <q-card-section class="col column items-center">
      <div class="col"></div>
      <!-- main display -->
      <div class="col row">
        <LeftSideView
          :is-manager="isManager"
          :month="dayjs(summary.ansDates[0].date).month() + 1"
        />
        <div style="max-width: min(90vw, 50rem); margin: 0 auto">
          <CalendarView :summary="summary" />
        </div>
      </div>

      <!-- free text -->
      <!-- <div class="col fit" style="max-width: min(95vw, 80rem)">
        <h2>フリーメッセージ</h2>
        <q-input v-model="mainStore.freeTxt" filled style="font-size: 1rem" />
      </div> -->
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <div class="row q-gutter-x-lg q-py-sm">
        <!-- <q-btn outline size="1rem" :disable="isManager" @click="resetAllAns()">
          入力内容をリセット
        </q-btn>
        <q-btn
          fill
          color="primary"
          size="1rem"
          :disable="isManager"
          @click="submitAns()"
        >
          開催日を確認
        </q-btn> -->
      </div>
    </q-card-actions>
  </q-card>
</template>
