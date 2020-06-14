import { getAllTodos } from "../rpc/todos";

export type Todo = {
  id: string;
  description: string;
  isDone: boolean;
};

export interface getAllTodos {
  (): Promise<Todo[]>;
}

export interface addTodo {
  ({ description: string }): Promise<void>;
}

export interface markDone {
  ({ id: string }): Promise<void>;
}

export interface todos {
  getAllTodos: getAllTodos;
  addTodo: addTodo;
  markDone: markDone;
}
