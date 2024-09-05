import React from 'react';
import Title from '../../../../shared/ui-kit/retractable-panel/title/Title';
import styles from './main.module.css';
import ExploreItems from '../../widgets/explore-items/ExploreItems';
import User from '../../features/user/User';
import { observer } from 'mobx-react-lite';
import exploreState from '../../../../../../states/explore-state';
import { ConvertBytesToMb } from '../../../../../../utils/handlers/StorageSpaceHandler';
import userState from '../../../../../../states/user-state';
import Placeholder from '../../../../shared/placeholder/Placeholder';
import File from '../../../cloud/shared/file/File';

const All = observer(() => {
    if (exploreState.users.length > 0) {
        return (
            <>
                <Title value="People" />
                <ExploreItems>
                    {exploreState.users.map((element, index) => {
                        if (element && element.id && element.id !== userState.user.id) {
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
                <Title value="Files" />
                <ExploreItems>
                    {exploreState.files.map((element, index) => {
                        return (
                            <File
                                key={element.id ? element.id : index} 
                                name={element.name}
                                file={element}
                                time={element.lastEditTime}
                                image={element.fileAsBytes == "" ? null : element.fileAsBytes}
                                type={element.type}
                                isLoading={element.isLoading}
                                isSelected={false}
                                onClick={() => {}}
                                onContextMenu={() => {}}
                            />
                        );
                    })}
                </ExploreItems>
            </>
        );
    } else {
        return (
            <div className={styles.placeholder}>
                <Placeholder title={"Enter your request in the 'Search in Yexider' field."} />
            </div>
        );
    }
});

export default All;