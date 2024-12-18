import { makeAutoObservable } from "mobx";

class NewsState {
    news = [];
    publication = undefined;
    isHasMore = true;
    
    constructor() {
        makeAutoObservable(this);
    }

    sortByDate = (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
    
        return dateB - dateA;
    }
    
    addNews = (newsToAdd) => { 
        const ids = this.news.map(element => element.id);
        const newPosts = newsToAdd.filter(post => !ids.includes(post.id));

        this.news = [...this.news, ...newPosts];
    };

    setPublication = (publication) => {
        this.publication = publication;
    }

    addPublicationComment = (comment) => {
        if (!!this.publication === false) {
            return null;
        }

        this.publication.comments = [
            comment, 
            ...this.publication.comments
        ];
    }

    /// If not exist: create groupedReaction for it
    /// If exist, but user is not already reacted: create targetAccountReaction
    /// If exist and user reacted: remove grouped reaction
    setTargetAccountReaction = (id, reactionId) => {
        let publication = this.news.find(p => p.id === id);

        if (!!publication === false) {
            return;
        }

        let groupedReaction = publication.groupedReactions
            .find(r => r.reactionId === reactionId);

        let userReaction = publication.groupedReactions
            .find(r => !!r.targetAccountReaction);

        if (!!groupedReaction === false) {
            if (!!userReaction === true) {
                publication.groupedReactions = publication.groupedReactions
                    .filter(r => !!r.targetAccountReaction === false);
            }

            if (!!userReaction === false) {
                publication.numberOfReactions++;
            }

            const targetAccountReaction = {
                reactionId: reactionId,
                count: 1,
                reaction: {},
                targetAccountReaction: {}
            };

            publication.groupedReactions = [
                ...publication.groupedReactions, 
                targetAccountReaction
            ];
        } else if (!!groupedReaction.targetAccountReaction === false) {
            groupedReaction.targetAccountReaction = {};
        } else {
            publication.groupedReactions = publication.groupedReactions
                .filter(r => r.reactionId !== reactionId);

            publication.numberOfReactions--;
        }

        publication = {...publication};
    }

    setHasMoreState = (state) => this.isHasMore = state;
    setNews = (newsToSet) => this.news = newsToSet;
    popPublication = (publication) => this.news = [publication, ...this.news];
    
    deletePublication = (id) => {
        if (!!this.publication === true) {
            this.publication.comments = this.publication.comments
                .filter(p => p.id !== id);
        }

        this.news = this.news.filter(p => p.id !== id);
    }
}

export default new NewsState();