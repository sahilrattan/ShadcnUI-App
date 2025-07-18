import { relayStylePagination } from '@web/graphql/typePolicies/pagination';

const typePolicy = {
	Query: {
		fields: {
			getFilesByFormId: relayStylePagination,
		},
	},
	Document: {
		keyFields: ['id'],
	},
};

export default typePolicy;
