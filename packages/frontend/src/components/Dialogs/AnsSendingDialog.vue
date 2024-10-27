<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { sendVacantDates } from 'src/scripts/api';
import { useMainStore } from 'src/stores/main';
import BaseDialog from './BaseDialog.vue';

defineEmits({ ...useDialogPluginComponent.emitsObject });
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const mainStore = useMainStore();
const isLoading = ref(true);

onMounted(async () => {
  await sendVacantDates();

  if (mainStore.error) {
    onDialogCancel();
  }
  isLoading.value = false;
});
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <BaseDialog
      title="回答を提出"
      ok-btn-txt="回答を修正する"
      :disable="isLoading"
      @ok-click="onDialogOK"
    >
      <q-card-section>
        <div v-if="isLoading" class="row items-center q-gutter-x-md">
          <q-circular-progress
            indeterminate
            :thickness="0.2"
            color="primary"
            track-color="transparent"
            class="col-2"
            style="max-width: 3rem;"
          />

          <span class="col" style="font-size: 1.5rem; word-break: keep-all">
            回答をサーバーに<wbr />送信中
          </span>
        </div>

        <div v-else>
          <div class="row items-center q-gutter-x-md q-pb-lg">
            <q-icon name="check" color="primary" size="2rem" class="col-1" />
            <span class="col" style="font-size: 1.5rem">
              送信が完了しました
            </span>
          </div>
          <p>このブラウザを閉じて問題ありません．</p>
          <p>続けて回答を修正する場合は「回答を修正する」を押してください．</p>
        </div>
      </q-card-section>
    </BaseDialog>
  </q-dialog>
</template>
