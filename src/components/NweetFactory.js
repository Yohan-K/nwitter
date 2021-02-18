import React, {useState} from 'react';
import {dbService, storageService} from "fbase";
import {v4 as uuidv4} from "uuid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    // form을 위한 state
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (e) => {
        if (nweet === "") {
            return;
        }
        e.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            // uuid를 사용해 File Reference 생성
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);
            // "data_url" == FileReader().readAsDataURL()
            // File URL이 String 형식이기 때문에 putString 메서드를 사용
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        // 1. File을 Storage에 저장
        // 2. File URL을 가지고 nweet에 추가하여 DB에 저장
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
    };
    const onChange = e => {
        const {
            target: {value},
        } = e;
        setNweet(value);
    };
    const onFileChange = e => {
        const
            {
                target: {files}
            } = e;
        const theFile = files[0];
        // fileReader API 사용
        const reader = new FileReader();
        // 파일 로딩이 끝나면 finishedEvent를 갖는다.
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            )}
        </form>
    )
};
export default NweetFactory;