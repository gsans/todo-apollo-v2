export interface Todo {
  id: string,
  text?: string,
  complete?: boolean 
}
export interface CreateTodo {
  createTodo: Todo
}
export interface CreateTodoResponse {
  data: CreateTodo
}
export interface Todos {
  allTodoes: Array<Todo>
}

export interface TodosResponse {
  data: Todos
}

export interface ToggleTodo {
  updateTodo: Todo
}
export interface ToggleTodoResponse {
  data: ToggleTodo
}