import { Component, inject, signal } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { TodoService } from '../service/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    imports: [FormsModule]
})
export class TodoComponent {
  private todoService = inject(TodoService);

  // Utiliser le signal du service
  todos = this.todoService.getTodos();
  
  todo = signal<Todo>(new Todo());

  constructor() {}

  addTodo() {
    const currentTodo = this.todo();
    const newTodo = new Todo(
      Date.now(), // ID simple basé sur le timestamp
      currentTodo.name,
      currentTodo.content,
      'waiting'
    );
    
    this.todoService.addTodo(newTodo);
    this.todo.set(new Todo()); // Réinitialiser le formulaire
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo);
  }

  updateTodoStatus(todo: Todo, newStatus: TodoStatus) {
    this.todoService.updateTodoStatus(todo.id, newStatus);
  }

  // Méthodes pour filtrer les todos par statut
  getWaitingTodos() {
    return this.todos().filter(todo => todo.status === 'waiting');
  }

  getInProgressTodos() {
    return this.todos().filter(todo => todo.status === 'in progress');
  }

  getDoneTodos() {
    return this.todos().filter(todo => todo.status === 'done');
  }
}