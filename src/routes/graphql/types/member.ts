import { GraphQLEnumType } from "graphql";

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    business: {
      value: 'business'
    },
    basic: {
      value: 'basic'
    }
  }
})