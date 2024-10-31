<script setup lang="ts">
import { AnsDate, AnsStatus } from '@research-vacant/common';

interface Prop {
  day: number;
  disable?: boolean;
  disappear?: boolean;
}
const prop = defineProps<Prop>();

const selecter = defineModel<AnsDate>();
const classNames = () => {
  const returnClass = [];
  returnClass.push(prop.disable ? 'disable' : `active-${selecter.value?.ans}`);
  returnClass.push(prop.disappear ? 'disappear' : '');
  return returnClass.join(' ');
};

function onClicked() {
  if (selecter.value) {
    selecter.value.ans =
      AnsStatus[
        (AnsStatus.findIndex((v) => v === selecter.value?.ans) + 1) %
          AnsStatus.length
      ];
  }
}
</script>

<template>
  <q-btn
    round
    dense
    flat
    :size="$q.screen.gt.xs ? '1.5rem' : '1rem'"
    :disable="disable"
    @click="onClicked()"
    :class="classNames()"
  >
    <q-tooltip v-if="selecter?.ans === 'OK'"> 参加ＯＫ </q-tooltip>
    <q-tooltip v-if="selecter?.ans === 'Pending'">
      回答保留（可否未定）
    </q-tooltip>
    <q-tooltip v-if="selecter?.ans === 'NG' && !disable"> 参加ＮＧ </q-tooltip>
    <div>
      <q-icon
        v-if="disable"
        name="pause"
        color="grey-5"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center disable"
      />
      <q-icon
        v-else-if="selecter?.ans === 'OK'"
        name="check"
        color="primary"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center"
      >
      </q-icon>
      <q-icon
        v-else-if="selecter?.ans === 'Pending'"
        name="hourglass_empty"
        color="warning"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center"
      />
      <q-icon
        v-else-if="selecter?.ans === 'NG'"
        name="close"
        color="negative"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center"
      />
      <div
        class="absolute-center text-bold day-text"
        :class="prop.disable ? 'disable' : ''"
      >
        {{ day }}
      </div>
    </div>
  </q-btn>
</template>

<style scoped lang="scss">
.active-OK {
  border: 3px solid $primary;
}
.active-Pending {
  border: 3px solid $warning;
}
.active-NG {
  border: 3px solid $negative;
}
.disable {
  opacity: 0.5;
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
