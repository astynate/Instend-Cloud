import { makeAutoObservable } from "mobx";

class HomeState {
    communities = [];
    publications = [];
    community = null;
    publicationQueueId = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setCommunities = (communities) => this.communities = communities;
    setPublications = (publications) => this.publications = publications;
    setPublicationQueueId = (queueId) => this.publicationQueueId = queueId;

    UpdateCommunityFollowers = (id, count) => {
        const isCommunityOpen = this.community && this.community.id;
        const isCurrentCommunityOpen = id && isCommunityOpen && this.community.id === id;

        if (isCurrentCommunityOpen === true) {
            const index = this.communities.findIndex(c => c.id === id);

            if (index >= 0 && this.communities[index].followers + count >= 0)
                this.communities[index].followers += count;

            if (this.community.followers + count >= 0) 
                this.community.followers += count;
        }
    }

    setCommunity = (community) => {
        this.community = community;
        this.publications = [];
    }
}

export default new HomeState();