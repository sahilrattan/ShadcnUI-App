import * as Relay from 'graphql-relay';
import { ObjectType, Field, ArgsType, ClassType } from 'type-graphql';
import { PageInfo } from './pageInfo';

type ExtractNodeType<EdgeType> = EdgeType extends Relay.Edge<infer NodeType>
	? NodeType
	: never;

export function ConnectionType<
	EdgeType extends Relay.Edge<NodeType>,
	NodeType = ExtractNodeType<EdgeType>,
>(nodeName: string, edgeClass: ClassType<EdgeType>) {
	@ObjectType(`${nodeName}Connection`, {})
	abstract class Connection implements Relay.Connection<NodeType> {
		@Field(type => PageInfo)
		pageInfo: PageInfo;

		@Field(type => [edgeClass])
		edges: EdgeType[];
	}

	return Connection;
}

@ArgsType()
export class ConnectionArgs {
	@Field(type => String, {
		nullable: true,
		description: 'Paginate before opaque cursor',
	})
	before?: Relay.ConnectionCursor;

	@Field(type => String, {
		nullable: true,
		description: 'Paginate after opaque cursor',
	})
	after?: Relay.ConnectionCursor;

	@Field(type => Number, { nullable: true, description: 'Paginate first' })
	first?: number;

	@Field(type => Number, { nullable: true, description: 'Paginate last' })
	last?: number;
}
