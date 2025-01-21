import { instance } from "../../../state/application/Interceptors"

class AccessController {
    static UpdateCollectionAccess = async (id, access, roles) => {
        const form = new FormData();

        form.append('id', id);
        form.append('type', access);

        for (let i = 0; i < roles.length; i++) {
            form.append(`users[${i}].CollectionId`, roles[i].itemId ?? roles[i].collectionId);
            form.append(`users[${i}].AccountId`, roles[i].accountId);
            form.append(`users[${i}].Role`, roles[i].role);
        }

        await instance
            .post('/api/access/collections', form);
    };
};

export default AccessController;