import {
  Maybe,
  IUnionTypeResolver,
  IEnumTypeResolver,
  IInputObjectTypeResolver,
  ISchemaLevelResolver,
  IObjectTypeResolver,
  IInterfaceTypeResolver,
} from "@graphql-tools/utils";
import { GraphQLFieldResolver } from "graphql/type";
import { GraphQLError as GQLError } from "graphql/error";
import { ASTNode, Source } from "graphql/language";
import { Context } from "@web/graphql/types";
import { IUser } from "@web/modules/user/interface";

export type ValueOrPromise<T = any> = T | Promise<T>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Pick and make properties in T required
 */
export type PickRequired<T, K extends keyof T> = {
  [P in K]-?: NonNullable<T[P]>;
};

/**
 * Make properties in T required
 */
export type MakeRequired<T, K extends keyof T> = {
  [P in K]-?: NonNullable<T[P]>;
} & Omit<T, K>;

export type ResultNode<T = any> = {
  __typename?: string;
} & T;

export interface ResultEdge<T = any> {
  __typename?: string;
  node: ResultNode<T>;
  cursor: string;
}
export interface ListQueryResult<T = any> {
  __typename?: string;
  edges: ResultEdge<T>[];
  pageInfo: any;
  totalCount: number;
}

export interface Filter {
  [k: string]: any; // todo make it type safe
}

export type Root<T = any> = { [k: string]: ListQueryResult<T> | unknown };

export type ListQuery<T = any> = {
  __typename?: string;
} & Root<T>;

export type DropDownOption = {
  value: string | number;
  label: string;
};

export type IResolver<TSource = any, TArgs = any, TReturn = any> =
  | ISchemaLevelResolver<TSource, Context, TArgs, TReturn>
  | IObjectTypeResolver<TSource, Context>
  | IInterfaceTypeResolver<TSource, Context>
  | IUnionTypeResolver
  // | IScalarTypeResolver // removing this from type defination coz this one is class and results to explicit type on resolver
  | IEnumTypeResolver
  | IInputObjectTypeResolver;

export type IResolvers = Record<string, IResolver>;
export interface IResolverModule {
  types: IResolvers;
  inputs: IResolvers;
  queries: IResolvers;
  mutations: IResolvers;
  subscriptions: IResolvers;
}

export type IGraphQLFieldResolver = GraphQLFieldResolver<any, Context>;
export interface IMock {
  [key: string]: IGraphQLFieldResolver;
}
export interface IMockModule {
  types: IMock;
  queries: IMock;
  mutations: IMock;
}

export interface GQLFieldValidationError {
  key: string;
  message: string;
}

export type GqlArrayError = { [key: string]: string[] };
export interface IValidationError {
  key: string;
  message?: string;
}
export const processErrors = (
  errors: GQLFieldValidationError[]
): GqlArrayError =>
  errors.reduce<any>((result, error) => {
    if (Object.prototype.hasOwnProperty.call(result, error.key)) {
      result[error.key].push(error.message);
    } else {
      result[error.key] = [error.message];
    }
    return result;
  }, {});
export class GraphQLValidationError extends GQLError {
  constructor(errors: GQLFieldValidationError | GQLFieldValidationError[]) {
    super(
      "VALIDATIONERROR",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        validationErrors: processErrors(
          Array.isArray(errors) ? errors : [errors]
        ),
      }
    );
  }
}
export class GraphQLError extends GQLError {
  constructor(
    message: string,
    statusCode?: string | number,
    nodes?: Maybe<ReadonlyArray<ASTNode> | ASTNode>,
    source?: Maybe<Source>,
    positions?: Maybe<ReadonlyArray<number>>,
    path?: Maybe<ReadonlyArray<string | number>>,
    originalError?: Maybe<Error>,
    extensions?: Maybe<{ [key: string]: any }>
  ) {
    super(message, nodes, source, positions, path, originalError, extensions);
    this.statusCode = statusCode || 500;
  }

  statusCode: string | number;
}

export interface IViewer {
  expiry?: Date | null;
  // TODO should this be IUserPublic?
  user?: IUser;
}
