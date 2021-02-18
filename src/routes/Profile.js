import React, {useEffect, useState} from 'react';
import {authService, dbService} from "../fbase";
import {useHistory} from "react-router";

export default ({userObj, refreshUser}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const onChange = e => {
        const {
            target: {value},
        } = e;
        setNewDisplayName(value);
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    }
    // DB 데이터 필터링(firebase index 생성 필요)
    const getMyNweets = async () => {
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createAt")
            .get();
    };

    useEffect(() => {
        getMyNweets();
    }, [])
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange}
                       type="text"
                       autoFocus
                       placeholder="Display name"
                       value={newDisplayName}
                       className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
};