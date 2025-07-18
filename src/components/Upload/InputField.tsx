import React, { useCallback, useRef } from 'react';
import { useField } from 'react-final-form';
import { DropzoneOptions } from 'react-dropzone';

import { styled } from '@mui/material/styles';

import { convertFileToDocument } from '@helpers/upload';
import useS3ImageUrl from '@web/hooks/uses3ImageUrl';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import PreviewUploadInput, {
	PreviewUploadInputProps,
	UploadRef,
} from '@web/components/PreviewUploadInput';
import { FileType } from '@web/modules/formsContentFiles/interface';
import { UploadData } from '@web/hooks/s3Upload';

export const Wrapper = styled(Box, {
	shouldForwardProp: prop => prop !== 'error',
})<{
	error: boolean;
}>(({ theme, error }) => ({
	paddingBottom: theme.spacing(2),
	'& > div > p': {
		color: error ? theme.palette.error.main : theme.palette.text.secondary,
		paddingBottom: theme.spacing(1),
	},
	'& > div': {
		paddingTop: 0,
	},
	'& > div > div': {
		borderColor: error ? theme.palette.error.main : undefined,
	},
}));

const ErrorWrapper = styled(FormHelperText)(({ theme }) => ({
	paddingTop: theme.spacing(0.5),
}));

export type UploadInputFieldProps<T extends boolean> = Pick<
	PreviewUploadInputProps<T>,
	'onError' | 'mode' | 'showThumbnail'
> & {
	path: string;
	name: string;
	label: string;
	helperText?: string;
	uploadRef: React.RefObject<UploadRef>;
	onFileChange?: () => void;
	onUploadDone?: () => void;
	dropZoneOptions?: DropzoneOptions | undefined;
	objectAsValue?: boolean;
	multiple?: T;
	fileType: FileType;
};
const UploadInputField = <T extends boolean>({
	onError,
	name,
	path,
	label,
	uploadRef,
	multiple,
	onFileChange,
	mode = 'external',
	dropZoneOptions = {
		accept: {
			'image/jpeg': ['.jpeg', '.jpg'],
			'image/png': ['.png'],
			'application/pdf': ['.pdf'],
		},
	},
	objectAsValue,
	onUploadDone,
	showThumbnail,
	helperText,
	fileType,
}: UploadInputFieldProps<T>) => {
	const { getS3Url } = useS3ImageUrl(' ');
	// keep it like this as we dont want s3Proxy to be stored to db
	const {
		input: { onChange, value, onBlur },
		meta,
	} = useField(name);

	const error = Boolean(
		(meta.touched && meta.error && !meta.active) || meta.submitError,
	);

	const handleFinishUpload = React.useCallback(
		(file: File, name: string, label?: string) => {
			const data = convertFileToDocument({ file, name, label }, path);
			if (objectAsValue) {
				onChange(data);
			} else {
				onChange(getS3Url(data.name, data.folder).trim());
			}
			onBlur();
			if (onUploadDone) {
				setTimeout(() => onUploadDone(), 100);
			}
		},
		[path, objectAsValue, onBlur, onUploadDone, onChange, value, getS3Url],
	);

	const handleFinishUploadMultiple = React.useCallback(
		(data: UploadData[]) => {
			const items = data.map(m =>
				convertFileToDocument({ ...m, name: m.fileName }, path),
			);
			if (objectAsValue) {
				onChange(items);
			} else {
				onChange(items.map(m => getS3Url(m.name, m.folder).trim()));
			}
			onBlur();
			if (onUploadDone) {
				setTimeout(() => onUploadDone(), 100);
			}
		},
		[path, objectAsValue, onBlur, onUploadDone, onChange, value, getS3Url],
	);
	const handleClear = React.useCallback(() => {
		onChange(multiple ? [] : null);
		onBlur();
	}, [onChange, onBlur]);
	const handleAccept = React.useCallback(() => {
		if (onFileChange) {
			onFileChange();
		}
	}, [onFileChange]);

	return (
		<Wrapper error={error}>
			<PreviewUploadInput
				multiple={Boolean(multiple)}
				showThumbnail={showThumbnail}
				mode={mode}
				label={label}
				path={path}
				fileName={value.label || value.name}
				value={
					objectAsValue ? getS3Url(value.name, value.folder)?.trim() : value
				}
				uploadRef={uploadRef}
				onError={onError}
				onAccept={handleAccept}
				onFinishUpload={
					(multiple ? handleFinishUploadMultiple : handleFinishUpload) as any
				}
				onClear={handleClear}
				dropZoneOptions={dropZoneOptions}
				fileType={fileType}
			/>
			{error || helperText ? (
				<ErrorWrapper error={error}>
					{error
						? meta.error?.name ||
						  meta.error ||
						  meta.submitError ||
						  meta.submitError?.name
						: helperText}
				</ErrorWrapper>
			) : null}
		</Wrapper>
	);
};

export default UploadInputField;
