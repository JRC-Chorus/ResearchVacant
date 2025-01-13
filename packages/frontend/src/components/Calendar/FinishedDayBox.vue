<script setup lang="ts">
import { PartyDate, RvDate } from '@research-vacant/common';
import dayjs from 'dayjs';
import { useMainStore } from 'src/stores/main';

interface Prop {
  date: RvDate;
  partyDates: PartyDate[];
}
const prop = defineProps<Prop>();
const mainStore = useMainStore();

const isPartyDate = prop.partyDates.some((d) => d.date === prop.date);
const dateObj = dayjs(prop.date);

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
    style="pointer-events: none"
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
        color="positive"
        :size="$q.screen.gt.xs ? '3rem' : '1.5rem'"
        class="absolute-center"
      />
      <div class="absolute-center text-bold day-text">
        <div style="width: max-content">
          <span
            v-if="mainStore.targetMonth !== dateObj.month() + 1"
            class="month"
          >
            {{ dateObj.month() + 1 }}/
          </span>
          <span> {{ dateObj.date() }}</span>
        </div>
      </div>
    </div>
  </q-btn>
</template>

<style scoped lang="scss">
.active-OK {
  border: 3px solid $positive;
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

.month {
  font-size: 1rem;
  display: inline-block;
  vertical-align: top;
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
  border: 3px solid $positive;
  background-color: rgba($color: $positive, $alpha: 0.1);
}
</style>
