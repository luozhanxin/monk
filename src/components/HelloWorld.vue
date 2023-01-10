<template>
  <h1>{{ msg }}</h1>
  <button @click="setCount">{{ count }}</button>
  <input type="text" v-model="todo" />
  <button class="addTodo" @click="addTodo">add</button>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{ todo }}</li>
  </ul>
  <button class="loadUser" @click="loadUser">load</button>
  <p v-if="user.loading" class="loading">Loading</p>
  <div v-else class="userName">{{ user.data && user.data.username }}</div>
  <p v-if="user.error" class="error">error!</p>
  <hello msg="1234"></hello>
  <a-button @click="count++">test</a-button>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import axios from "axios";
import Hello from "./Hello.vue";
import { useCounterStore } from "@/stores/counter";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  emits: ["send"],
  components: {
    Hello,
  },
  setup(props, context) {
    const store = useCounterStore();
    const count = ref(1);
    const todos = ref<string[]>([]);
    const todo = ref("");
    const user = reactive({
      data: null as any,
      loading: false,
      error: false,
    });
    const setCount = () => {
      count.value++;
    };
    const addTodo = () => {
      if (todo.value) {
        todos.value.push(todo.value);
        context.emit("send", todo.value);
      }
    };
    const loadUser = () => {
      user.loading = true;
      axios
        .get("Https://jsonplaceholder.typicode.com/users/1")
        .then((resp) => {
          console.log(resp);
          user.data = resp.data;
          user.loading = false;
          message.success("success");
          store.increment();
        })
        .catch(() => {
          user.error = true;
          user.loading = false;
        });
    };
    return {
      count,
      todo,
      todos,
      user,
      setCount,
      addTodo,
      loadUser,
    };
  },
});
</script>
