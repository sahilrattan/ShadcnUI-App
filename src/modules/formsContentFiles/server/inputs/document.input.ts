import { Field, InputType } from 'type-graphql';
import { FileType, IDocumentInput } from '../../interface';

@InputType()
export class DocumentInput implements IDocumentInput {
	@Field()
	formId: number;

	@Field()
	url: string;

	@Field()
	alternateId: string;

	@Field(type => String)
	type: FileType;
}
