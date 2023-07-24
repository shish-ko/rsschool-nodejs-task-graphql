/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";
import graphql from "graphql";
import { Idb, InputArgs, IPostInput, IProfileInput, IUserInput } from "../types/interfaces.js";
import { MemberTypeIdEnum } from "../types/member.js";
import { MemberTypeId } from "../../member-types/schemas.js";
import { UUIDType } from '../types/uuid.js'
import { changePostInput, changeProfileInput, changeUserInput, createPostInput, createProfileInput, createUserInput } from "../types/mutationInputs.js";

const userSchema = new graphql.GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: UUIDType },
    name: { type: graphql.GraphQLString },
    balance: { type: graphql.GraphQLFloat },
    profile: {
      type: profileSchema,
      resolve: (obj: { id: string }, args, db: Idb) => db.profile.findUnique({ where: { userId: obj.id } })
    },
    posts: {
      type: new graphql.GraphQLList(postSchema),
      resolve: (obj, args, db) => {
        return db.post.findMany({ where: { authorId: obj.id } })
      }
    },
    userSubscribedTo: {
      type: new graphql.GraphQLList(userSchema),
      resolve: (obj, args, db) => {
        return db.subscribersOnAuthors.findMany({ where: { subscriberId: obj.id } })
          .then((res) => res.map((model) => db.user.findUnique({ where: { id: model.authorId } })))
      }
    },
    subscribedToUser: {
      type: new graphql.GraphQLList(userSchema),
      resolve: (obj, args, db) => {
        return db.subscribersOnAuthors.findMany({ where: { authorId: obj.id } })
          .then((res) => res.map((model) => db.user.findUnique({ where: { id: model.subscriberId } })))
      }
    },
  })
})

const subscribersSchema = new graphql.GraphQLObjectType({
  name: "Subscribers",
  fields: () => ({
    subscriber: {
      type: new graphql.GraphQLNonNull(userSchema),
      resolve: (obj: { subscriberId: string, authorId: string }, _, db: Idb) => db.user.findUnique({ where: { id: obj.subscriberId } }),
    },
    subscriberId: { type: graphql.GraphQLString },
    author: {
      type: new graphql.GraphQLNonNull(userSchema),
      resolve: (obj, _, db) => db.user.findUnique({ where: { id: obj.authorId } })
    },
    authorId: { type: graphql.GraphQLString },
  })
});

const postSchema = new graphql.GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    title: { type: graphql.GraphQLString },
    content: { type: graphql.GraphQLString },
    author: {
      type: userSchema,
      resolve: (obj: { authorId: string }, arg, db: Idb) => {
        return db.user.findUnique({ where: { id: obj.authorId } })
      }
    },
    authorId: { type: graphql.GraphQLID },
  }),

});


const profileSchema = new graphql.GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    isMale: { type: graphql.GraphQLBoolean },
    yearOfBirth: { type: graphql.GraphQLInt },
    user: {
      type: userSchema,
      resolve: (obj: { userId: string, memberTypeId: MemberTypeId }, _, db: Idb) => db.user.findUnique({ where: { id: obj.userId } })
    },
    userId: { type: graphql.GraphQLID },
    memberType: {
      type: memberSchema,
      resolve: (obj, _, db) => db.memberType.findUnique({ where: { id: obj.memberTypeId } })
    },
    memberTypeId: { type: MemberTypeIdEnum }
  })
});

const memberSchema = new graphql.GraphQLObjectType({
  name: "Member",
  fields: {
    id: { type: MemberTypeIdEnum },
    discount: { type: graphql.GraphQLFloat },
    postsLimitPerMonth: { type: graphql.GraphQLInt },
    profiles: {
      type: new graphql.GraphQLList(profileSchema),
      resolve: (obj: { id: MemberTypeId }, _, db: Idb) => db.profile.findMany({ where: { memberTypeId: obj.id } })
    }
  }
});

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: new graphql.GraphQLList(userSchema),
      resolve: (obj, args, context: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
        return context.user.findMany()
      },
    },
    user: {
      type: userSchema,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType)
        }
      },
      resolve: (_, arg: { id: string }, db: Idb) => {
        return db.user.findUnique({ where: { id: arg.id } })
      }
    },
    posts: {
      type: new graphql.GraphQLList(postSchema),
      resolve: (obj, args, db: Idb) => {
        return db.post.findMany();
      }
    },
    post: {
      type: postSchema,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType)
        }
      },
      resolve: (_, arg: { id: string }, db: Idb) => {
        return db.post.findUnique({ where: { id: arg.id } })
      }
    },
    profiles: {
      type: new graphql.GraphQLList(profileSchema),
      resolve: (obj, args, db: Idb) => {
        return db.profile.findMany();
      }
    },
    profile: {
      type: profileSchema,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType)
        }
      },
      resolve: (_, arg: { id: string }, db: Idb) => {
        return db.profile.findUnique({ where: { id: arg.id } })
      }
    },
    memberTypes: {
      type: new graphql.GraphQLList(memberSchema),
      resolve: (obj, args, db) => db.memberType.findMany()
    },
    memberType: {
      type: memberSchema,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(MemberTypeIdEnum)
        }
      },
      resolve: (_, arg: { id: MemberTypeId }, db: Idb) => {
        return db.memberType.findUnique({ where: { id: arg.id } })
      }
    },
  }
})

