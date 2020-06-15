export type Todo = {
  id: string;
  description: string;
  isDone: boolean;
};

export type $Methods = {
  getAllTodos: () => Promise<Todo[]>;
  addTodo: ({ description }: { description: string }) => Promise<void>;
  markDone: ({ id }: { id: string }) => Promise<void>;
}
