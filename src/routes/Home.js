import React, {useEffect, useState} from 'react';
import {dbService, storageService} from 'fbase';
import Nweet from 'components/Nweet';
import {v4 as uuidv4} from 'uuid';
import NweetFactory from "../components/NweetFactory";

const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([]);
    useEffect(() => {
        // 데이터베이스 변경이 있을 경우 알림을 받는 onSnapshot 메서드(실시간 반응)
        dbService.collection('nweets').onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, [])

    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {nweets.map(nweet => (
                    <Nweet key={nweet.id}
                           nweetObj={nweet}
                           isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
}
export default Home;