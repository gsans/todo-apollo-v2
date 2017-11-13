import { ApolloQueryResult } from 'apollo-client';
import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { Todos, Todo } from './types';

@Component({
  selector: 'app-root',
  template: 
    `
    <flip [flipped]="flipped">
      <flip-front class="front">
        <mat-card class="card" [ngClass]="{'flipped': flipped}">
          <mat-card-header style="flex-direction: column;">
            <div class="box">
              <div class="title" (click)="flipped=!flipped">{{title}} <mat-icon >info</mat-icon></div>
            </div>
          </mat-card-header>
          <mat-card-content>
            <add-todo></add-todo>
            <div *ngIf="!loading&&todos?.length>0">
              <mat-tab-group mat-stretch-tabs="yes" (selectedTabChange)="setFilter($event)">
                <mat-tab label="All"></mat-tab>
                <mat-tab label="Active"></mat-tab>
                <mat-tab label="Completed"></mat-tab>
              </mat-tab-group>
            </div>
            <mat-spinner *ngIf="loading"></mat-spinner>
            <div class="message box" *ngIf="!loading && todos?.length<1">Ups! There are no todos yet...</div>
            <todo-list [todos]="todos" [currentFilter]="currentFilter"></todo-list>
          </mat-card-content>
          <mat-card-footer>
            <div class="subtitle">Made in London by &nbsp;
            <div title="Gerard Sans"><a href="https://twitter.com/gerardsans" target="_blank"><img src="https://pbs.twimg.com/profile_images/796861611030024192/pVl1eq7f_400x400.jpg" alt="" width="24" height="24" class="profile"></a></div>
            </div>
          </mat-card-footer>
        </mat-card>
      </flip-front>
      <flip-back class="back">
        <mat-card class="card">
          <mat-card-header style="flex-direction: column;">
            <div class="box">
              <div class="title" (click)="flipped=!flipped">{{title}} <mat-icon>info</mat-icon></div>
              <mat-chip-list>
                <mat-chip disabled>Angular v5</mat-chip>
                <mat-chip disabled>Apollo Client v2</mat-chip>
                <mat-chip disabled>Queries</mat-chip>
                <mat-chip disabled>Mutations</mat-chip>
                <mat-chip disabled>Subscriptions</mat-chip>
              </mat-chip-list>
              <div class="logos">
                <img matTooltip="Angular v5" style="height:60px;margin: 10px -5px 0px -5px;" src="https://angular.io/assets/images/logos/angular/angular.png" class="image">
                <img matTooltip="Apollo Client v2" style="height:60px;margin: 10px -5px 0px -2px;" src="http://www.discovermeteor.com/images/blog/apollo-logo.png" class="image">
                <img matTooltip="GraphQL"src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/1024px-GraphQL_Logo.svg.png" class="image">
                <img matTooltip="graphcool" src="http://graphcool-random.s3.amazonaws.com/images/logo-green.svg" class="image">
              </div>
            </div>
          </mat-card-header>
          <mat-card-content class="empty">
          </mat-card-content>
          <mat-card-footer>
            <div class="subtitle">Made in London by &nbsp;
            <div title="Gerard Sans"><a href="https://twitter.com/gerardsans" target="_blank"><img src="https://pbs.twimg.com/profile_images/796861611030024192/pVl1eq7f_400x400.jpg" alt="" width="24" height="24" class="profile"></a></div>
            </div>
          </mat-card-footer>
        </mat-card>
      </flip-back>
    </flip>
    `,
  styles: [`
    .title {
      font-size: 2em;
      font-weight: bold;
      margin: 20px 0px 20px 0px;
      cursor: pointer;
    }
    .subtitle {
      margin: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;
    }
    .card {
      padding: 20px;
      margin: 20px auto 20px;
      width: 50%;
      transition: opacity 200ms;
      opacity: 1;
    }
    .card.flipped  {
      opacity: 0;
      transition: opacity 200ms;
    }
    .empty {
      height: 230px;
    }
    .message {
      font-size: 20px;
      margin-left: 10px;
    }
    .image {
      height: 50px;
      margin-top: 10px;
      margin-left: 5px;
    }
    .logos {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .box {
      margin: 0px 20px 0px 20px;
    }
    .content-empty {
      height: 338px;
    }
    .profile {
      border-radius: 6px;
      vertical-align: sub;
    }

    .mat-card-footer {
      display: block;
      margin: 0px;
      padding: 10px;
      border-radius: 4px;
      background-color: #e8eaf6;
    }

    @media (max-width: 768px) {
      .card {
        padding: 0px;
        margin: 0px auto 0px;
        width: 100%;
      }     
      .mat-card {
        padding: 0px;
      }
    }
  `]
})
export class AppComponent implements OnInit { 
  flipped: boolean = false;
  title = 'Todo App powered by GraphQL';
  todos: Array<Todo> = [];
  loading: boolean = true;
  currentFilter = 'SHOW_ALL';

  constructor(private apollo: Apollo) { }

  setFilter(event) {
    this.currentFilter = ["SHOW_ALL", "SHOW_ACTIVE", "SHOW_COMPLETED"][event.index];
  }

  ngOnInit() {
    const query = this.apollo.watchQuery({
      query: gql`
        query todos {
          allTodoes {
            id
            complete
            text
          }
        }`
    });

    query.valueChanges
    .subscribe({
      next: (result) => {
        this.loading = result.loading;
        this.todos = (result.data as Todos).allTodoes;
      },
      error: (error) => {
        console.log(`Error: ${error.message}`);
      }
    });   
    
    query
      .subscribeToMore({
        document: gql`
          subscription {
            Todo(filter: {
              mutation_in: [CREATED, UPDATED, DELETED]
            }) {
              mutation
              node {
                id
                text 
                complete
              }
              previousValues {
                id
                text
                complete
              }
            }
          }
        `,
        updateQuery: (state: Todos, { subscriptionData }) => {
          //Issue: wanted to use new Store but there's no API for subscriptions yet
          let todos, t;
          const {mutation, node: node} = t = (subscriptionData as any).Todo;

          switch(mutation) {
            case "CREATED": 
            case "UPDATED":
              let exists = false;
              // UPDATE
              todos = state.allTodoes.map(todo => {
                // covers updates and new todos
                // created by this client
                if(todo.id === node.id) {
                  exists = true;
                  return {
                    id: node.id,
                    text: node.text,
                    complete: node.complete,
                    __typename: "Todo"
                  }
                }
                return todo;
              })
              // NEWLY CREATED (other clients)
              if (!exists) {
                todos.push({
                  id: node.id,
                  text: node.text,
                  complete: node.complete,
                  __typename: "Todo"
                });                
              }
              break;
            case "DELETED": 
              todos = state.allTodoes
                .filter(todo => todo.id !== t.previousValues.id);
              break;
          }

          return {
            allTodoes: todos
          }
        }
      });   
  }
}
