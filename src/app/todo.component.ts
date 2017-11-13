import {Component, ContentChildren, Inject, ChangeDetectionStrategy, Input} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { ToggleTodoResponse, Todos } from './types';

@Component({
  selector: 'todo',
  template: `
    <mat-list-item class="container" (click)="onTodoClick()">
      <mat-checkbox class="checkbox" [checked]="complete"></mat-checkbox>
      <div class="todo-text">{{text}}</div>
    </mat-list-item> 
  `,
  styles: [`
    .container {
      cursor: pointer;
    }
    .container:hover {
      background-color: #e8eaf6;
    }
    .checkbox{ 
      margin: 0 20px 0 0;
    }
    .todo-text {
      font-size: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Todo { 
  @Input() id;
  @Input() text;
  @Input() complete;

  constructor(private apollo: Apollo) { }
  
  public onTodoClick(){
    this.apollo.mutate<ToggleTodoResponse>({
      mutation: gql`
        mutation toggleTodo($id: ID!, $complete: Boolean!) {
          updateTodo(id: $id, complete: $complete) { id text complete }
        }`,
      variables: {
        id: this.id,
        complete: !this.complete
      },
      update: (store, { data: { updateTodo } }) => {
        // we ignore as we already have subscription in place

        /* const query = gql`
          query AllTodos {
            allTodoes { id text complete }
          }
        `;
        const data = store.readQuery<Todos>({ query });
        let todos = data.allTodoes.map(todo => {
          if(todo.id === updateTodo.id) {
            return {
              id: updateTodo.id,
              text: updateTodo.text,
              complete: updateTodo.complete,
              __typename: "Todo"
            }
          }
          return todo;
        })
        store.writeQuery({
          query,
          data: {
            allTodoes: todos,
          },
        }); 
        store.writeFragment({
          id: updateTodo.id,
          fragment: gql`
            fragment myTodo on Todo {
              complete
            }
          `,
          data: {
            complete: updateTodo.complete,
            __typename: "Todo"
          },
        });*/
      },
    }).subscribe({
      next: (response)  => {
        //add code
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}