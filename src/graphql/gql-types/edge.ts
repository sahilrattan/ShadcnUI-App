import * as Relay from 'graphql-relay';
import { ObjectType, Field, ClassType } from 'type-graphql';

export function EdgeType<T>(nodeName: string, nodeType: ClassType) {
	@ObjectType(`${nodeName}Edge`, {})
	abstract class Edge implements Relay.Edge<T> {
		@Field(type => nodeType)
		node: T;

		@Field(type => String, {
			description: 'Used in `before` and `after` args',
		})
		cursor: Relay.ConnectionCursor;
	}

	return Edge;
}
