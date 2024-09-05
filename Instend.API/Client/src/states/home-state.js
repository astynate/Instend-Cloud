import { instance } from '../state/Interceptors';
import { makeAutoObservable } from "mobx";

class HomeState {
    communities = [];
    publications = [];
    community = null;
    publicationQueueId = 0;

    constructor() {
        makeAutoObservable(this);
    }

    UpdateCommunityFollowers = (id, count) => {
        if (id) {
            const index = this.communities
                .findIndex(c => c.id === id);

            if (index >= 0 && this.communities[index].followers + count >= 0) {
                this.communities[index].followers += count;
            }

            if (this.community && 
                this.community.id && 
                this.community.id === id &&
                this.community.followers + count >= 0
                ) 
            {
                this.community.followers += count;
            }
        }
    }

    GetPopularCommunities = async (from = 0, count = 20) => {
        await instance.get(`/api/community?from=${from}&count=${count}`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    this.communities = response.data;
                }
            });
    }

    setPublications = (publications) => {
        this.publications = publications;
    }

    setCommunity = (community) => {
        this.community = community;
        this.publications = [];
    }

    setPublicationQueueId = (queueId) => {
        this.publicationQueueId = queueId;
    }
}

export default new HomeState();