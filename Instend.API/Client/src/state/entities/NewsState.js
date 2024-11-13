import { makeAutoObservable } from "mobx";

class NewsState {
    news = [];
    isHasMore = true;
    
    constructor() {
        makeAutoObservable(this);
    }

    sortByDate = (a, b) => {
        const dateA = new Date(a.comment.date);
        const dateB = new Date(b.comment.date);
    
        return dateB - dateA;
    }

    setLike = (id, state) => {
        let post = this.news.find(p => p.comment.id === id);

        if (post) {
            post.comment.isLiked = state;
            post.comment.likes += state ? 1 : -1;
        }
    }

    // setNews = (news) => {
    //     if (this.isHasMore === true) {
    //         let lastPublicationDate = '';
    
    //         if (this.news.length > 0) {
    //             lastPublicationDate = this.news[this.news.length - 1].comment.date;
    //         }
    //     }
    // }
}

export default new NewsState();