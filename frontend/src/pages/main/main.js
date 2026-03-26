import { useEffect, useState } from 'react';
import { getPosts } from '../../api';
import { Pagination, PostCard, Search } from './components';
import { PAGINATION_LIMIT } from '../../constants';
import styled from 'styled-components';

const MainContainer = ({ className }) => {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		let isCancelled = false;
		const searchTimeoutId = setTimeout(() => {
			getPosts(searchPhrase, page, PAGINATION_LIMIT).then(({ error, data }) => {
				if (isCancelled) {
					return;
				}

				if (error) {
					setErrorMessage(error);
					setPosts([]);
					setLastPage(1);
					return;
				}

				setErrorMessage('');
				setPosts(data.posts);
				setLastPage(data.lastPage);
			});
		}, 300);

		return () => {
			isCancelled = true;
			clearTimeout(searchTimeoutId);
		};
	}, [page, searchPhrase]);

	const onSearch = ({ target }) => {
		setSearchPhrase(target.value);
		setPage(1);
	};

	return (
		<div className={className}>
			<div className="posts-and-search">
				<Search searchPhrase={searchPhrase} onChange={onSearch} />
				{errorMessage && <div className="request-error">{errorMessage}</div>}
				{posts.length > 0 ? (
					<div className="post-list">
						{posts.map(({ id, title, imageUrl, publishedAt, comments }) => (
							<PostCard
								key={id}
								id={id}
								title={title}
								imageUrl={imageUrl}
								publishedAt={publishedAt}
								commentsCount={comments.length}
							/>
						))}
					</div>
				) : (
					<div className="no-posts-found">Статьи не найдены</div>
				)}
			</div>
			{lastPage > 1 && posts.length > 0 && (
				<Pagination page={page} lastPage={lastPage} setPage={setPage} />
			)}
		</div>
	);
};

export const Main = styled(MainContainer)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	& .post-list {
		display: flex;
		flex-wrap: wrap;
		padding: 20px 20px 80px;
	}

	& .no-posts-found {
		font-size: 18px;
		margin-top: 40px;
		text-align: center;
	}

	& .request-error {
		margin-top: 24px;
		text-align: center;
		color: #c00;
	}
`;
