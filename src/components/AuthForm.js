import React, {useState} from 'react';
import {authService} from "fbase";

const AuthForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState('');
    const onChange = e => {
        const {
            target: {name, value}
        } = e;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                )
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(
                    email, password
                )
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required value={email}
                    onChange={onChange}
                    className="authInput"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}/>
                <input
                    type="submit"
                    className="authInput authSubmit"
                    value={newAccount ? "Create Account" : "Log In"}/>
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign in" : "Create Account"}
            </span>
        </>
    )
}
export default AuthForm;