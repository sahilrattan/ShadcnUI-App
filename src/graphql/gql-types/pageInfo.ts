import * as Relay from "graphql-relay";
import { ObjectType, Field, ArgsType, ClassType, Int } from "type-graphql";

@ObjectType()
class PageInfo implements Relay.PageInfo {
  @Field((type) => Boolean)
  hasNextPage: boolean;

  @Field((type) => Boolean)
  hasPreviousPage: boolean;

  @Field((type) => String, { nullable: true })
  startCursor: Relay.ConnectionCursor;

  @Field((type) => String, { nullable: true })
  endCursor: Relay.ConnectionCursor;

  @Field((type) => Int)
  totalCount: number;
}

export { PageInfo };
