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
                    history.push("/")
                } else {
                    setExistDialog(true)
                }
            })
    }

    return (
        <main className="container--login">
            <dialog className="dialog dialog--auth" open={existDialog}>
                <div>User does not exist</div>
                <button className="button--close" onClick={e => setExistDialog(false)}>Close</button>
            </dialog>
            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>Panda-Aja!</h1>
                    <h2>Please Sign In</h2>
                    <fieldset>
                        <label htmlFor="inputEmail"> Username: </label>
                        <input type="text"
                            id="username"
                            className="form-control"
                            placeholder="Username"
                            required autoFocus
                            value={loginUser.username}
                            onChange={handleInputChange} />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="inputPassword"> Password: </label>
                        <input type="password"
                            id="password"
                            className="form-control"
                            placeholder="Password"
                            required autoFocus
                            value={loginUser.password}
                            onChange={handleInputChange} />
                    </fieldset>
                    <fieldset>
                        <button type="submit">
                            Sign in
                        </button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link to="/register">Register for an account</Link>
            </section>
        </main>
    )
};





// export const Login = () => {
//     const [loginUser, setLoginUser] = useState({ email: "" })
//     const [existDialog, setExistDialog] = useState(false)

//     const history = useHistory()

//     const handleInputChange = (event) => {
//         const newUser = { ...loginUser }
//         newUser[event.target.id] = event.target.value
//         setLoginUser(newUser)
//     }


//     const existingUserCheck = () => {
//         return fetch(`http://localhost:8088/users?email=${loginUser.email}`)
//             .then(res => res.json())
//             .then(user => user.length ? user[0] : false)
//     }

//     const handleLogin = (e) => {
//         e.preventDefault()

//         existingUserCheck()
//             .then(exists => {
//                 if (exists) {
//                     sessionStorage.setItem("pandaAja_user", exists.id)
//                     history.push("/")
//                 } else {
//                     setExistDialog(true)
//                 }
//             })
//     }

//     return (
//         <main className="container--login">
//             <dialog className="dialog dialog--auth" open={existDialog}>
//                 <div>User does not exist</div>
//                 <button className="button--close" onClick={e => setExistDialog(false)}>Close</button>
//             </dialog>
//             <section>
//                 <form className="form--login" onSubmit={handleLogin}>
//                     <h1>Panda-Aja!</h1>
//                     <h2>Please Sign In</h2>
//                     <fieldset>
//                         <label htmlFor="inputEmail"> Email address: </label>
//                         <input type="email"
//                             id="email"
//                             className="form-control"
//                             placeholder="Email address"
//                             required autoFocus
//                             value={loginUser.email}
//                             onChange={handleInputChange} />
//                     </fieldset>
//                     <fieldset>
//                         <button type="submit">
//                             Sign in
//                         </button>
//                     </fieldset>
//                 </form>
//             </section>
//             <section className="link--register">
//                 <Link to="/register">Register for an account</Link>
//             </section>
//         </main>
//     )
// };