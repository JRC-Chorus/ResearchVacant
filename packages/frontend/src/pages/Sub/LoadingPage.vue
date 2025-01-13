<script setup lang="ts"></script>

<template>
  <div class="col flex items-center justify-center">
    <div class="row q-gutter-lg items-center justify-center">
      <div class="loader"></div>
      <h1 class="text-center q-mb-none" style="word-break: keep-all">
        アンケート情報<wbr />を読込中
      </h1>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  width: 4.5rem;
  aspect-ratio: 1;
  display: flex;
  color: $primary;
  border: 4px solid;
  box-sizing: border-box;
  border-radius: 50%;
  background: 
    radial-gradient(circle 5px, currentColor 95%,#0000),
    linear-gradient(currentColor 50%,#0000 0) 50%/4px 60% no-repeat;
  animation: l1 2s infinite linear;
}
.loader:before {
  content: "";
  flex: 1;
  background:linear-gradient(currentColor 50%,#0000 0) 50%/4px 80% no-repeat;
  animation: inherit;
}
@keyframes l1 {
  100% {transform: rotate(1turn)}
}
</style>
