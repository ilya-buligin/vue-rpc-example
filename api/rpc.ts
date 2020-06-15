import { $Methods } from "./shared";

const todos = [
  {
    id: String(Math.random()),
    description: "Build Death Star",
    isDone: false
  }
];

export const methods: $Methods = {
  async getAllTodos() {
    return todos;
  },
  async addTodo({ description }) {
    todos.push({
      id: String(Math.random()),
      description,
      isDone: false
    });
  },
  async markDone({ id }) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      todo.isDone = true;
    }
  }
};
