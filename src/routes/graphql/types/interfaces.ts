import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library.js";

type Idb = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export {
  Idb
}

type InputArgs<T> = {
  dto: T
}

interface IPostInput {
  title: string,
  content: string,
  authorId: string
}

export {InputArgs, IPostInput}
