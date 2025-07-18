import {
	Arg,
	Args,
	ArgsType,
	Ctx,
	Field,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from 'type-graphql';
import { type Repository } from 'typeorm';
import { IDocument } from '../interface';
import { Document } from './document.entity';
import dbSource from '@web/database/typeorm';
import { verifyReCAPTCHA } from '@web/helpers/verifyRecaptcha';
import { encrypt } from '@web/utils/encryption';
import { DocumentInput } from './inputs/document.input';
import { EdgeType } from '@web/graphql/gql-types/edge';
import {
	ConnectionArgs,
	ConnectionType,
} from '@web/graphql/gql-types/connection';
import { IFormData } from '@web/modules/formData/interface';
import { FormData } from '@web/modules/formData/server/formData.entity';
// import { RelayLimitOffset, RelayedQuery } from "auto-relay";
// import type { RelayLimitOffsetArgs } from "auto-relay";
@ObjectType()
export class DocumentEdge extends EdgeType<Document>('document', Document) {}

@ObjectType()
export class DocumentConnection extends ConnectionType<DocumentEdge>(
	'document',
	DocumentEdge,
) {}

@Resolver(Document)
export class DocumentResolver {
	private readonly documentRepository: Repository<IDocument>;
	private readonly formDataRepository: Repository<IFormData>;
	constructor() {
		this.documentRepository = dbSource.getRepository(Document);
		this.formDataRepository = dbSource.getRepository(FormData);
	}

	// @RelayedQuery(() => User)
	// users(
	//   @Arg("anArg", { nullable: true }) anArg: string,
	//   @RelayLimitOffset() pagination?: RelayLimitOffsetArgs,
	//   @Ctx() context?: any
	// ): Promise<[User[], number]> {
	//   console.log(pagination);
	//   return this.userRepository.findAndCount() as any;
	// }

	@Query(() => DocumentConnection)
	async getFilesByFormId(
		@Arg('formId', _type => String) formId: string,
		@Args() pagination: ConnectionArgs,
	): Promise<any> {
		const { after, before, first, last } = pagination;
		// Convert cursors to IDs or offsets
		const afterId = after ? parseInt(after, 10) : null;
		const beforeId = before ? parseInt(before, 10) : null;

		// Determine find options based on pagination
		let findOptions: any = {};
		if (afterId !== null) {
			findOptions.where = { id: { $gt: afterId } };
		}
		if (beforeId !== null) {
			findOptions.where = { id: { $lt: beforeId } };
		}

		if (first !== undefined) {
			findOptions.take = first;
		} else if (last !== undefined) {
			findOptions.take = last;
			findOptions.order = { id: 'DESC' }; // Reverse order for last
		}

		const [items, count] = await this.documentRepository.findAndCount({
			where: [
				// { formAlternateId: formId, isDeleted: null },
				{ formAlternateId: formId, isDeleted: false },
			],
		});

		// Reverse items back if fetching the last items
		if (last !== undefined) {
			items.reverse();
		}

		// Construct edges and pageInfo
		const edges = items.map(item => ({
			node: item,
			cursor: item.id.toString(), // Assuming id is the cursor, adjust based on your schema
		}));

		return {
			edges,
		};
	}

	@Query(_returns => [Document])
	async getFileByFormId(@Arg('formId', _type => String) formId: string) {
		const [documents] = await this.documentRepository.findAndCount({
			where: [
				// { formAlternateId: formId, isDeleted: null },
				{ formAlternateId: formId, isDeleted: false },
			],
		});
		return documents;
	}

	@Mutation(_returns => [Document])
	async updateFormDocument(
		@Arg('input', _type => [DocumentInput]) input: DocumentInput[],
	) {
		const data = input.map(m => ({
			...m,
			formAlternateId: m.alternateId,
			isPdf: m.url.includes('.pdf'),
		}));

		console.log(data, 'data=========================================');

		await dbSource.transaction(async transactionManager => {
			const deletedoc = await transactionManager.delete(Document, {
				formId: data[0].formId,
			});
			console.log(deletedoc, '==========================================');

			const doc = await transactionManager.save(Document, data);
			console.log(doc, '=================================================');
			return doc;
		});

		const updatedData = this.documentRepository.find({
			where: {
				formId: data[0].formId,
			},
		});
		console.log(
			updatedData,
			'========================================================',
		);
		return updatedData;
	}

	@Mutation(_returns => Document)
	async removeFormDocument(@Arg('documentId') documentId: number) {
		await this.documentRepository.update(
			{
				id: documentId,
			},
			{
				isDeleted: true,
			},
		);
		const updatedData = this.documentRepository.findOneByOrFail({
			id: documentId,
		});
		return updatedData;
	}
}
