import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Login.css";


export const Register = () => {

    const [registerUser, setRegisterUser] = useState({ firstName: "", lastName: "", email: "", username: "", password: "" });
    const [conflictDialog, setConflictDialog] = useState(false);

    const history = useHistory();

    const handleInputChange = (event) => {
        const newUser = { ...registerUser }
        newUser[event.target.id] = event.target.value
        setRegisterUser(newUser)
    };

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?username=${registerUser.username}`)
            .then(res => res.json())
            .then(user => !!user.length)
    };

    const handleRegister = (e) => {
        e.preventDefault()

        existingUserCheck()
            .then((userExists) => {
                if (!userExists) {
                    fetch("http://localhost:8088/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: registerUser.email,
                            name: `${registerUser.firstName} ${registerUser.lastName}`,
                            username: registerUser.username,
                            password: registerUser.password
                        })
                    })
                        .then(res => res.json())
                        .then(createdUser => {
                            if (createdUser.hasOwnProperty("id")) {
                                sessionStorage.setItem("pandaAja_user", createdUser.id)
                                history.push("/")
                            }
                        })
                }
                else {
                    setConflictDialog(true)
                };
            });

    };

    return (
        <div className="loginDiv">
            <main className="container--register">

                <dialog className="dialog dialog--password" open={conflictDialog}>
                    <div>Account with that email address already exists</div>
                    <button className="button--close" onClick={e => setConflictDialog(false)}>Close</button>
                </dialog>

                <form className="form--login" onSubmit={handleRegister}>
                    <h1 className="h3 mb-3 font-weight-normal registerHeader">Please Register for Panda-Aja!</h1>
                    <img className="avatar" src="./images/panda-aja.PNG" alt=""></img>
                    <fieldset className="fieldDiv">
                        <label className="reg_label"  htmlFor="firstName"> First Name: </label>
                        <input type="text" name="firstName" id="firstName" className="reg_input" placeholder="First name..." required autoFocus value={registerUser.firstName} onChange={handleInputChange} />
                    </fieldset>
                    <fieldset className="fieldDiv">
                        <label className="reg_label" htmlFor="lastName"> Last Name: </label>
                        <input type="text" name="lastName" id="lastName" className="reg_input" placeholder="Last name..." required value={registerUser.lastName} onChange={handleInputChange} />
                    </fieldset>
                    <fieldset className="fieldDiv">
                        <label className="reg_label"  htmlFor="inputUsername"> Username: </label>
                        <input type="username" name="username" id="username" className="reg_input" placeholder="Username..." required value={registerUser.username} onChange={handleInputChange} />
                    </fieldset>
                    <fieldset className="fieldDiv">
                        <label className="reg_label"  htmlFor="inputPassword"> Password: </label>
                        <input type="password" name="password" id="password" className="reg_input" placeholder="Password..." required value={registerUser.password} onChange={handleInputChange} />
                    </fieldset>
                    <fieldset className="fieldDiv">
                        <label className="reg_label" htmlFor="inputEmail"> Email address: </label>
                        <input type="email" name="email" id="email" className="reg_input" placeholder="Email address..." required value={registerUser.email} onChange={handleInputChange} />
                    </fieldset>
                    <fieldset>
                        <button className="registerBut" type="submit"> Sign In </button>
                    </fieldset>
                </form>
            </main>
        </div>
    );
};