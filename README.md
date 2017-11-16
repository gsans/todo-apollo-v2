# TodoApolloV2

<img src="https://image.ibb.co/dsnDsb/ezgif_com_video_to_gif_40.gif"/>

<img src="https://image.ibb.co/gb6dQw/ezgif_com_video_to_gif_42.gif">

## Technology stack

This application integrates the following technologies:
- [Apollo Client 2.0](http://dev.apollodata.com) to communicate with GraphQL Server
- [graphcool](http://graph.cool) providing the GraphQL Server
- [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0

## Usage

You can add todos and toggle their status. If you open different windows each will be updated accordingly.

## Development

If you have any questions feel free to ping me on [@gerardsans](http://twitter.com/gerardsans).

### Install

First, clone the repo via git:

```bash
$ git clone https://github.com/gsans/todo-apollo-v2.git
```

And then install dependencies:

```bash
$ cd todo-apollo-v2 && npm i
```

### graphcool GraphQL Server Setup

In order to run this project you need to create the data model (schema) below using [graphcool](http://graph.cool) console online or graphcool CLI. 

## Todo App Schema

This is the schema used

```graphql
type Todo @model {
  id: ID! @isUnique
  text: String!
  complete: Boolean!
}
```

Create a GraphQL Server using this schema and graphcool CLI. On the `todo-apollo-v2` folder run the following commands:

```bash
$ npm install -g graphcool
$ graphcool push
$ graphcool endpoints
```

### Replace client URIs 

Edit `/src/app/graphql.module.ts` and replace `ADD_YOUR_API_KEY_HERE` with the endpoints from the previous step.

```javascript
  private setupLink() {
    // queries and mutations link (http)
    const http = this.httpLink.create({ 
      uri: 'https://api.graph.cool/simple/v1/ADD_YOUR_API_KEY_HERE'
    });

    // subscriptions link (websockets)
    const websocket = new WebSocketLink(
      new SubscriptionClient('wss://subscriptions.graph.cool/v1/ADD_YOUR_API_KEY_HERE', {
        reconnect: true
      })
    );
```

### Run
```bash
$ ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

> Note: requires a node version >=6.x

<img src="./src/images/partyparrot.png" />

## License
MIT © [Gerard Sans](https://github.com/gsans)