<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { keys, toEntries } from '@research-vacant/common';
import { useMainStore } from 'src/stores/main';
import IndentLine from '../utils/IndentLine.vue';
import BaseDialog from './BaseDialog.vue';
import { InfoDialogProp } from './iDialogProp';

defineEmits({ ...useDialogPluginComponent.emitsObject });
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

defineProps<InfoDialogProp>();
const mainStore = useMainStore();

const isSpecialHolidayExists = keys(mainStore.specialHoliday).length > 0;
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <BaseDialog
      title="調査の詳細情報"
      ok-btn-txt="閉じる"
      @close="onDialogCancel"
      @ok-click="onDialogOK"
    >
      <q-card-section>
        <div
          v-for="detail in showingDetails"
          :key="detail.title"
          class="q-my-sm"
        >
          <div>{{ detail.title }}</div>
          <span class="q-pl-md" style="font-size: 0.9rem">{{
            detail.desc
          }}</span>
        </div>
        <div v-if="isSpecialHolidayExists" class="q-my-sm">
          <div>祝日</div>
          <ul class="q-ma-none">
            <li
              v-for="sHoliday in toEntries(mainStore.specialHoliday)"
              :key="sHoliday[0]"
            >
              <IndentLine :title="sHoliday[0]" min-width="6rem">
                {{ sHoliday[1] }}
              </IndentLine>
            </li>
          </ul>
        </div>
      </q-card-section>
    </BaseDialog>
  </q-dialog>
</template>
