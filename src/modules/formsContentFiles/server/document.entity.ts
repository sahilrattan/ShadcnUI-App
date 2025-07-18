import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	OneToOne,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { Field, ID, ObjectType } from 'type-graphql';
import { FormData } from '@web/modules/formData/server/formData.entity';
import { FileType, IDocument } from '../interface';

@ObjectType('Document')
@Entity({ name: 'documents' })
export class Document implements IDocument {
	@Field(_type => ID)
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Field(() => Number)
	@Column({ type: 'int', unique: false })
	formId: number;

	@Field(() => String)
	@Column({ type: 'varchar' })
	formAlternateId: string;

	@Field(() => String)
	@Column({ type: 'varchar' })
	url: string;

	@Field(() => Boolean)
	@Column({ type: 'boolean', nullable: true, default: null })
	isPdf: boolean;

	@Field(type => String)
	@Column({ type: 'varchar', nullable: true, default: null })
	type: FileType;

	@Field(type => Boolean)
	@Column({ type: 'boolean', nullable: true, default: false })
	isDeleted: boolean | null;

	@ManyToOne(type => FormData, formdata => formdata)
	@JoinColumn({ name: 'formId' })
	formData: Relation<FormData>;

	@Field(type => String)
	@Column({ type: 'varchar', nullable: true })
	recordedBy: string;

	@Field(type => String)
	@Column({ type: 'varchar', nullable: true })
	lastModifiedBy: string;

	@CreateDateColumn()
	createdAt: Date;

	@CreateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;
}
