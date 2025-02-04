const DirectPreview = () => {
    return (
        <ChatPreview 
            key={chat.id}
            chat={chat}
        />
    );
};

export default DirectPreview;