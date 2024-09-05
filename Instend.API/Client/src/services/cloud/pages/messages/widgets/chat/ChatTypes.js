import Direct from "./types/Direct";
import Draft from "./types/Draft";
import Group from "./types/Group";

const ChatTypes = {
    notSelect: undefined,
    direct: {
        prefix: 'direct',
        type: 0,
        object: Direct,
    },
    group: {
        prefix: 'group',
        type: 1,
        object: Group,
    },
    draft: {
        prefix: 'draft',
        type: 2,
        object: Draft
    },
};

export default ChatTypes;