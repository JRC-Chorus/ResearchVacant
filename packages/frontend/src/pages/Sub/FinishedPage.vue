<script setup lang="ts">
import { AnswerSummary, PartyDate } from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';

interface Prop {
  summary: AnswerSummary;
  partyDates: PartyDate[];
  isManager: boolean;
}
const prop = defineProps<Prop>();

const mainStore = useMainStore();
</script>

<template>
  <q-card flat class="col column">
    <q-card-section class="col column items-center">
      <div class="col"></div>
      <!-- main display -->
      <div class="col row">
        <div class="col" style="min-width: 15rem">
          <div class="row justify-between items-center">
            <h1 class="text-bold">
              {{ `${dayjs(summary.ansDates[0].date).month() + 1}月の日程調整` }}
            </h1>
            <q-btn
              flat
              round
              dense
              icon="info"
              color="info"
              size="1.2rem"
              class="lt-lg"
              @click="showInfoDialog()"
            />
          </div>
          <p>回答結果をもとに開催日を決定してください．</p>

          <div class="gt-md">
            <h2><u>開催日の詳細情報</u></h2>
            <ul>
              <li>
                <q-input
                  v-if="isManager"
                  v-model="mainStore.partyCount"
                  dense
                  filled
                  label="開催回数"
                  class="q-my-sm"
                />
                <IndentLine v-else title="開催回数" max-width="10rem">
                  {{ mainStore.partyCount }}
                </IndentLine>
              </li>
              <li>
                <q-input
                  v-if="isManager"
                  v-model="mainStore.bikou"
                  dense
                  filled
                  type="textarea"
                  label="備考欄"
                  class="q-my-sm"
                />
                <IndentLine v-else title="備考欄" max-width="10rem">
                  {{ mainStore.bikou }}
                </IndentLine>
              </li>
            </ul>
          </div>
        </div>
        <div style="max-width: min(90vw, 50rem); margin: 0 auto">
          <CalendarView :summary="summary" :places="places" />
        </div>
      </div>

      <!-- free text -->
      <div class="col fit" style="max-width: min(95vw, 80rem)">
        <h2>フリーメッセージ</h2>
        <q-input v-model="mainStore.freeTxt" filled style="font-size: 1rem" />
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <div class="row q-gutter-x-lg q-py-sm">
        <q-btn outline size="1rem" :disable="isManager" @click="resetAllAns()">
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
        </q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>
