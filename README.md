# gqlast
Javascript to GarphQL Abstract Syntax Tree(AST) parser

# Motivation
Mutations in graphql are awesome but the issue I faced was [uploading an array of objects in the mutation payload](https://www.prisma.io/forum/t/how-do-i-add-an-array-of-objects-to-a-mutation-in-apollo-react/365).

## example
### Mutation defined in the graphql server
    mutation {
        createUser(user:{
            name: String!
            age: Int!
            marks: [Float!]!
            subjects: [Subject]!
        }):User!
    }
    
    type Subject {
        name: String!
        ...
    }

### JS tagged template to create a mutation

```javascript
const user = {
    name:"Rohit", 
    age:27, 
    marks: [10,15], 
    subjects:[
        {name:"maths"},
        {name:"science"}
    ]
};
const query = `mutation {
        createUser(user:${user}) {
            name
        }
}`
```

The problem here is that the value of query is 
```
mutation {
        createUser(user:[object Object]) {
            name
        }
}
```

**createUser(user:[object Object])** is the issue.
I tried using [graphql-tag](https://github.com/apollographql/graphql-tag) aswell but the same issue exists there aswell.

The intended outcome was 
```
mutation {
        createUser(user:{
            name: "Rohit" ,
            age: 27 ,
            marks: [10 ,15 ] ,
            subjects: [
                {name: "maths" } ,
                {name: "science" } 
                ] 
            }) {
            name
        }
}
```

## gqlast is a tag which can be used with template strings to do the intended

```
const query = gqlast`mutation {
        createUser(user:${user}) {
            name
        }
}`
```
Try the code and have fun