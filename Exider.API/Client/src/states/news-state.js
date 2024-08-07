import { makeAutoObservable } from "mobx";
import { instance } from "../state/Interceptors";

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

    setNews = async () => {
        if (this.isHasMore === true) {
            let lastPublicationDate = '';
    
            if (this.news.length > 0) {
                lastPublicationDate = this.news[this.news.length - 1].comment.date;
            }
    
            await instance.get(`api/news?lastPublicationDate=${lastPublicationDate}`)
                .then((response) => {
                    const ids = this.news.map(element => element.id);
                    const newPosts = response.data.filter(post => !ids.includes(post.comment.id));
    
                    if (newPosts.length && newPosts.length > 0) {
                        this.news = [...this.news, ...newPosts].sort(this.sortByDate);
                    }
    
                    this.isHasMore = newPosts.length && newPosts.length >= 7;
                });
        }
    }
}

export default new NewsState();