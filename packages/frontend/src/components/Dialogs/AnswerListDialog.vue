<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import {
  CheckedOuterPlace,
  keys,
  RvDate,
  SHOWING_DATE_FORMAT,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';
import { iconList, isEnableDate } from '../Calendar/script';
import IndentLine from '../utils/IndentLine.vue';
import BaseDialog from './BaseDialog.vue';
import { AnswerListDialogProp } from './iDialogProp';

const prop = defineProps<AnswerListDialogProp>();
defineEmits({ ...useDialogPluginComponent.emitsObject });
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const mainStore = useMainStore();

// 表示中の日付がカレンダー全体のどのインデックスか
const showingDate = ref(prop.date);
// 既に設定されている場所がある場合は選択する
const getDefaultSelectedPlaceIdx = (newDate: RvDate) => {
  const alreadySelectedPlaceIdx = prop.places.findIndex(
    (p) => p.placeId === mainStore.markedDates[newDate]
  );
  return alreadySelectedPlaceIdx === -1 ? undefined : alreadySelectedPlaceIdx;
};
const selectedPlace: Ref<number | undefined> = ref(
  getDefaultSelectedPlaceIdx(prop.date)
);
// 既に開催日としてマークされているか
const isMarked = () => keys(mainStore.markedDates).includes(showingDate.value);

/** 施設が利用可能か否か */
function isUsablePlace(place: CheckedOuterPlace) {
  return (
    place.vacantInfo.find((info) => info.date === showingDate.value)?.ans ===
    'OK'
  );
}

/** 指定したURLを別ウィンドウで開く */
function openURL(url?: string) {
  window.open(url, '_blank');
}

/** 開催登録＆ダイアログを閉じる */
function onMarkClicked() {
  if (selectedPlace.value !== void 0) {
    mainStore.markedDates[showingDate.value] =
      prop.places[selectedPlace.value].placeId;
  }

  onDialogOK();
}

/** 開催登録を解除 */
function onUnmarkClicked() {
  delete mainStore.markedDates[showingDate.value];
  onDialogOK();
}
</script>

<template>
  <!-- TODO: Update a BAAAAAAAAAAD Design -->
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <BaseDialog
      :title="`${dayjs(showingDate).format(SHOWING_DATE_FORMAT)}の回答一覧`"
      @close="onDialogCancel"
      style="width: 40rem; max-width: 100vw; max-height: 90vh"
    >
      <q-carousel
        v-model="showingDate"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        control-type="regular"
        control-color="primary"
        padding
        arrows
        style="height: 60vh"
        @transition="
          (newVal) => {
            selectedPlace = getDefaultSelectedPlaceIdx(RvDate.parse(newVal));
          }
        "
      >
        <!-- 休日を除外して横スキップできるようにする -->
        <q-carousel-slide
          v-for="(d, idx) in ansDates.filter((ans) =>
            isEnableDate(ansDates, ans.date)
          )"
          :name="d.date"
          :key="idx"
        >
          <div class="row q-gutter-y-lg">
            <div class="col" style="min-width: 15rem">
              <h2 class="q-pt-none">会場一覧</h2>
              <q-list dense>
                <q-item
                  v-for="(place, idx) in places"
                  :key="place.placeName"
                  tag="label"
                  :disable="!isUsablePlace(place)"
                >
                  <q-item-section side top>
                    <q-radio
                      v-model="selectedPlace"
                      :val="idx"
                      color="primary"
                      :disable="!isUsablePlace(place)"
                    />
                  </q-item-section>
                  <q-item-section>
                    {{ place.placeName }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col" style="min-width: 15rem">
              <h2 class="q-pt-none">回答者一覧</h2>
              <q-list dense>
                <template v-for="ans in d.ans">
                  <q-item v-for="pName in ans.ansPersonNames" :key="pName">
                    <q-item-section avatar>
                      <q-icon
                        :name="iconList[ans.status].icon"
                        :color="iconList[ans.status].color"
                        size="1.3rem"
                      />
                    </q-item-section>
                    <q-item-section>
                      {{ pName }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-list>
            </div>
          </div>

          <div class="full-width">
            <h2>自由記述</h2>
            <ul>
              <li v-for="comment in freeTxts" :key="comment.ansName">
                <IndentLine :title="comment.ansName" max-width="10rem">
                  {{ comment.txt }}
                </IndentLine>
              </li>
            </ul>
          </div>
        </q-carousel-slide>
      </q-carousel>

      <q-separator class="q-mt-md" />

      <template #additionalBtns>
        <q-btn label="キャンセル" @click="onDialogCancel" />
        <q-btn
          v-if="!isMarked()"
          label="開催日に設定"
          color="primary"
          :disable="selectedPlace === void 0"
          @click="onMarkClicked"
        />
        <q-btn
          v-else
          label="開催日の設定を解除"
          color="negative"
          @click="onUnmarkClicked"
        />
      </template>
    </BaseDialog>
  </q-dialog>
</template>
