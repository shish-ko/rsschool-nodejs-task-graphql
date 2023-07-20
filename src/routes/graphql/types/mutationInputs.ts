import graphql  from 'graphql';

const createUserInput = new graphql.GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    name: {type: graphql.GraphQLString},
    balance: {type: graphql.GraphQLFloat}
  }
});

const createPostInput = new graphql.GraphQLInputObjectType({
  name: "CreatePostInput",
  fields: {
    title: {type: graphql.GraphQLString},
    content: {type: graphql.GraphQLFloat},
    authorId: {type: graphql.GraphQLFloat},
  }
});



export {createUserInput, createPostInput};
