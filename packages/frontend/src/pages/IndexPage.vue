<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { MemberStatus } from '@research-vacant/common';
import { useMainStore } from 'src/stores/main';
import ApprovePage from './Sub/ApprovePage.vue';
import CalendarPage from './Sub/CalendarPage.vue';
import ErrorPage from './Sub/ErrorPage.vue';
import LoadingPage from './Sub/LoadingPage.vue';

const mainStore = useMainStore();
const status: Ref<MemberStatus | undefined> = ref();

onMounted(async () => {
  status.value = await mainStore.getAccessStatus();
});
</script>

<template>
  <q-page class="items-center flex">
    <div class="column" style="flex: 1 1 0; min-height: inherit">
      <ErrorPage v-if="mainStore.error" />
      <LoadingPage v-else-if="status === void 0" />
      <ErrorPage
        v-else-if="status.status === 'invalidUser'"
        title="無効なユーザーです"
        :message="[
          'アクセスしたユーザーはこの調査の対象者に含まれていないようです．',
          '回答を求められているにもかかわらずこの画面が表示される場合は，管理者にお問い合わせください．',
        ]"
      />
      <ErrorPage
        v-else-if="status.status === 'beforeOpening'"
        title="この調査は回答の収集を開始していません"
        :message="[
          'この調査はまだ回答の収集を開始していないようです．',
          '回答期間になってからこのURLに再度アクセスしてください．',
        ]"
      />
      <ErrorPage
        v-else-if="status.status === 'judging' && !status.isManager"
        title="開催日を決定中です"
        :message="[
          '開催日の決定は調査結果をもとにＢＯＴの管理者が行っています．',
          '管理者が開催日を決定するまで，今しばらくお待ちください．',
        ]"
      />
      <!-- TODO: placesの取得処理をAPI.AccessManager()から分離した後に切り替える -->
      <!-- <ApprovePage
        v-else-if="status.status === 'judging' || mainStore.isShowApproverView"
        :summary="status.summary"
        :places="status.places"
      /> -->
      <ApprovePage
        v-else-if="status.status === 'judging'"
        :summary="status.summary"
        :places="status.places"
      />
      <CalendarPage v-else :summary="status.summary" />
    </div>
  </q-page>
</template>
