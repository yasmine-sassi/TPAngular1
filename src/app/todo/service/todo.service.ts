import { Injectable, inject, signal } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);

  // Utiliser un signal pour la liste des todos
  private todos = signal<Todo[]>([]);

  constructor() {}

  /**
   * Retourne la liste des todos (en lecture seule)
   */
  getTodos() {
    return this.todos.asReadonly();
  }

  /**
   * Ajouter un todo
   */
  addTodo(todo: Todo): void {
    this.todos.update(currentTodos => [...currentTodos, todo]);
  }

  /**
   * Supprimer un todo
   */
  deleteTodo(todo: Todo): boolean {
    this.todos.update(currentTodos => 
      currentTodos.filter(t => t.id !== todo.id)
    );
    return true;
  }

  /**
   * Changer le statut d'un todo
   */
  updateTodoStatus(todoId: number, newStatus: TodoStatus): void {
    this.todos.update(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, status: newStatus } : todo
      )
    );
  }

  /**
   * Logger la liste des todos
   */
  logTodos() {
    this.loggerService.logger(this.todos());
  }
}