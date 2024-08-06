import styles from './main.module.css';
import { instance } from "../../../../../../state/Interceptors";
import userState from "../../../../../../states/user-state";
import { AddUploadingAlbumComment } from "../../../../api/CommentAPI";
import MainContentWrapper from "../../../../features/main-content-wrapper/MainContentWrapper";
import Comments from "../../../../widgets/social/comments/Comments";
import { useState } from 'react';
import Pagination from '../../../../elements/pagination/Pagination';

const News = () => {
    const [news, setNews] = useState([]);
    
    const sortByDate = (a, b) => {
        const dateA = new Date(a.comment.date);
        const dateB = new Date(b.comment.date);
    
        return dateB - dateA;
    }

    async function fetchNews(publictions) {
        let result = false;
        let lastPublictionTime = '';

        if (publictions.length > 0) {
            lastPublictionTime = publictions[publictions.length - 1].comment.date;
        }

        await instance.get(`api/news?lastPublitionDate=${lastPublictionTime}`)
            .then((response) => {
                setNews(publictions => {
                    const ids = publictions.map(element => element.id);
                    const newPosts = response.data.filter(post => ids.includes(post.id) === false);

                    result = newPosts.length >= 7;
                    return [...publictions, ...newPosts].sort(sortByDate);
                });

                return result;
            })

        return result;
    }

    return (
        <MainContentWrapper>
            <Comments 
                isPublications={true}
                isPublicationAvailable={false}
                fetch_callback={fetchNews}
                comments={news}
                id={userState.user.id}
                setUploadingComment={() => {}}
                deleteCallback={async (id) => {
                    await instance.delete(`/api/album-comments?id=${id}&albumId=${userState.user.id}&type=${2}`)
                }}
            />
            <Pagination fetchRequest={() => {
                setNews(prev => {
                    fetchNews(prev);
                    return prev;
                })
            }} />
        </MainContentWrapper>
    );
}

export default News;