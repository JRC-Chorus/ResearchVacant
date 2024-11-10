<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { toEntries } from '@research-vacant/common';
import { sendPartyDate } from 'src/scripts/api';
import { useMainStore } from 'src/stores/main';
import BaseDialog from './BaseDialog.vue';
import ApproveDateCard from './SendingDialog/ApproveDateCard.vue';
import FinishedSending from './SendingDialog/FinishedSending.vue';
import SendingCircle from './SendingDialog/SendingCircle.vue';

defineEmits({ ...useDialogPluginComponent.emitsObject });
const { dialogRef, onDialogHide, onDialogCancel } =
  useDialogPluginComponent();

const mainStore = useMainStore();
const isChecking = ref(true);
const isLoading = ref(true);

/** 開催日の承認を押すと，バックエンドに通知を飛ばす */
async function isApproveClicked() {
  isChecking.value = false;
  await sendPartyDate();

  if (mainStore.error) {
    onDialogCancel();
  }
  isLoading.value = false;
  mainStore.isEnableReload = true;
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <BaseDialog
      title="開催日を決定"
      :disable="isLoading"
      @close="onDialogCancel"
    >
      <q-card-section>
        <div v-if="isChecking" class="row justify-evenly q-gutter-md">
          <ApproveDateCard
            v-for="(party, idx) in toEntries(mainStore.markedDates)"
            :key="idx"
            :target-date="party[0]"
          />
          <q-btn
            label="開催日を確定"
            color="primary"
            @click="isApproveClicked"
          />
        </div>

        <SendingCircle v-else-if="isLoading" />

        <FinishedSending v-else>
          <p>開催日の通知が完了しました．</p>
          <p>Teams上にて決定した開催日が通知されているか確認してください．</p>
        </FinishedSending>
      </q-card-section>
    </BaseDialog>
  </q-dialog>
</template>
