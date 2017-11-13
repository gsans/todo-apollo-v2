import { Component } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

import { CreateTodoResponse, Todos } from './types';

@Component({
  selector: 'add-todo',
  template: `
    <div class="container">
      <mat-form-field class="field">
        <input #todo matInput placeholder="Add a new todo" (keyup.enter)="addTodo(todo)" class="todo-input">
      </mat-form-field>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: row;
      flex: 1 0 8em;
      font-size: 20px;
    }
    .field {
      width: 100%;
      margin: 0px 20px 0px 20px;
    }
    .todo-input {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class AddTodoComponent {
  constructor(private apollo: Apollo) { }

  public addTodo(input) {
    if (!input.value) return;
    this.apollo.mutate<CreateTodoResponse>({
      mutation: gql`
        mutation addTodo($text: String!) {
          createTodo(text: $text, complete: false) { id }
        }`,
      variables: {
        text: input.value
      },
      update: (store, { data: { createTodo } }) => {
        const query = gql`
          query AllTodos {
            allTodoes { id text complete }
          }
        `;
        const data = store.readQuery<Todos>({ query });
        const newTodo = {
          id: createTodo.id,
          text: input.value,
          complete: false,
          __typename: "Todo"
        };
        store.writeQuery({
          query,
          data: {
            allTodoes: [...data.allTodoes, newTodo],
          },
        });
      },
    }).subscribe({
      next: (response)  => {
        input.value = '';
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

}
