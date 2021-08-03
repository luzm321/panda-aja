//Component's responsibility is to capture the text from the user. As the user types, the searchTerms state variable must immediately be 
//updated in the parent component:


import React, { useContext } from "react";
import { DeckContext } from "./DeckProvider";
import "./Deck.css";


export const DeckSearch = () => {

    const { setSearchTerms } = useContext(DeckContext);

    return (
        <div className="searchDiv">
            <div className="searchBar">
                <div className="search">Deck search:
                    <img className="searchIcon" src="https://img.icons8.com/ultraviolet/48/4a90e2/search--v1.png" alt="search icon"/>
                </div>
                <input type="text"
                    className="input--wide"
                    onKeyUp={(event) => setSearchTerms(event.target.value)}
                    placeholder="Search for a deck..." />
            </div>
        </div>
    )
};