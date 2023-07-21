import graphql, { GraphQLBoolean }  from 'graphql';
import { MemberTypeIdEnum } from './member.js';
import { UUIDType } from './uuid.js';

const createUserInput = new graphql.GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    name: {type: graphql.GraphQLString},
    balance: {type: graphql.GraphQLFloat}
  }
});

const changeUserInput = new graphql.GraphQLInputObjectType({
  name: "ChangeUserInput",
  fields: {
    name: {type: graphql.GraphQLString},
    balance: {type: graphql.GraphQLFloat}
  }
});

const createPostInput = new graphql.GraphQLInputObjectType({
  name: "CreatePostInput",
  fields: {
    title: {type: graphql.GraphQLString},
    content: {type: graphql.GraphQLString},
    authorId: {type: graphql.GraphQLString},
  }
});

const changePostInput = new graphql.GraphQLInputObjectType({
  name: "ChangePostInput",
  fields: {
    title: {type: graphql.GraphQLString},
    content: {type: graphql.GraphQLString},
    authorId: {type: graphql.GraphQLString},
  }
});

const createProfileInput = new graphql.GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: {
    userId: {type: UUIDType},
    memberTypeId: {type: MemberTypeIdEnum},
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: graphql.GraphQLInt},
  }
});

const changeProfileInput = new graphql.GraphQLInputObjectType({
  name: "ChangeProfileInput",
  fields: {
    memberTypeId: {type: MemberTypeIdEnum},
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: graphql.GraphQLInt},
  }
});



export {createUserInput, createPostInput, createProfileInput, changePostInput, changeProfileInput, changeUserInput};
