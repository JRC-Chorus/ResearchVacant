<script setup lang="ts">
import { PartyDate, RvDate } from '@research-vacant/common';
import dayjs from 'dayjs';

interface Prop {
  date?: RvDate;
  partyDates: PartyDate[];
}
const prop = defineProps<Prop>();

const isPartyDate = prop.partyDates.some((d) => d.date === prop.date);

const classNames = () => {
  const returnClass = [];
  returnClass.push(prop.date ? '' : 'disappear');
  returnClass.push(isPartyDate ? 'selected' : 'disable');
  return returnClass.join(' ');
};
</script>

<template>
  <q-btn
    round
    dense
    flat
    :size="$q.screen.gt.xs ? '1.5rem' : '1rem'"
    :class="classNames()"
    style="pointer-events: none;"
  >
    <div>
      <q-icon
        v-if="!isPartyDate"
        name="pause"
        color="grey-5"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center disable"
      />
      <q-icon
        v-else
        name="check"
        color="primary"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center"
      />
      <div class="absolute-center text-bold day-text">
        {{ dayjs(date).date() }}
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

.selected {
  margin: -3px;
  border: 3px solid $primary;
  background-color: rgba($color: $primary, $alpha: 0.1);
}
</style>
