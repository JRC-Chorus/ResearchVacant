<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useMainStore } from 'src/stores/main';
import { InfoDialogProp } from './Dialogs/iDialogProp';
import InfoDialog from './Dialogs/InfoDialog.vue';
import IndentLine from './utils/IndentLine.vue';

interface Prop {
  isManager?: boolean;
  month: number;
}
const prop = defineProps<Prop>();

const $q = useQuasar();
const mainStore = useMainStore();

/**
 * 調査情報の詳細を表示（スマホ版）
 */
function showInfoDialog() {
  $q.dialog({
    component: InfoDialog,
    componentProps: {
      isManager: prop.isManager,
    } as InfoDialogProp,
  });
}
</script>

<template>
  <div class="col" style="min-width: 15rem">
    <div class="row justify-between items-center">
      <h1 class="text-bold">
        {{ `${month}月の日程調整` }}
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
            <span style="white-space: pre-line">
              {{ mainStore.bikou }}
            </span>
          </IndentLine>
        </li>
      </ul>
    </div>
  </div>
</template>
