import userTypePolicy from '@web/modules/user/server/typePolicy';
import profileTypePolicy from '@web/modules/profile/server/typePolicy';
import formDataTypePolicy from '@web/modules/formData/server/typePolicy';
import uploadTypePolicy from '@web/modules/upload/server/typePolicy';
import documentTypePolicy from '@web/modules/formsContentFiles/server/typePolicy';
import countryTypePolicy from '@web/modules/country/server/typePolicy';
import stateTypePolicy from '@web/modules/state/server/typePolicy';
import cityTypePolicy from '@web/modules/city/server/typePolicy';

const typePolicies = {
	...userTypePolicy,
	...profileTypePolicy,
	...formDataTypePolicy,
	...uploadTypePolicy,
	...documentTypePolicy,
	...countryTypePolicy,
	...stateTypePolicy,
	...cityTypePolicy,

	Query: {
		...userTypePolicy.Query,
		...profileTypePolicy.Query,
		...formDataTypePolicy.Query,
		...uploadTypePolicy.Query,
		...documentTypePolicy.Query,
		...countryTypePolicy.Query,
		...stateTypePolicy.Query,
		...cityTypePolicy.Query,

		fields: {
			...userTypePolicy.Query.fields,
			...profileTypePolicy.Query.fields,
			...formDataTypePolicy.Query.fields,
			...uploadTypePolicy.Query.fields,
			...documentTypePolicy.Query.fields,
			...countryTypePolicy.Query.fields,
			...stateTypePolicy.Query.fields,
			...cityTypePolicy.Query.fields,
		},
	},
};

export default typePolicies;
