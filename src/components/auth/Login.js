import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";


export const Login = () => {

    const [loginUser, setLoginUser] = useState({ 
        username: "",
        password: ""
    })
    const [existDialog, setExistDialog] = useState(false)

    const history = useHistory()

    const handleInputChange = (event) => {
        const newUser = { ...loginUser }
        newUser[event.target.id] = event.target.value
        setLoginUser(newUser)
    }


    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?username=${loginUser.username}&?password=${loginUser.password}`)
            .then(res => res.json())
            .then(user => user.length ? user[0] : false)
    }

    const handleLogin = (e) => {
        e.preventDefault()

        existingUserCheck()
            .then(exists => {
                if (exists) {
                    sessionStorage.setItem("pandaAja_user", exists.id)
                    history.push("/decks")
                } else {
                    setExistDialog(true)
                }
            })
    }

    return (
        <div className="loginDiv">
            <main className="container--login">
                <dialog className="dialog dialog--auth" open={existDialog}>
                    <div>User does not exist</div>
                    <button className="button--close" onClick={e => setExistDialog(false)}>Close</button>
                </dialog>
                <section>
                    <form className="form--login" onSubmit={handleLogin}>
                        <h1 className="appHeader">Panda-Aja!</h1>
                        <img className="avatar" src="./images/panda-aja.PNG" alt=""></img>
                        <fieldset>
                            <label className="log_label" htmlFor="inputEmail"> Username: </label>
                            <div class="logDiv">
                                <img class="logIcon" src="https://img.icons8.com/ios-glyphs/30/000000/user--v1.png"/>
                                <input type="text"
                                    id="username"
                                    className="log_input"
                                    placeholder="Enter username..."
                                    required autoFocus
                                    value={loginUser.username}
                                    onChange={handleInputChange} />
                            </div>
                        </fieldset>
                        <fieldset>
                            <label className="log_label" htmlFor="inputPassword"> Password: </label>
                            <div class="logDiv">
                                <img class="logIcon" src="https://img.icons8.com/material-rounded/24/000000/lock--v2.png"/>
                                <input type="password"
                                    id="password"
                                    className="log_input"
                                    placeholder="Enter password..."
                                    required autoFocus
                                    value={loginUser.password}
                                    onChange={handleInputChange} />
                            </div>
                        </fieldset>
                        <fieldset>
                            <button id="loginButton" type="submit">
                                Login
                            </button>
                        </fieldset>
                    </form>
                </section>
                <section className="link--register">
                    <Link to="/register">Register for an account</Link>
                </section>
            </main>
        </div>
    )
};