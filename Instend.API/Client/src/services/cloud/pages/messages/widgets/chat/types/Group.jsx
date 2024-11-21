import { observer } from "mobx-react-lite";
// import { useState } from "react";
// import Input from "../../../shared/input/Input";
// import UsersPopUp from "../../../shared/users-pop-up/UsersPopUp";
// import MessangerHeader from "../components/Header/MessangerHeader";
// import MessageList from "../components/message-list/MessageList";
// import Container from "../../../features/chat-information/elements/container/Container";
// import styles from './main.module.css';
// import plus from '../images/general/plus.png';
// import Base64Handler from "../../../../../../../utils/handlers/Base64Handler";
// import Button from "../../../../cloud/shared/button/Button";
// import { instance } from "../../../../../../../state/Interceptors";
// import chatsState from "../../../../../../../states/ChatsState";
// import applicationState from "../../../../../../../states/application-state";

const Group = observer(({operation, setDefaultOperation, chat, scrollElement}) => {
    // const [isUsersPopUpOpen, setUsersPopUpOpenState] = useState(false);
    // const [isChatInformation, setChatInformation] = useState(false);
    // const [searchUsers, setSearchUsers] = useState([]);

    // const isMemberExist = (id) => {
    //     return chat.members && chat.members
    //         .map(x => x ? x.id ?? x.Id : "").includes(id);
    // }

    // return (
    //     <>
    //         <MessangerHeader
    //             isChatInformation={isChatInformation}
    //             setChatInformation={setChatInformation}
    //             avatar={chat.avatar}
    //             title={chat.name}
    //             subTitle={`${chat.members ? chat.members.length : 0} members`}
    //             chat={chat}
    //             additionalContent={
    //                 <div 
    //                     className={styles.addUser} 
    //                     onClick={() => {
    //                         setUsersPopUpOpenState(true);
    //                         setChatInformation(false);
    //                     }}
    //                 >
    //                     <img src={plus} />
    //                     <span>Add members</span>
    //                 </div>
    //             }
    //             content={                    
    //                 <>
    //                     <Container
    //                         title={"Members"} 
    //                         content={
    //                             <div className={styles.list}>
    //                                 {chat && chat.members && chat.members.map(user => {
    //                                     if (user && user.avatar && user.nickname) {
    //                                         return (
    //                                             <div className={styles.user} key={user.id}>
    //                                                 <div className={styles.userAvatar}>
    //                                                     <img src={Base64Handler.Base64ToUrlFormatPng(user.avatar ?? "")} draggable="false" />
    //                                                 </div>
    //                                                 <div className={styles.information}>
    //                                                     <span className={styles.title}>{user.nickname} {user.id === chat.ownerId ? "(owner)" : null}</span>
    //                                                     <span className={styles.status}>last seen recently</span>
    //                                                 </div>
    //                                             </div>
    //                                         );
    //                                     } else {
    //                                         return null;
    //                                     }
    //                                 })}
    //                             </div>
    //                         }
    //                     />
    //                 </>
    //             }
    //         />
    //         <UsersPopUp
    //             mainTitle="Add members"
    //             title="Save changes"
    //             open={isUsersPopUpOpen}
    //             back={() => {
    //                 setChatInformation(true);
    //                 setUsersPopUpOpenState(false);
    //             }}
    //             close={() => {
    //                 setChatInformation(false);
    //                 setUsersPopUpOpenState(false);
    //             }}
    //             callback={async () => {
    //                 let form = new FormData();

    //                 form.append('id', chat.id ?? chat.Id);

    //                 for (let index in chat.members) {
    //                     form.append('users', chat.members[index].id);
    //                 }

    //                 await instance
    //                     .post('api/groups/members', form)
    //                     .catch(_ => {
    //                         applicationState.AddErrorInQueue('Attantion!', 'Something went wrong.')
    //                     });

    //                 setChatInformation(false);
    //                 setUsersPopUpOpenState(false);
    //             }}
    //             userButton={
    //                 (user) => (user.id ?? user.Id) !== chat.ownerId && (
    //                     <button 
    //                         className={styles.button}
    //                         onClick={() => {
    //                             if (isMemberExist(user.id)) {
    //                                 chatsState.removeGroupMember(chat.id, user.id);
    //                             } else {
    //                                 chatsState.addGroupMember(chat.id, user);
    //                             }

    //                             setSearchUsers(searchUsers
    //                                 .filter(e => isMemberExist(e.id) === false));
    //                         }}
    //                     >
    //                         <span>{isMemberExist(user.id) ? 'Remove' : 'Add'}</span>
    //                     </button>
    //                 )
    //             }
    //             setSearchResult={setSearchUsers}
    //             setSearchingState={() => {}}
    //             setLoadingState={() => {}}
    //             GetData={async (prefix) => {
    //                 const result = await instance
    //                     .get(`/accounts/all/${prefix}`);

    //                 if (result && result.data && result.data.length > 0) {
    //                     setSearchUsers(result.data.filter(e => isMemberExist(e.id) === false));
    //                 }
    //             }}
    //             searchUsers={searchUsers}
    //             isHasSubmitButton={true}
    //             userCallback={() => {}}
    //             existingUsers={chat.members ?? []}
    //         />
    //         <MessageList 
    //             chat={chat} 
    //             scroll={scrollElement} 
    //         />
    //         <Input
    //             operation={operation}
    //             setDefaultOperation={setDefaultOperation}
    //             chat={chat}
    //             type={1}
    //         />
    //     </>
    // );
});

export default Group;