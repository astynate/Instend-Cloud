import { instance } from "../../../state/application/Interceptors";

class CommunityController {
    static ChangeFollowingState = async (id) => {
        await instance
            .put(`api/community/followers?id=${id}`)
            .then(resonse => {
                if (resonse && resonse.data !== null && resonse.data !== undefined) {
                    if (resonse.data === true) {
                        userState.AddCommunity({id: id});
                        homeState.UpdateCommunityFollowers(id, 1);
                    } else {
                        userState.RemoveCommunity({id: id});
                        homeState.UpdateCommunityFollowers(id, -1);
                    }
    
                    return resonse.data;
                }
            });
    }

    static GetPopularCommunities = async (from = 0, count = 20) => {
        let communities = [];

        await instance
            .get(`/api/community?from=${from}&count=${count}`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    communities = response.data;
                }
            });


        return communities;
    }

    static GetCommunityById = async (id) => {
        let community = null;

        await instance
            .get(`/api/community/single?id=${id}`)
            .then((response) => {
                if (response.status === 200 && response.data && response.data.ownerId) {
                    const index = this.communities.findIndex(c => c.id === id);

                    if (index !== -1) {
                        this.communities[index] = response.data;
                        return true;
                    }
                }
            });

        return community;
    }

    static CreateCommunity = async (name, description, avatar, header) => {
        let form = new FormData();
    
        form.append('name', name);
        form.append('description', description);
        form.append('avatar', avatar);
        form.append('header', header);
        
        await instance
            .post('/api/community', 
                form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    }    
}

export default CommunityController;