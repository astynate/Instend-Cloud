import { observer } from "mobx-react-lite";
// import Input from "../../../shared/input/Input";
// import MessangerHeader from "../components/Header/MessangerHeader";
// import MessageList from "../components/message-list/MessageList";
// import ChatPlaceholder from "../components/chat-placeholder/ChatPlaceholder";
// import styles from './main.module.css';
// import userState from "../../../../../../../state/entities/UserState";
// import { DeleteDirectory } from "../../chats/Chats";
// import { useParams } from "react-router-dom";
// import { globalWSContext } from "../../../../../layout/Layout";

// export const ChangeAccessStateAsync = async (id, isAccept) => {
//     try {
//         while (globalWSContext.connection.state !== 'Connected') {
//             if (globalWSContext.connection.state === 'Disconnected') {
//                 await globalWSContext.connection.start();
//             }
//             await new Promise(resolve => setTimeout(resolve, 1000));
//         }

//         await globalWSContext.connection.invoke("ChangeAccessState", id, localStorage.getItem("system_access_token"), isAccept);
//     } catch (error) {
//         console.error('Failed to connect or join:', error);
//     }
// };

const Direct = observer(({operation, setDefaultOperation, chat, scrollElement}) => {
    // const params = useParams();

    // const isUserInviter = () => {
    //     return chat.ownerId === userState.user.id;
    // }

    // return (
    //     <>
    //         <MessangerHeader 
    //             avatar={chat.avatar}
    //             title={chat.name}
    //             subTitle={"last seen recently"}
    //         />
    //         {!chat.isAccepted && 
    //             <div className={styles.middle}>
    //                 <ChatPlaceholder 
    //                     title={isUserInviter() ? "Invitation sent" : "You receive a chat ivent"}
    //                     subTitle={isUserInviter() ? "If you want you can unsend your invitation" : "If you want to chat with this user click accept"} 
    //                 />
    //             </div>
    //         }
    //         <MessageList 
    //             chat={chat} 
    //             scroll={scrollElement} 
    //         />
    //         {chat.isAccepted ? 
    //             <Input
    //                 operation={operation}
    //                 setDefaultOperation={setDefaultOperation}
    //                 chat={chat}
    //             />
    //         :
    //             isUserInviter() ?
    //                 <div 
    //                     className={styles.inputPlaceholder}
    //                     onClick={() => DeleteDirectory(params.id)}
    //                 >
    //                     <button className={styles.reject}>Unsend</button>
    //                 </div>
    //             :
    //                 <div className={styles.inputPlaceholder}>
    //                     <button 
    //                         className={styles.accept}
    //                         onClick={() => ChangeAccessStateAsync(chat.directId ?? "", true)}
    //                     >
    //                         Accept
    //                     </button>
    //                     <button 
    //                         className={styles.reject}
    //                         onClick={() => DeleteDirectory(params.id)}
    //                     >
    //                         Reject
    //                     </button>
    //                 </div>
    //         }
    //     </>
    // );
});

export default Direct;