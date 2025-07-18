'use client';
import React, { useCallback, useState } from 'react';
import {
	GetFileByFormIdDocument,
	Document,
	RemoveFormDocumentDocument,
} from '@web/generated/graphql-operations';
import { useMutation, useQuery } from '@web/graphql/clients/hooks';
import Box from '@mui/material/Box';
import Post from './Post';
import useS3Upload from '@web/hooks/s3Upload';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import ConfirmationModal from '@components/ConfirmationModal';
import useS3ImageUrl from '@web/hooks/uses3ImageUrl';
import { parseNum } from '@web/helpers/parseNumber';

const MyPosts: React.FC<{ formId: string }> = ({ formId }) => {
	const [post, setPost] = useState<Document | null>(null);
	const [postToRemove, setPostToRemove] = useState<Document | null>(null);
	const { getS3Url } = useS3ImageUrl();
	const url = post?.url ? getS3Url(post.url) : '';
	const isPdf = url.endsWith('.pdf');
	const [removeDocument] = useMutation(RemoveFormDocumentDocument);
	const handleClose = useCallback(() => {
		setPost(null);
	}, []);
	const handleClick = useCallback((item: Document) => {
		setPost(item);
	}, []);

	const { data, refetch } = useQuery(GetFileByFormIdDocument, {
		variables: {
			formId: formId,
		},
	});
	const handleConfirm = useCallback(() => {
		removeDocument({
			onCompleted: () => {
				setPostToRemove(null);
				refetch();
			},
			variables: {
				documentId: parseNum(postToRemove?.id || ''),
			},
		});
	}, [refetch, postToRemove?.id]);
	const handleCancel = useCallback(() => {
		setPostToRemove(null);
	}, []);
	const handleDelete = useCallback((item: Document) => {
		setPostToRemove(item);
	}, []);
	const posts = data?.getFileByFormId || [];
	return (
		<Box marginX={3}>
			{/* {post && !isVideo ? (
				<Lightbox onCloseRequest={handleClose} mainSrc={url} />
			) : null} */}
			<ImageList sx={{ height: '100vh' }} cols={3}>
				{posts.map(m =>
					m ? (
						<ImageListItem key={m.id}>
							<Post
								post={m as Document}
								onClick={handleClick}
								onDelete={handleDelete}
							/>
						</ImageListItem>
					) : null,
				)}
			</ImageList>
			<ConfirmationModal
				message="Are you sure, You want to delete this post?"
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				open={Boolean(postToRemove)}
			/>
		</Box>
	);
};

export default MyPosts;
