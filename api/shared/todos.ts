import { getAllTodos } from "../rpc/todos";

export type Todo = {
  description: string;
  isDone: boolean;
};

export interface getAllTodos {
  (): Promise<Todo[]>;
}

export interface todos {
  getAllTodos: getAllTodos;
}
