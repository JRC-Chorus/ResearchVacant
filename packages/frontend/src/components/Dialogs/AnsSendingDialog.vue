<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { sendVacantDates } from 'src/scripts/api';
import { useMainStore } from 'src/stores/main';
import BaseDialog from './BaseDialog.vue';
import FinishedSending from './SendingDialog/FinishedSending.vue';
import SendingCircle from './SendingDialog/SendingCircle.vue';

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
  mainStore.isEnableReload = true;
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
        <SendingCircle v-if="isLoading" />

        <FinishedSending v-else>
          <p>このブラウザを閉じて問題ありません．</p>
          <p>続けて回答を修正する場合は「回答を修正する」を押してください．</p>
        </FinishedSending>
      </q-card-section>
    </BaseDialog>
  </q-dialog>
</template>
