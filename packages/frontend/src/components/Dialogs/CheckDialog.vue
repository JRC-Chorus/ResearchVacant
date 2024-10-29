<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import BaseDialog from './BaseDialog.vue';
import { CheckDialogProp } from './iDialogProp';

defineEmits({ ...useDialogPluginComponent.emitsObject });
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

defineProps<CheckDialogProp>();
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <BaseDialog
      :title="title"
      :ok-btn-txt="okTxt"
      @close="onDialogCancel"
      @ok-click="onDialogOK"
    >
      <q-card-section>
        <div class="row items-center q-gutter-x-md">
          <q-icon name="info" color="info" size="2.5rem" class="col-1" />
          <span class="col" style="white-space: pre-line">{{ message }}</span>
        </div>
      </q-card-section>

      <template #additionalBtns>
        <q-btn :label="cancelTxt" @click="onDialogCancel" />
      </template>
    </BaseDialog>
  </q-dialog>
</template>
