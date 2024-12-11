import { makeAutoObservable } from "mobx";

class NewsState {
    news = [];
    isHasMore = true;
    
    constructor() {
        makeAutoObservable(this);
    }

    sortByDate = (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
    
        return dateB - dateA;
    }

    setLike = (id, state) => {
        let post = this.news.find(p => p.comment.id === id);

        if (post) {
            post.isLiked = state;
            post.numberOfLikes += state ? 1 : -1;
        }
    }

    setHasMoreState = (state) => this.isHasMore = state;
    setNews = (newsToSet) => this.news = newsToSet.sort(this.sortByDate);;
    
    addNews = (newsToAdd) => { 
        const ids = this.news.map(element => element.id);
        const newPosts = newsToAdd.filter(post => !ids.includes(post.id));

        this.news = [...this.news, ...newPosts].sort(this.sortByDate);
    };
}

export default new NewsState();