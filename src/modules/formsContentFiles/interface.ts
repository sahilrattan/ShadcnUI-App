export interface IDocument {
	id: number;
	formAlternateId: string;
	formId: number;
	url: string;
	isPdf: boolean;
	isDeleted: boolean | null;
	type: FileType;
	recordedBy: string;
	lastModifiedBy: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IDocumentInput {
	formId: number;
	alternateId: string;
	url: string;
	type: FileType;
}

export enum FileType {
	POSTER = 'poster',
	SLIDESHOW = 'slideShow',
	PDF = 'pdf',
}
