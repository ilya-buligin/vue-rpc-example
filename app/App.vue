<template>
  <div id="app">
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ 'is-done': todo.isDone }"
      >
        <span>{{ todo.description }}</span>
        <button v-if="!todo.isDone" @click="markDone(todo.id)">Done</button>
      </li>
    </ul>
    <form @submit.prevent="addTodo">
      <input type="text" v-model="newTodo" placeholder="New todo..." />
      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Todo } from "../api/shared";

export default Vue.extend({
  name: "App",
  components: {},
  data() {
    const todos: Todo[] = [];
    const newTodo = "";

    return {
      todos,
      newTodo
    };
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      this.todos = await this.$rpc.getAllTodos();
    },
    async addTodo() {
      const description = this.newTodo;
      this.newTodo = "";
      await this.$rpc.addTodo({ description });
      await this.fetchTodos();
    },
    async markDone(id: string) {
      await this.$rpc.markDone({ id });
      await this.fetchTodos();
    }
  }
});
</script>

<style lang="scss">
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin: 0;
}

#app {
  width: 100%;
  max-width: 300px;

  ul {
    list-style-type: none;
    margin: 30px 0;
    padding: 0;

    li {
      width: 100%;
      display: flex;
      margin-bottom: 6px;

      span {
        flex-grow: 1;
      }
    }

    li.is-done {
      text-decoration: line-through;
    }
  }

  form {
    display: flex;

    input {
      flex-grow: 1;
    }
  }
}
</style>
