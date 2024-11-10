<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  AnswerSummary,
  CheckedOuterPlace,
  keys,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import CalendarView from 'src/components/CalendarView.vue';
import ApproveSendingDialog from 'src/components/Dialogs/ApproveSendingDialog.vue';
import CheckDialog from 'src/components/Dialogs/CheckDialog.vue';
import {
  CheckDialogProp,
  InfoDialogProp,
  ShowingDetail,
} from 'src/components/Dialogs/iDialogProp';
import InfoDialog from 'src/components/Dialogs/InfoDialog.vue';
import IndentLine from 'src/components/utils/IndentLine.vue';
import { useMainStore } from 'src/stores/main';

interface Prop {
  summary: AnswerSummary;
  places: CheckedOuterPlace[];
}
const prop = defineProps<Prop>();

const $q = useQuasar();
const mainStore = useMainStore();

const showingDetails: ShowingDetail[] = [
  {
    title: '開催回数',
    // TODO: データベースにこの項目が記録できるフィールドを追加し，MemberSummaryから取得できるようにする
    // TODO: 管理者は個々のテキストをUI上から変更できるような機能を入れる
    desc: '２回（そのうち１回は外部練習を予定）',
  },
  {
    title: '備考',
    // TODO: データベースにこの項目が記録できるフィールドを追加し，MemberSummaryから取得できるようにする
    // TODO: 管理者は個々のテキストをUI上から変更できるような機能を入れる
    desc: '＜特になし＞',
  },
];

/**
 * 回答の提出処理を実行
 */
function submitAns() {
  $q.dialog({
    component: ApproveSendingDialog,
  });
}

/**
 * 調査情報の詳細を表示（スマホ版）
 */
function showInfoDialog() {
  $q.dialog({
    component: InfoDialog,
    componentProps: {
      showingDetails: showingDetails,
    } as InfoDialogProp,
  });
}

/**
 * 入力内容のリセット
 */
function resetAllAns() {
  $q.dialog({
    component: CheckDialog,
    componentProps: {
      title: '入力内容のリセット',
      message:
        '決定済みの開催情報がリセットされます．\n入力内容を削除してもよろしいですか．',
      okTxt: 'ＯＫ',
      cancelTxt: 'キャンセル',
    } as CheckDialogProp,
  }).onOk(() => {
    mainStore.isEnableReload = false;
    mainStore.initAnsModel(prop.summary);
    mainStore.freeTxt = '';
  });
}
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
              <li v-for="detail in showingDetails" :key="detail.title">
                <IndentLine :title="detail.title" max-width="10rem">
                  {{ detail.desc }}
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
        <q-btn outline size="1rem" @click="resetAllAns()">
          入力内容をリセット
        </q-btn>
        <q-btn
          fill
          color="primary"
          size="1rem"
          :disable="keys(mainStore.markedDates).length === 0"
          @click="submitAns()"
        >
          開催日を決定
        </q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>