const mutationType = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: userSchema,
      args: {
        dto: {
          type: new graphql.GraphQLNonNull(createUserInput)
        }
      },
      resolve: (_, arg: InputArgs<IUserInput, null>, db: Idb) => {
        return db.user.create({ data: arg.dto })
      }
    },
    createPost: {
      type: postSchema,
      args: {
        dto: {
          type: new graphql.GraphQLNonNull(createPostInput)
        }
      },
      resolve: (_, arg: InputArgs<IPostInput, null>, db: Idb) => {
        return db.post.create({ data: arg.dto })
      }
    },
    createProfile: {
      type: profileSchema,
      args: {
        dto: {
          type: new graphql.GraphQLNonNull(createProfileInput)
        }
      },
      resolve: (_, arg: InputArgs<IProfileInput, null>, db: Idb) => {
        return db.profile.create({ data: arg.dto })
      }
    },
    deletePost: {
      type: graphql.GraphQLBoolean,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType)
        }
      },
      resolve: async (_, arg: InputArgs<null, string>, db: Idb) => {
        await db.post.delete({ where: { id: arg.id } });
        return true;
      }
    },
    deleteProfile: {
      type: graphql.GraphQLBoolean,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType)
        }
      },
      resolve: async (_, arg: InputArgs<null, string>, db: Idb) => {
        await db.profile.delete({ where: { id: arg.id } })
        return true
      }
    },
    deleteUser: {
      type: graphql.GraphQLBoolean,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(UUIDType)
        }
      },
      resolve: async (_, arg: InputArgs<null, string>, db: Idb) => {
        await db.user.delete({ where: { id: arg.id } });
        return true
      }
    },
    changeUser: {
      type: userSchema,
      args: {
        id: { type: new graphql.GraphQLNonNull(UUIDType) },
        dto: { type: changeUserInput }
      },
      resolve: (_, arg: InputArgs<Partial<IUserInput>, string>, db: Idb) => {
        return db.user.update({ where: { id: arg.id }, data: arg.dto })
      }
    },
    changePost: {
      type: postSchema,
      args: {
        id: { type: new graphql.GraphQLNonNull(UUIDType) },
        dto: { type: changePostInput }
      },
      resolve: (_, arg: InputArgs<Partial<IPostInput>, string>, db: Idb) => {
        return db.post.update({ where: { id: arg.id }, data: arg.dto })
      }
    },
    changeProfile: {
      type: profileSchema,
      args: {
        id: { type: new graphql.GraphQLNonNull(UUIDType) },
        dto: { type: changeProfileInput }
      },
      resolve: (_, arg: InputArgs<Partial<IProfileInput>, string>, db: Idb) => {
        return db.profile.update({ where: { id: arg.id }, data: arg.dto })
      }
    },
    subscribeTo: {
      type: userSchema,
      args: {
        userId: { type: new graphql.GraphQLNonNull(UUIDType) },
        authorId: { type: new graphql.GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, arg: { userId: string, authorId: string }, db: Idb) => {
        const res = await db.user.update({ where: { id: arg.userId }, data: { userSubscribedTo: { create: {authorId: arg.authorId} } } })
        console.log(res)
        return res
      }
    },
    unsubscribeFrom: {
      type: graphql.GraphQLBoolean,
      args: {
        userId: { type: new graphql.GraphQLNonNull(UUIDType) },
        authorId: { type: new graphql.GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, arg: { userId: string, authorId: string }, db: Idb) => {
        await db.subscribersOnAuthors.delete({ where: { subscriberId_authorId: {subscriberId: arg.userId, authorId: arg.authorId} } })
        return true;
      },

    }
  }
})
export const schema = new graphql.GraphQLSchema({ query: queryType, mutation: mutationType })