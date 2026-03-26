import { useLayoutEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Icon, Input } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import { savePostAsync } from '../../../../actions';
import { sanizeContent } from './utils';
import styled from 'styled-components';
import { PROP_TYPE } from '../../../../constants';

const PostFormContainer = ({
	className,
	post: { id, title, imageUrl, content, publishedAt },
}) => {
	const [imageUrlValue, setImageUrlValue] = useState(imageUrl);
	const [titleValue, setTitleValue] = useState(title);
	const [saveError, setSaveError] = useState('');
	const contentRef = useRef(null);

	useLayoutEffect(() => {
		setImageUrlValue(imageUrl);
		setTitleValue(title);
	}, [imageUrl, title]);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSave = () => {
		const newContent = sanizeContent(contentRef.current.innerHTML);

		dispatch(
			savePostAsync(id, {
				imageUrl: imageUrlValue,
				title: titleValue,
				content: newContent,
			}),
		).then(({ error, data }) => {
			if (error) {
				setSaveError(error);
				return;
			}

			setSaveError('');
			navigate(`/post/${data.id}`);
		});
	};

	const onImageChange = ({ target }) => {
		setImageUrlValue(target.value);
		setSaveError('');
	};

	const onTitleChange = ({ target }) => {
		setTitleValue(target.value);
		setSaveError('');
	};

	return (
		<div className={className}>
			<Input
				value={imageUrlValue}
				placeholder="Изображение..."
				onChange={onImageChange}
			/>
			<Input
				value={titleValue}
				placeholder="Заголовок..."
				onChange={onTitleChange}
			/>
			<SpecialPanel
				id={id}
				publishedAt={publishedAt}
				margin="20px 0"
				editButton={
					<Icon
						id="fa-floppy-o"
						size="21px"
						margin="0 10px 0 0"
						onClick={onSave}
					/>
				}
			/>
			<div
				ref={contentRef}
				contentEditable={true}
				suppressContentEditableWarning={true}
				className="post-text"
				onInput={() => setSaveError('')}
			>
				{content}
			</div>
			{saveError && <div className="save-error">{saveError}</div>}
		</div>
	);
};

export const PostForm = styled(PostFormContainer)`
	& img {
		float: left;
		margin: 0 20px 10px 0;
	}

	& .post-text {
		min-height: 80px;
		border: 1px solid #000;
		font-size: 18px;
		white-space: pre-line;
	}

	& .save-error {
		margin-top: 12px;
		color: #c00;
	}
`;

PostForm.propTypes = {
	post: PROP_TYPE.POST.isRequired,
};
