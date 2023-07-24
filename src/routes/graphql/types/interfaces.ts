import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";
import { MemberTypeId } from "../../member-types/schemas.js";

type Idb = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export {
  Idb
}

type InputArgs<T, M> = {
  dto: T
  id: M
}

interface IUserInput {
  name: string, 
  balance: number
};

interface IPostInput {
  title: string,
  content: string,
  authorId: string
}

interface IProfileInput {
  userId: string,
  memberTypeId: MemberTypeId,
  isMale: boolean,
  yearOfBirth: number
}

export {InputArgs, IPostInput, IUserInput, IProfileInput}
