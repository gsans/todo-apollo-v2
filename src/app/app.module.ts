import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material.module';

import { AppComponent } from './app.component';
import { AddTodoComponent } from './add-todo.component';
import { TodoListComponent } from './todo-list.component';
import { Todo } from './todo.component';
import { VisibleTodosPipe } from './VisibleTodosPipe';
import { FlipComponent, FlipSection } from './flip.component';
import { Loader } from './loader.component'; 

import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    AddTodoComponent,
    TodoListComponent,
    VisibleTodosPipe,
    Todo,
    FlipComponent, FlipSection,
    Loader
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    BrowserAnimationsModule,
    AppMaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
