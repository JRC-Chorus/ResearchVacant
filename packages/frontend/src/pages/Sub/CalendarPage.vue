<script setup lang="ts">
import { AnswerSummary } from '@research-vacant/common';
import dayjs from 'dayjs';
import CalendarView from 'src/components/CalendarView.vue';
import IndentLine from 'src/components/utils/IndentLine.vue';
import { useMainStore } from 'src/stores/main';

interface Prop {
  summary: AnswerSummary;
}
const prop = defineProps<Prop>();

const mainStore = useMainStore();

const startDate = dayjs(prop.summary.ansDates[0].date);
// TODO: 「終了日＝開始日＋回答期間の日数」に変更
const endDate = dayjs(
  prop.summary.ansDates[prop.summary.ansDates.length - 1].date
);
const showingDateFormat = 'YYYY年MM月DD日';
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
            />
          </div>
          <p>空き日程をカレンダーよりご回答ください．</p>

          <div class="gt-md">
            <h2><u>調整＆開催日の詳細情報</u></h2>
            <ul>
              <li>
                <IndentLine title="調査期間" max-width="10rem">
                  {{
                    `${startDate.format(showingDateFormat)} ～ ${endDate.format(
                      showingDateFormat
                    )}`
                  }}
                </IndentLine>
              </li>
              <li>
                <IndentLine title="開催回数" max-width="10rem">
                  <!-- TODO: データベースにこの項目が記録できるフィールドを追加し，MemberSummaryから取得できるようにする -->
                  <!-- TODO: 管理者は個々のテキストをUI上から変更できるような機能を入れる -->
                  ２回（そのうち１回は外部練習を予定）
                </IndentLine>
              </li>
              <li>
                <IndentLine title="備考" max-width="10rem">
                  <!-- TODO: データベースにこの項目が記録できるフィールドを追加し，MemberSummaryから取得できるようにする -->
                  <!-- TODO: 管理者は個々のテキストをUI上から変更できるような機能を入れる -->
                  <i>＜特になし＞</i>
                </IndentLine>
              </li>
            </ul>
          </div>
        </div>
        <div style="max-width: min(90vw, 50rem); margin: 0 auto">
          <CalendarView :summary="summary" />
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
        <!-- TODO: クリック時の挙動は「確認画面を表示 ⇒ 処理」とする -->
        <q-btn
          outline
          size="1rem"
          @click="
            () => {
              mainStore.initAnsModel(summary);
              mainStore.freeTxt = '';
            }
          "
        >
          入力内容をリセット
        </q-btn>
        <!-- TODO: 回答提出機能を実装 -->
        <q-btn fill color="primary" size="1rem"> 回答を提出 </q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>
