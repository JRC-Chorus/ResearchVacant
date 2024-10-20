<script setup lang="ts">
import CalendarView from 'src/components/CalendarView.vue';
import IndentLine from 'src/components/utils/IndentLine.vue';
import { useMainStore } from 'src/stores/main';
import { MemberStatus } from '../../../../backend/src/schema/app';

interface Prop {
  status: MemberStatus;
}
defineProps<Prop>();

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
            <h1 class="text-bold">10月の日程調整</h1>
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
                  <!-- TODO: 実際の値に変更 -->
                  ○○○○年○○月○○日　～　○○○○年○○月○○日
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
          <CalendarView :status="status" />
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
        <q-btn
          outline
          size="1rem"
          @click="
            () => {
              mainStore.initAnsModel(status);
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
