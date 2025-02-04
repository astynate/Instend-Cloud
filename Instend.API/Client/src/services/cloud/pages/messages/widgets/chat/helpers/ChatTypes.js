import DirectInformationType from "../components/chat-information-types/types/direct-information-type/DirectInformationType";
import GroupInformationType from "../components/chat-information-types/types/group-information-type/GroupInformationType";
import Direct from "../types/Direct";
import Draft from "../types/Draft";
import Group from "../types/Group";
import NotSelected from "../types/NotSelected";

const ChatTypes = {
    notSelect: {
        prefix: 'unselect',
        type: -1,
        object: NotSelected,
        information: undefined
    },
    direct: {
        prefix: 'direct',
        type: 0,
        object: Direct,
        information: DirectInformationType
    },
    group: {
        prefix: 'group',
        type: 1,
        object: Group,
        information: GroupInformationType
    },
    draft: {
        prefix: 'draft',
        type: 2,
        object: Draft,
        information: undefined
    },
};

export default ChatTypes;