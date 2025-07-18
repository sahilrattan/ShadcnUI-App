import { GraphQLFieldResolver, GraphQLSchema } from "graphql/type";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql/execution";

import { Context } from "../types";

const upperCaseDirectiveConfig = {
  upperCase: {
    locations: "FIELD_DEFINITION" as any,
    //  args: { limit: number, duration: number };
  },
};

const upperCaseDirectiveTransformer = (schema: GraphQLSchema) =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName, schema) => {
      const upperDirective = getDirective(
        schema,
        fieldConfig,
        "upperCase"
      )?.[0];
      if (upperDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        const newRsolve: GraphQLFieldResolver<any, Context> = async function (
          source,
          args,
          context,
          info
        ) {
          const result = await resolve(source, args, context, info);
          if (typeof result === "string") {
            return result.toUpperCase();
          }
          return result;
        };

        fieldConfig.resolve = newRsolve as any;
        return fieldConfig;
      }
    },
  });

export { upperCaseDirectiveConfig, upperCaseDirectiveTransformer };
