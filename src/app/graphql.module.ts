import {NgModule} from '@angular/core';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpClientModule, HttpHeaders} from '@angular/common/http';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {ApolloLink, concat} from 'apollo-link';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import {WebSocketLink} from 'apollo-link-ws';
import {getOperationAST} from 'graphql';

@NgModule({
  imports: [
    HttpClientModule,
    HttpLinkModule
  ],
  exports: [
    ApolloModule
  ]
})
export class GraphQLModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink
  ) {
    const link = this.setupLink();
    const cache = new InMemoryCache();

    apollo.create({ link, cache });
  }

  private setupLink() {
    // queries and mutations link (http)
    const http = this.httpLink.create({ 
      uri: 'https://api.graph.cool/simple/v1/cj9kbs62107rc0168xb5s9ghu'
    });

    // subscriptions link (websockets)
    const websocket = new WebSocketLink(
      new SubscriptionClient('wss://subscriptions.graph.cool/v1/cj9kbs62107rc0168xb5s9ghu', {
        reconnect: true
      })
    );

    const authMiddleware = new ApolloLink((operation, forward) => {
      operation.setContext({
        headers: { 'Authorization': localStorage.getItem('Auth0IdToken') || '' }
      });
      return forward(operation);
    });
    
    const link = ApolloLink.split(
      this.isSubscription,
      /* if true use  */ websocket,
      /* if false use */ http,
    );
    return concat(authMiddleware, link);
  }

  // Find out if current query (operation) is a subscription
  private isSubscription(op): boolean {
    const ast = getOperationAST(op.query, op.operationName);
    return ast && ast.operation === 'subscription';
  }
}

