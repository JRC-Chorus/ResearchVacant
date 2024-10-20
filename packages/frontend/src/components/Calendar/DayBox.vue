<script setup lang="ts">
import { computed } from 'vue';
import { AnsStatus } from '../../../../backend/src/schema/db/answer';

interface Prop {
  day: number;
  disable?: boolean;
  disappear?: boolean;
}
const prop = defineProps<Prop>();

const selecter = defineModel<AnsStatus>();
const classNames = computed({
  get: () => {
    const returnClass = [];
    returnClass.push(prop.disable ? 'disable' : `active-${selecter.value}`);
    returnClass.push(prop.disappear ? 'disappear' : '');
    return returnClass.join(' ');
  },
  set: (val) => {},
});
</script>

<template>
  <q-btn
    round
    dense
    flat
    :size="$q.screen.gt.xs ? '1.5rem' : '1rem'"
    :disable="disable"
    @click="
      selecter =
        AnsStatus[
          (AnsStatus.findIndex((v) => v === selecter) + 1) % AnsStatus.length
        ]
    "
    :class="classNames"
  >
    <q-tooltip v-if="selecter === 'OK'"> 参加ＯＫ </q-tooltip>
    <q-tooltip v-if="selecter === 'Pending'"> 回答保留（可否未定） </q-tooltip>
    <q-tooltip v-if="selecter === 'NG' && !disable"> 参加ＮＧ </q-tooltip>
    <div>
      <q-icon
        v-if="disable"
        name="pause"
        color="grey-5"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center disable"
      />
      <q-icon
        v-else-if="selecter === 'OK'"
        name="check"
        color="primary"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center"
      >
      </q-icon>
      <q-icon
        v-else-if="selecter === 'Pending'"
        name="hourglass_empty"
        color="warning"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center"
      />
      <q-icon
        v-else-if="selecter === 'NG'"
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
  text-shadow:
           1px 1px 0px #fff, -1px -1px 0px #fff,
          -1px 1px 0px #fff,  1px -1px 0px #fff,
           1px 0px 0px #fff, -1px  0px 0px #fff,
           0px 1px 0px #fff,  0px -1px 0px #fff;
}

.disappear {
  visibility: hidden;
}
</style>
