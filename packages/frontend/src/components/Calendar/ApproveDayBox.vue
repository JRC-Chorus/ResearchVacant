<script setup lang="ts">
import {
  AnsSummaryDate,
  CheckedOuterPlace,
  RvDate,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';

interface Prop {
  date?: RvDate;
  disable?: boolean;
  disappear?: boolean;
  ansDates: AnsSummaryDate[];
  places: CheckedOuterPlace[];
}
const prop = defineProps<Prop>();
const mainStore = useMainStore();

const dateObj = dayjs(prop.date);
// 表示日においてOKを回答した割合
const acceptRatio = () => {
  // 表示日の回答を抽出
  const answers = prop.ansDates.filter((d) => d.date === prop.date)[0]?.ans;
  if (!answers || prop.disable || prop.disappear) {
    return 0;
  }

  // 回答者全員の人数
  const allPersonCount = answers
    .map((a) => a.ansPersonNames.length)
    .reduce((acc, current) => acc + current);
  // 表示日に対してOKを回答した人数
  const okPersonCount =
    answers.filter((a) => a.status === 'OK')[0]?.ansPersonNames.length ?? 0;

  return (okPersonCount / allPersonCount) * 100;
};

const classNames = () => {
  const returnClass = [];
  returnClass.push(prop.disable ? 'disable' : '');
  returnClass.push(prop.disappear ? 'disappear' : '');
  returnClass.push(
    prop.date && mainStore.markedDates.has(prop.date) ? 'selected' : ''
  );
  returnClass.push(
    btnStyle(acceptRatio()).color === 'primary' ? 'checked' : ''
  );
  return returnClass.join(' ');
};

type btnStyleType = {
  color: 'primary' | 'warning' | 'negative';
  icon: string;
};
const btnStyle = (ratio: number): btnStyleType => {
  if (ratio < 50) {
    return {
      color: 'negative',
      icon: 'close',
    };
  } else {
    return {
      color: 'primary',
      icon: 'check',
    };
  }
};

// TODO: クリック時に回答の詳細を表示するダイアログに遷移する
// ダイアログ内で開催日の決定ボタンを設ける
// ダイアログ内に「次の日付に遷移する」ボタンを設ける
function onClicked() {
  if (!prop.date) return;

  if (mainStore.markedDates.has(prop.date)) {
    mainStore.markedDates.delete(prop.date);
  } else {
    mainStore.markedDates.add(prop.date);
  }
}
</script>

<template>
  <q-btn
    dense
    flat
    :disable="disable"
    :class="classNames()"
    @click="onClicked()"
  >
    <div class="text-bold absolute-center-left" style="font-size: 1rem">
      {{ dateObj.date() }}
    </div>
    <q-circular-progress
      show-value
      :value="acceptRatio()"
      :size="$q.screen.gt.xs ? '2.6rem' : '2rem'"
      :thickness="1"
      :color="disable ? 'transparent' : 'primary'"
      :track-color="disable ? 'transparent' : 'red-1'"
      :disable="disable"
      class="q-ma-xs"
    >
      <div>
        <q-icon
          v-if="disable"
          name="pause"
          color="grey-5"
          :size="$q.screen.gt.xs ? '2.5rem' : '1.5rem'"
          class="absolute-center disable"
        />
        <q-icon
          v-else
          :name="btnStyle(acceptRatio()).icon"
          :color="btnStyle(acceptRatio()).color"
          :size="$q.screen.gt.xs ? '2.5rem' : '1.5rem'"
          class="absolute-center day-text"
        />
      </div>
    </q-circular-progress>
  </q-btn>
</template>

<style scoped lang="scss">
.disable {
  opacity: 0.5;
}

.checked {
  margin: -3px;
  border: 3px dotted $primary;
}

.selected {
  margin: -3px;
  border: 3px solid $primary;
  background-color: rgba($color: $primary, $alpha: 0.1);
}

.day-text {
  text-shadow: 1px 1px 0px #fff, -1px -1px 0px #fff, -1px 1px 0px #fff,
    1px -1px 0px #fff, 1px 0px 0px #fff, -1px 0px 0px #fff, 0px 1px 0px #fff,
    0px -1px 0px #fff;
}

.disappear {
  visibility: hidden;
}
</style>
