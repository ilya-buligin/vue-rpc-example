import { getAllTodos as IGetAllTodos } from "../shared/todos";

export const getAllTodos: IGetAllTodos = async () => {
  return [
    {
      description: "Test",
      isDone: false
    }
  ];
};
