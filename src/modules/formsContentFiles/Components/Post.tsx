'use client';
import Image from 'next/image';
import { Document } from '@web/generated/graphql-operations';
import Box from '@mui/material/Box';
import useS3ImageUrl from '@web/hooks/uses3ImageUrl';
import { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import MuiIconButton from '@mui/material/IconButton';
import TrashIcon from '@mui/icons-material/Delete';

const TheImage = styled(Image)(({ theme }) => ({
	cursor: 'pointer',
}));
const IconButton = styled(MuiIconButton)(({ theme }) => ({
	position: 'absolute',
	right: 15,
	top: 0,
}));
const Post: React.FC<{
	post: Document;
	onClick?: (item: Document) => void;
	onDelete?: (item: Document) => void;
}> = ({ post, onClick, onDelete }) => {
	const { getS3Url } = useS3ImageUrl();
	const url = getS3Url(post.url) || '';
	const ispdf = url.endsWith('.pdf');
	const handleClick = useCallback(() => {
		if (onClick) {
			onClick(post);
		}
	}, [post, onClick]);
	const handleDelete = useCallback(() => {
		if (onDelete) {
			onDelete(post);
		}
	}, [post, onDelete]);
	return (
		<Box position="relative">
			{!ispdf ? (
				<TheImage
					height={300}
					width={300}
					src={url}
					alt={post.id}
					onClick={handleClick}
				/>
			) : (
				<embed src={url} height={300} width={400} />
			)}
			{onDelete ? (
				<IconButton onClick={handleDelete}>
					<TrashIcon />
				</IconButton>
			) : null}
		</Box>
	);
};

export default Post;
