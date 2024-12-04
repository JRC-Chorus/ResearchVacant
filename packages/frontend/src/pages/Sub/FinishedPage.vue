<script setup lang="ts">
import { AnswerSummary, PartyDate } from '@research-vacant/common';
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
          :month="dayjs(summary.ansDates[0].date).month() + 1"
          :party-dates="partyDates"
        />
        <div style="max-width: min(90vw, 50rem); margin: 0 auto">
          <CalendarView :summary="summary" :party-dates="partyDates" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
