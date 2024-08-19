import Direct from "./types/Direct";
import Draft from "./types/Draft";
import Group from "./types/Group";

const ChatTypes = {
    NotSelect: undefined,
    Direct: {
        prefix: 'direct',
        type: 0,
        object: Direct,
    },
    Group: {
        prefix: 'group',
        type: 1,
        object: Group,
    },
    Draft: {
        prefix: 'draft',
        type: 2,
        object: Draft
    },
};

export default ChatTypes;