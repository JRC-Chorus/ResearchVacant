<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Meta, Todo } from './models';

interface Props {
  title: string;
  todos?: Todo[];
  meta: Meta;
  active: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  todos: () => [],
});

const clickCount = ref(0);
function increment() {
  clickCount.value += 1;
  return clickCount.value;
}

const todoCount = computed(() => props.todos.length);

const sampleResult = ref();

onMounted(() => {
  google?.script.url.getLocation((location) => {
    console.log('### test ###');
    console.log(location.parameter);
    google?.script.run
      .withSuccessHandler((val) => test(val))
      .withFailureHandler((err) => console.log(err))
      .accessManager(location.parameter);
  });
});
function test(val: any[][]) {
  console.log(val);
  sampleResult.value = val;
}
</script>

<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>

  <p>Get Sample Data</p>
  <div>{{ sampleResult }}</div>
</template>
