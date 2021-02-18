import React, {useState} from 'react';
import {dbService, storageService} from "../fbase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPencilAlt} from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    // 수정하고 있는지 아닌지를 판단하는 editing
    const [editing, setEditing] = useState(false);
    // input의 값을 수정할 경우 사용되는 newNweet
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            // delete nweet
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            // delete photo (storage에 업로드 된 사진의 URL을 얻는 refFromURL 메서드)
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(nweetObj, newNweet);
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet,
        });
        setEditing(false);
    }
    const onChange = e => {
        const {
            target: {value}
        } = e;
        setNewNweet(value);
    };
    return (
        <div className="nweet">
            {
                editing ? (
                    <>
                        {isOwner && (
                            <>
                                <form onSubmit={onSubmit} className="container nweetEdit">
                                    <input
                                        type="text"
                                        placeholder="Edit your nweet"
                                        value={newNweet}
                                        required
                                        autoFocus
                                        onChange={onChange}
                                        className="formInput"
                                    />
                                    <input type="submit" value="Update Nweet" className="formBtn"/>
                                </form>
                                <span onClick={toggleEditing} className="formBtn cancelBtn">
                                    Cancel
                                </span>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl}/>}
                        {isOwner && (
                            <div className="nweet__actions">
                              <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash}/>
                              </span>
                                <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt}/>
                              </span>
                            </div>
                        )}
                    </>
                )}
        </div>
    );
};
export default Nweet;
