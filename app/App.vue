<template>
  <div id="app"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Todo } from "../api/shared/todos";

export default Vue.extend({
  name: "App",
  components: {},
  data() {
    const todos: Todo[] = [];

    return {
      todos
    };
  },
  async created() {
    this.todos = await this.$rpc.getAllTodos();
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
