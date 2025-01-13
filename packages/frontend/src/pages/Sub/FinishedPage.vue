<script setup lang="ts">
import {
  AnswerSummary,
  PartyDate,
  SHOWING_DATE_FORMAT,
} from '@research-vacant/common';
import dayjs from 'dayjs';
import CalendarView from 'src/components/CalendarView.vue';
import LeftSideView from 'src/components/LeftSideView.vue';

interface Prop {
  summary: AnswerSummary;
  partyDates: PartyDate[];
  isManager: boolean;
}
defineProps<Prop>();
</script>

<template>
  <q-card flat class="col column">
    <q-card-section class="col column items-center">
      <div class="col"></div>
      <!-- main display -->
      <div class="col row">
        <LeftSideView
          status="finished"
          :month="dayjs(summary.ansDates[0].date).month() + 1"
          :party-dates="partyDates"
        >
          <div
            style="border: 4px solid green"
            class="column q-pa-md q-my-md text-bold text-h6 text-center"
          >
            <div class="col">決定した開催日</div>
            <q-separator inset class="q-my-sm" />
            <div
              v-for="pDate in partyDates"
              :key="pDate.date"
              class="col justify-center row"
            >
              <span>{{ dayjs(pDate.date).format(SHOWING_DATE_FORMAT) }}</span>
              <span class="q-mx-xs">＠</span>
              <a v-if="pDate.pos.placeURL" :href="pDate.pos.placeURL">
                {{ pDate.pos.placeName }}
              </a>
              <span v-else>
                {{ pDate.pos.placeName }}
              </span>
            </div>
          </div>
        </LeftSideView>
        <div style="max-width: min(90vw, 50rem); margin: 0 auto">
          <CalendarView :summary="summary" :party-dates="partyDates" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
