import React, {useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);

    // component가 mounted되면 한 번만 호출되는 useEffect
    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                // String, Boolean 타입이 아닌 Object(e.g. user)의 경우엔 필요한 객체만 불러온다.
                // ex) 성능 이슈 및 리렌더링이 안되는 문제의 소지가 있다.
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: (args) => user.updateProfile(args),
                });
            } else {
                setUserObj(null);
            }
            setInit(true)
        });
    }, []);
    const refreshUser = () => {
        const user = authService.currentUser;
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
        });
    }
    return (
        <>
            {init ? <AppRouter
                refreshUser={refreshUser}
                isLoggedIn={Boolean(userObj)}
                userObj={userObj}/> : "Initializing..."}
            <footer>&copy;{new Date().getFullYear()} Nwitter</footer>
        </>
    );
}

export default App;
