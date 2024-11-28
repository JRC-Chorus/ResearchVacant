<template>
  <div class="row items-center q-gutter-x-md">
    <q-circular-progress
      indeterminate
      :thickness="0.2"
      color="primary"
      track-color="transparent"
      class="col-2"
      style="max-width: 3rem"
    />

    <span class="col" style="font-size: 1.5rem; word-break: keep-all">
      回答をサーバーに<wbr />送信中
    </span>
  </div>
</template>
