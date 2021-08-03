//Component's responsibility is to capture the text from the user. As the user types, the searchCardTerms state variable must immediately be 
//updated in the parent component:


import React, { useContext } from "react";
import { DeckContext } from "./DeckProvider";
import "./Deck.css";


export const CardSearch = () => {

    const { setSearchCardTerms } = useContext(DeckContext);

    return (
        <div className="search_Div">
            <div className="search_Bar">
                <div className="searchLabel">Card search:
                    <img className="search_Icon" src="https://img.icons8.com/ultraviolet/48/4a90e2/search--v1.png" alt="search icon"/>
                </div>
                <input type="text"
                    className="input__wide"
                    onKeyUp={(event) => setSearchCardTerms(event.target.value)}
                    placeholder="Search for a card..." />
            </div>
        </div>
    )
};