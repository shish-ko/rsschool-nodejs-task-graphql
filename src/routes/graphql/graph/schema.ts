/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";
import graphql from "graphql";

const userSchema= new graphql.GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: graphql.GraphQLID},
    name: {type: graphql.GraphQLString},
    balance: {type: graphql.GraphQLFloat},
    profile: {type: profileSchema},
    posts: {type: postSchema},
    userSubscribedTo: {type: new graphql.GraphQLList(subscribersSchema)},
    subscribedToUser: {type: new graphql.GraphQLList(subscribersSchema)},
  })
})

const subscribersSchema = new graphql.GraphQLObjectType({
  name: "Subscribers",
  fields: ()=>({
    subscriber: {type: userSchema},
    subscriberId: {type: graphql.GraphQLString},
    author: {type: userSchema},
    authorId: {type: graphql.GraphQLString},
  })
});

const postSchema = new graphql.GraphQLObjectType({
  name: "Post",
  fields: ()=>({
    id: {type: graphql.GraphQLID},
    title: {type: graphql.GraphQLString},
    content: {type: graphql.GraphQLString},
    author: {type: userSchema},
    authorId: {type: graphql.GraphQLID}
  })
});


const profileSchema = new graphql.GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: {type: graphql.GraphQLID},
    isMale: {type: graphql.GraphQLBoolean},
    yearOfBirth: {type: graphql.GraphQLInt},
    user: {type: userSchema},
    userId: {type:  graphql.GraphQLID},
    memberType: {type: memberSchema},
    memberTypeId: {type: graphql.GraphQLID}
  })
});

const memberSchema = new graphql.GraphQLObjectType({
  name: "Member",
  fields: {
    id: {type: graphql.GraphQLID},
    discount: {type: graphql.GraphQLFloat},
    postsLimitPerMonth: {type: graphql.GraphQLInt},
    profiles: {type: new graphql.GraphQLList(profileSchema)}
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: userSchema,
      resolve: async (source, args, context: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>)=> {
        const res = await context.user.findFirst();
        console.log(res);
        return new User(res!)
       }, 

    },
    memberTypes: {type: memberSchema}
  }
})

class User {
  id: string;
  name: string;
  balance: number;

  constructor({id, name, balance}:{id: string, name: string, balance: number} ) {
    this.id=id,
    this.name= name,
    this.balance=balance
  }
}
export const schema = new graphql.GraphQLSchema({query: queryType})