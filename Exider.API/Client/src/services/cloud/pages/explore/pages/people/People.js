import { observer } from 'mobx-react-lite';
import React from 'react';
import ExploreItems from '../../widgets/explore-items/ExploreItems';
import { ConvertBytesToMb } from '../../../../../../utils/handlers/StorageSpaceHandler';
import userState from '../../../../../../states/user-state';
import User from '../../features/user/User';

const People = observer(() => {
    return (
        <div>
            <ExploreItems>
                {userState.friends.map((element, index) => {
                    console.log(element)
                    if (element && element.id && !element.nickname) {
                        (async () => {
                            await userState.GetFriend(element.userId === userState.user.id ? element.ownerId : element.userId);
                        })();
                    }

                    if (element && element.id && element.nickname) {
                        return (
                            <User
                                key={index} 
                                id={element.id}
                                avatar={element.avatar}
                                nickname={element.nickname}
                                name={`${element.name} ${element.surname}`}
                                coins={element.balance}
                                friends={element.friendCount}
                                space={ConvertBytesToMb(element.storageSpace)}
                            />
                        );
                    } else {
                        return null;
                    }
                })}
            </ExploreItems>
        </div>
    );
});

export default People;