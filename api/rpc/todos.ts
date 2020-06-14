import {
  getAllTodos as IGetAllTodos,
  addTodo as IAddTodo,
  markDone as IMarkDone
} from "../shared/todos";

const todos = [
  {
    id: String(Math.random()),
    description: "Build Death Star",
    isDone: false
  }
];

export const getAllTodos: IGetAllTodos = async () => {
  return todos;
};

export const addTodo: IAddTodo = async ({ description }) => {
  todos.push({
    id: String(Math.random()),
    description,
    isDone: false
  });
};

export const markDone: IMarkDone = async ({ id }) => {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.isDone = true;
  }
};
