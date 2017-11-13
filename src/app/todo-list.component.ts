import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Todo } from './todo.component';
import { VisibleTodosPipe } from './VisibleTodosPipe';

@Component({
  selector: 'todo-list',
  template: `
  <mat-list class="list">
    <todo *ngFor="let todo of todos | visibleTodos:currentFilter"
      [id]="todo.id"
      [text]="todo.text"
      [complete]="todo.complete"
    ></todo>
  </mat-list>
  `,
  styles: [`
    .list {
      height: 200px;
      overflow-y: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  unsubscribe;
  @Input() currentFilter: string = 'SHOW_ALL';
  @Input() todos;
}