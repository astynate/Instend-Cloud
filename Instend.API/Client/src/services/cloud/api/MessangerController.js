class MessangerController {
    static CreateGroup = async () => {
        // const connectionId = globalWSContext?.connection?.connectionId;

        // if (!connectionId) {
        //     applicationState.AddErrorInQueue('Attantion!', 'Check your connection.');
        //     return;
        // }
        
        // if (name === '' || name === null || name === undefined) {
        //     applicationState.AddErrorInQueue('Attantion!', 'Name fields is required.');
        //     return;
        // }

        // if (avatar === null || avatar === undefined) {
        //     applicationState.AddErrorInQueue('Attantion!', 'Please select a group avatar.');
        //     return;
        // }

        // let form = new FormData();

        // form.append('name', name);
        // form.append('connectionId', connectionId);
        // form.append('avatar', avatar);

        // await instance.post('/api/groups', form)
        //     .then(response => {
        //         var result = response.data;

        //         if (result) {
        //             chatsState.addGroup(result);
        //             navigate(`/messages/${result.Id}`);
        //         }
        //     })
        //     .catch(error => {
        //         applicationState.AddErrorInQueue('Attantion!', 'Something went wrong.');
        //     });

        // close();
    };

    static CreateDirect = () => {
        // if (user.id === userState.user.id) {
        //     applicationState.AddErrorInQueue('Attantion!', `You can't chat with yourself!`);
        //     return;
        // }

        // const chat = ChatHandler.GetChat(user.id);

        // if (chat) {
        //     navigate(`/messages/${chat.id}`);
        //     setCreatePopUpState(false);
        //     return;
        // }

        // if (user.id) {
        //     const result = chatsState.setDraft(user);
            
        //     if (result === true) {
        //         navigate(`/messages`);
        //     }
        // }

        // setCreatePopUpState(false);
    };
};

export default MessangerController;