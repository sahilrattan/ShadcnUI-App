import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import DataLoader from "dataloader";

export type Context = {
  user?: Session["user"] | JWT;
  // getLoader: <K, V>(ref: LoadableRef<K, V, Context>) => DataLoader<K, V>; // helper to get a loader from a ref
  // load: <K, V>(ref: LoadableRef<K, V, Context>, id: K) => Promise<V>; // helper for loading a single resource
  // loadMany: <K, V>(
  // 	ref: LoadableRef<K, V, Context>,
  // 	ids: K[],
  // ) => Promise<(Error | V)[]>; // helper for loading many
  // other context fields
};

export type DirectiveConfig = Record<
  string,
  { locations: any; args?: Record<string, unknown> | undefined }
>;
