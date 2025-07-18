import { array, number, object, string } from 'yup';

const validationSchema = object().shape({
	images: array()
		.of(
			object()
				.shape({
					name: string().required('required'),
					label: string().required('required'),
					folder: string(),
				})
				.required()
				.nullable('required'),
		)
		.nullable(),
	type: string(),
});
export default validationSchema;
