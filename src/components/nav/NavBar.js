import React, { useState} from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./NavBar.css";


export const NavBar = (props) => {

  const history = useHistory()

  let [isActive, setIsActive] = useState("home");
  
  const checkNavState = (navLocation) => {
      let activeClass = "";
      if (isActive === navLocation) {
        activeClass = "active"
      };

      return activeClass;
  };

  const handleLogout = (clickEvent) => {
      clickEvent.preventDefault()
      sessionStorage.removeItem("pandaAja_user")
      history.push("/login")
  };

  return (
    <nav className="navbar">
      <ul className="navbar">
          <img className="logo navbar__item" src="./images/logo.PNG"/>
          <li className={`navbar__item ${checkNavState("home")}`}
              onClick={() => setIsActive("home")}>
              <Link className="navbar__link" to="/">Profile</Link>
          </li>
          <li className={`navbar__item ${checkNavState("studyTips")}`}
              onClick={() => setIsActive("studyTips")}>
              <Link className="navbar__link" to="/studyTips">Study Tips</Link>
          </li>
          <li className={`navbar__item ${checkNavState("favorites")}`}
              onClick={() => setIsActive("favorites")}>
              <Link className="navbar__link" to="/favorites">Favorite Decks</Link>
          </li>
          <li className={`navbar__item ${checkNavState("quizzes")}`}
            onClick={() => setIsActive("quizzes")}>
              <Link className="navbar__link" to="/quizzes">Quizzes</Link>
          </li>
          <li className="navbar__item" 
            onClick={(clickEvent) => {handleLogout(clickEvent)}}>
              <Link className="navbar__link" to="/login">Logout</Link>
          </li>
      </ul>
    </nav>
  )
};